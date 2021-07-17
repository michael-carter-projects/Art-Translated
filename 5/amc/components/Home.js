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

let camera: Camera; // camera ref to allow abort

// LOADS THE MOVEMENT DETECTION MODEL AND STORES AS GLOBAL VARIABLE ============================================================
async function getMovementDetectorAsync()
{
    const tfReady = await tf.ready();

    const rvfModelJson = await require("../assets/models/rvf-f/model.json");
    const rvfModelWeight = await require("../assets/models/rvf-f/group1-shard.bin");
    const rvfModel = await tf.loadGraphModel(bundleResourceIO(rvfModelJson, rvfModelWeight));
    global.rvfModel = new automl.ImageClassificationModel(rvfModel, global.rvfDict);

    const rModelJson = await require("../assets/models/r/model.json");
    const rModelWeight = await require("../assets/models/r/group1-shard.bin");
    const rModel = await tf.loadGraphModel(bundleResourceIO(rModelJson, rModelWeight));
    global.rModel = new automl.ImageClassificationModel(rModel, global.rDict);

    const fModelJson = await require("../assets/models/f1/model.json");
    const fModelWeight = await require("../assets/models/f1/group1-shard.bin");
    const fModel = await tf.loadGraphModel(bundleResourceIO(fModelJson, fModelWeight));
    global.fModel = new automl.ImageClassificationModel(fModel, global.fDict);

    console.log("[+] Movement detection model loaded");
}

// CONVERTS BASE64 IMAGE TO TENSORS FOR PREDICTION =============================================================================
function b64toTensor(base64) {
  const imgBuffer = tf.util.encodeString(base64, 'base64').buffer; // get image buffer from base 64
  const imgRaw = new Uint8Array(imgBuffer);                      // convert image buffer to array of ints
  return decodeJpeg(imgRaw);                                   // convert array of ints to image tensors
}

// RUN GIVEN TENSOR IMAGE THROUGH MODEL TREE ===================================================================================
async function predict(imgTensor)
{
  const pred = await global.rvfModel.classify(imgTensor);

  var rvf = 'fakey';
  if (pred[0].prob > pred[1].prob) { rvf = 'realey'; }

  console.log('rvf: ', rvf);

  if (rvf.localeCompare('realey') === 0) {
    global.prediction = await global.rModel.classify(imgTensor);
  }
  else {
    global.prediction = await global.fModel.classify(imgTensor);
  }


}



// ON STARTUP ==================================================================================================================
getMovementDetectorAsync(); // LOAD MOVEMENT DETECTION ML MODEL
Camera.requestPermissionsAsync(); // REQUEST CAMERA PERMISSIONS
//ImagePicker.requestMediaLibraryPermissionsAsync(); // REQUEST MEDIA LIBRARY PERMISSIONS (NOT NECESSARY?)


// ON SCREEN ===================================================================================================================
function Home ({navigation})
{
  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);

  // SELECT AN IMAGE, MAKE A PREDICTION, STORE AS GLOBAL VARIABLE ================================================================
  async function selectPicAndPredictMovementAsync(nav)
  {
    // PICK AN IMAGE FROM GALLERY OR CAMERA ROLL AND ALLOW USER TO CROP -----------------------
    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality:1 });

    // IF THE USER DID NOT CANCEL IMAGE SELECTION, MAKE PREDICTION ----------------------------
    if (!photo.cancelled)
    {
      setInProgress(true); // set inProgress hook to true for progress bar

      // RESIZE IMAGE and CONVERT TO BASE 64 --------------------------------------------------
      const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
        photo.uri, [{resize: {width:224}}], {base64: true}
      );

      // CONVERT BASE^$ IMAGE TO TENSORS AND MAKE PREDICTION ----------------------------------
      global.prediction = await global.rModel.classify(b64toTensor(base64));

      nav.navigate('Predictions', {image: uri}); // navigate to Predictions page

      setInProgress(false); // reset inProgress hook to false
    }
  }

  // SELECT IMAGE, MAKE A PREDICTION, STORE AS GLOBAL VARIABLE ===================================================================
  async function takePicAndPredictMovementAsync(nav)
  {
    if (!camera) return // stop execution if camera is undefined/null
    const photo = await camera.takePictureAsync(); // take picture using camera
    setInProgress(true); // set inProgress hook to true for progress bar

    // CROP, RESIZE, and CONVERT IMAGE TO BASE 64 ---------------------------------------------
    const { uri, width, height, base64 } = await ImageManipulator.manipulateAsync(
      photo.uri,
      [{crop:   {originX:0, originY:0, width:photo.width, height:photo.width}},
       {resize: {width:224}}],
      {base64: true}
    );

    // CONVERT BASE64 IMAGE TO TENSORS AND MAKE PREDICTION ------------------------------------
    await predict(b64toTensor(base64));

    nav.navigate('Predictions', {image: uri}); // navigate to Predictions page
    setInProgress(false); // reset inProgress hook to false
  }


  // RENDER THE VIEWS FOR THE HOME PAGE ========================================================================================
  return (
    <ImageBackground source={global.bg} style={{flex: 1, width:"100%", alignItems: 'center'}}>

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
                source={require('../assets/buttons/icon_gallery.gif')}
                style={{ top: 20, width: 70, height: 70 }}
              />
              <TouchableOpacity style={styles.nav_button}
                onPress={ () => {selectPicAndPredictMovementAsync(navigation);}}
              />
            </View>
          </View>

          <View style={{flex: 1, alignItems: 'center'}} >
            <View style={styles.circlesContainer}>
              <View style={styles.take_pic_button_outer_ring} />
              <TouchableOpacity style={styles.take_pic_button}
                onPress={ () => {takePicAndPredictMovementAsync(navigation);}}
              />
            </View>
          </View>

          <View style={{flex: 1, alignItems: 'center'}} >
            <View style={styles.circlesContainer}>
              <Image
                source={require('../assets/buttons/icon_history.gif')}
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
  image: {
      alignSelf: 'center',
      width: image_side,
      height: image_side,
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 5,
      borderRadius: 15,
  },
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
