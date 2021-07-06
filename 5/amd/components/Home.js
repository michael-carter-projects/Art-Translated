import { StatusBar }         from 'expo-status-bar'
import { Camera }            from 'expo-camera'
import * as ImagePicker      from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import   React                                                         from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import * as tf              from '@tensorflow/tfjs';
import * as automl          from '@tensorflow/tfjs-automl';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

let camera: Camera // can't remember what this does

// LOADS THE MOVEMENT DETECTION MODEL AND STORES AS GLOBAL VARIABLE ========================================================
async function getMovementDetectorAsync()
{
    const tfReady = await tf.ready();
    const modelJson = await require("./assets/model/model.json");

    //console.log(modelJson);

    const modelWeight = await require("./assets/model/group1-shard.bin");
    const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeight));
    const dict = ["mannerism-late-renaissance",
                  "renaissance",
                  "baroque",
                  "northern-renaissance",
                  "post_impressionism",
                  "neoclassicism",
                  "rococo",
                  "gothic"];
    global.movementDetector = new automl.ImageClassificationModel(model, dict);

    console.log("[+] Movement detection model loaded")
}

// TAKES A PICTURE AND NAVIGATES TO PHOTO PREVIEW COMPONENT ================================================================
async function takePictureAsync(nav)
{
  if (!camera) return
  const photo = await camera.takePictureAsync();

  const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
    photo.uri,
    [{crop: {originX:200, originY:320, width:1800, height:1800}}, {resize: {width:500}}],
    {base64: true}
  );

  nav.navigate('Review', {image: { uri, width, height, base64 }, cam: true});
  console.log("[+] Photo captured")
}

// ALLOWS USER TO SELECT IMAGE FROM CAMERA ROLL ============================================================================
async function selectImageAsync(nav)
{
  let photo = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (!photo.cancelled) {
    nav.navigate('Review', {image: photo, cam: false});
    console.log("[+] Image selected")
  }
}


// =========================================================================================================================
// ON STARTUP ==============================================================================================================

getMovementDetectorAsync(); // LOAD MOVEMENT DETECTION ML MODEL
Camera.requestPermissionsAsync(); // REQUEST CAMERA PERMISSIONS
//ImagePicker.requestMediaLibraryPermissionsAsync(); // REQUEST MEDIA LIBRARY PERMISSIONS (NOT NECESSARY?)

// =========================================================================================================================
// ON SCREEN ===============================================================================================================
function Home ({navigation})
{
  return (
    <Camera
      style={{flex: 1, width:"100%", alignItems: 'center'}}
      ref={(r) => { camera = r }}
    >
      <View height={45}/>

      <View style={styles.photo_outline_outer}>
        <View style={styles.photo_outline}/>
      </View>

      <View style={styles.button_panel}>

        <View style={{flex: 1, alignItems: 'center'}} >
          <View style={styles.circlesContainer}>
            <Image
              source={require('../icons/icon_gallery.gif')}
              fadeDuration={0}
              style={{ top: 20, width: 70, height: 70 }}
            />
            <TouchableOpacity style={styles.nav_button}
              onPress={ () => selectImageAsync(navigation) }
            />
          </View>
        </View>

        <View style={{flex: 1, alignItems: 'center'}} >
          <View style={styles.circlesContainer}>
            <View style={styles.take_pic_button_outer_ring} />
            <TouchableOpacity style={styles.take_pic_button}
              onPress={ () => takePictureAsync(navigation) }
            />
          </View>
        </View>

        <View style={{flex: 1, alignItems: 'center'}} >
          <View style={styles.circlesContainer}>
            <Image
              source={require('../icons/icon_history.gif')}
              fadeDuration={0}
              style={{ top: 30, width: 50, height: 52 }}
            />
            <TouchableOpacity style={styles.nav_button}
              onPress={ () => navigation.navigate('History') }
            />
          </View>
        </View>
      </View>
      <StatusBar style="light" />
    </Camera>
  );
}

Home.navigationOptions = navigation => ({
  title: "Art Movement Image Classifer",
  headerStyle: {
    backgroundColor: '#333333',
  },
  headerTintColor: '#fff',
});


// STYLES FOR VARIOUS ELEMENTS =================================================================================================
const BASE_SIZE=110
const win = Dimensions.get('window');
const image_side = win.width*0.9;

const styles = StyleSheet.create({
  photo_outline_outer: {
    width: image_side+10,
    height: image_side+10,
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 5,
    borderTopLeftRadius:     30,
    borderTopRightRadius:    30,
    borderBottomLeftRadius:  30,
    borderBottomRightRadius: 30
  },
  photo_outline: {
    width: image_side,
    height: image_side,
    borderColor: 'rgba(0, 0, 0, 0.8)',
    borderWidth: 10,
    borderTopLeftRadius:     25,
    borderTopRightRadius:    25,
    borderBottomLeftRadius:  25,
    borderBottomRightRadius: 25
  },
  button_panel: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  circlesContainer:{
        width: BASE_SIZE,
        height: BASE_SIZE,
        alignItems: 'center',
  },
  take_pic_button_outer_ring:{
      top:BASE_SIZE*0.14, // The amount remaining
      left:BASE_SIZE*0.14,
      position: 'absolute',
      width:BASE_SIZE*0.72,
      height:BASE_SIZE*0.72,
      borderWidth:4,
      borderColor: '#FFFFFF',
      borderRadius: BASE_SIZE/2,
      backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  take_pic_button:{
      top:BASE_SIZE*0.2,
      left:BASE_SIZE*0.2,
      position: 'absolute',
      width:BASE_SIZE*0.6,
      height:BASE_SIZE*0.6, // 60% of the base size
      borderRadius: BASE_SIZE*0.6/2,
      backgroundColor: '#FFFFFF'
  },
  nav_button: {
      top:BASE_SIZE*0.2,
      left:BASE_SIZE*0.2,
      position: 'absolute',
      width:BASE_SIZE*0.6,
      height:BASE_SIZE*0.6, // 60% of the base size
      borderRadius: BASE_SIZE*0.6/2,
      backgroundColor: 'rgba(0, 0, 0, 0)'
  }
})

export default Home;
