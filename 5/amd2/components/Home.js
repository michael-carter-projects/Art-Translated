import { StatusBar }         from 'expo-status-bar';
import { Camera }            from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as ImagePicker      from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import   React, { useState, useEffect }                                                 from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                                                    from 'react-native-progress';

import * as tf                          from '@tensorflow/tfjs';
import * as automl                      from '@tensorflow/tfjs-automl';
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';

let camera: Camera; // can't remember what this does

// LOADS THE MOVEMENT DETECTION MODEL AND STORES AS GLOBAL VARIABLE ========================================================
async function getMovementDetectorAsync()
{
    const tfReady = await tf.ready();
    const modelJson = await require("./assets/model/model.json");
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

    console.log("[+] Movement detection model loaded");
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
  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  // SELECT AN IMAGE, MAKE A PREDICTION, STORE AS GLOBAL VARIABLE ================================================================
  async function selectPicAndPredictMovementAsync(nav)
  {
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!photo.cancelled) {
      console.log('[+] Image selected');
    }

    const imgB64 = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
    });
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const imgRaw = new Uint8Array(imgBuffer);
    const imgTensor = decodeJpeg(imgRaw);

    global.prediction = await global.movementDetector.classify(imgTensor);

    nav.navigate('Predictions', {image: photo.uri});
    setInProgress(false);

    console.log("[+] Prediction Complete \n");
  }

  // SELECT IMAGE, MAKE A PREDICTION, STORE AS GLOBAL VARIABLE ===================================================================
  async function takePicAndPredictMovementAsync(nav)
  {
    if (!camera) return
    const photo = await camera.takePictureAsync();

    const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{crop: {originX:0, originY:0, width:photo.width, height:photo.width}}, {resize: {width:224}}],
      {base64: true}
    );
    console.log("[+] Photo captured");

    const imgB64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
    });
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const imgRaw = new Uint8Array(imgBuffer);
    const imgTensor = decodeJpeg(imgRaw);

    global.prediction = await global.movementDetector.classify(imgTensor);

    nav.navigate('Predictions', {image: uri});
    setInProgress(false);

    console.log("[+] Prediction Complete \n");
  }


 /*
 { inProgress ?
   (
     <View style={{justifyContent:'center'}}>
       <Progress.Bar
         animationType={'timing'}
         borderRadius={15}
         borderWidth={5}
         color={'rgba(255, 255, 255, 1)'}
         height={75}
         indeterminate={true}
         width={image_side}
       />
     </View>
   ) : (null)
 }
 */

  return (

    <ImageBackground source={require('./assets/images/bg3.png')} style={{flex: 1, width:"100%", alignItems: 'center'}}>

        <View height={25}/>

        <View style={styles.photo_outline_outer}>
          <Camera
            style={{flex: 1, width:"100%", alignItems: 'center', overflow:'hidden'}}
            ref={(r) => { camera = r }}
          >
            <View style={styles.photo_outline}/>
          </Camera>
        </View>

        <View height={25}/>

        { inProgress ?
          (
            <View style={{alignItems:'center', paddingTop: 40, justifyContent:'space-between'}}>
              <Text style={{fontSize:24, color:'rgba(255,255,255,1)', fontFamily:'System'}}>
                analyzing... beep boop
              </Text>
              <Text/>
              <Progress.Bar
                animationType={'timing'}
                borderRadius={15}
                borderWidth={5}
                color={'rgba(255, 255, 255, 1)'}
                height={10}
                indeterminate={true}
                width={image_side}
              />
            </View>
          ) : (null)
        }

        <View style={styles.button_panel}>

          <View style={{flex: 1, alignItems: 'center'}} >
            <View style={styles.circlesContainer}>
              <Image
                source={require('../icons/icon_gallery.gif')}
                fadeDuration={0}
                style={{ top: 20, width: 70, height: 70 }}
              />
              <TouchableOpacity style={styles.nav_button}
                onPress={ () => {selectPicAndPredictMovementAsync(navigation); setInProgress(true);}}
              />
            </View>
          </View>

          <View style={{flex: 1, alignItems: 'center'}} >
            <View style={styles.circlesContainer}>
              <View style={styles.take_pic_button_outer_ring} />
              <TouchableOpacity style={styles.take_pic_button}
                onPress={ () => {takePicAndPredictMovementAsync(navigation); setInProgress(true);}}
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

    </ImageBackground>
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
    width: image_side,
    height: image_side,
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 5,
    borderRadius: 15,
  },
  photo_outline: {
    width: image_side,
    height: image_side,
    borderColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 5,
    borderRadius: 15,
    position: 'absolute',
    top: -5,
  },
  button_panel: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.0)'
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
