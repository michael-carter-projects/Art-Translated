import { Camera }            from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as ImagePicker      from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as SplashScreen     from 'expo-splash-screen';
import { StatusBar }         from 'expo-status-bar';

import   React, { useState, useEffect, useCallback }                                    from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                                                    from 'react-native-progress';

import * as tf                          from '@tensorflow/tfjs';
import * as automl                      from '@tensorflow/tfjs-automl';
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';

let camera: Camera; // camera ref to allow abort


// CONVERTS BASE64 IMAGE TO TENSORS FOR PREDICTION =============================================================================
function b64toTensor(base64) {
  const imgBuffer = tf.util.encodeString(base64, 'base64').buffer; // get image buffer from base 64
  const imgRaw = new Uint8Array(imgBuffer);                      // convert image buffer to array of ints
  return decodeJpeg(imgRaw);                                   // convert array of ints to image tensors
}

// GETS HIGHEST PROB GIVEN A PREDICTION ========================================================================================
function get_max_pred(pred) {
  var max = 0;
  for (var i=0; i < pred.length; i++) {
    if (pred[i].prob > max) {
      max = pred[i].prob;
    }
  }
  return max;
}

// RUN GIVEN TENSOR IMAGE THROUGH MODEL TREE ===================================================================================
async function predict(imgTensor) {
  const pred = await global.rvfModel.classify(imgTensor);

  var rvf = 'fakey';
  if (pred[0].prob > pred[1].prob) { rvf = 'realey'; }

  if (rvf.localeCompare('realey') === 0) {
    const pred2 = await global.rModel.classify(imgTensor);

    if (pred2[3].prob >= get_max_pred(pred2)) {
      global.prediction = await global.renModel.classify(imgTensor);
    }
    else {
      global.prediction = pred2;
    }

  }
  else {
    global.prediction = await global.fModel.classify(imgTensor);
  }
}


// ON STARTUP ==================================================================================================================
Camera.requestPermissionsAsync(); // REQUEST CAMERA PERMISSIONS
//ImagePicker.requestMediaLibraryPermissionsAsync(); // REQUEST MEDIA LIBRARY PERMISSIONS (NOT NECESSARY?)

// ON SCREEN ===================================================================================================================
function Home ({navigation})
{
  const [inProgress, setInProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  const [appIsReady, setAppIsReady] = useState(false);


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


  // LOAD ML MODEL TREE DURING SPLASH SCREEN =====================================================================================
  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

        global.bg = require('../assets/backgrounds/bg3.png');

        const tfReady = await tf.ready();

        var rvfModelJson = null;
        var rvfModelWeight = null;
        switch (global.MODEL_MODES[2]) {
          case 0:
            rvfModelJson = await require("../assets/models/rvf-s-a/model.json");
            rvfModelWeight = await require("../assets/models/rvf-s-a/group1-shard.bin");
            break;
          case 1:
            rvfModelJson = await require("../assets/models/rvf-s-b/model.json");
            rvfModelWeight = await require("../assets/models/rvf-s-b/group1-shard.bin");
            break;
          case 2:
            rvfModelJson = await require("../assets/models/rvf-s-f/model.json");
            rvfModelWeight = await require("../assets/models/rvf-s-f/group1-shard.bin");
            break;
          default:
            rvfModelJson = await require("../assets/models/rvf-s-f/model.json");
            rvfModelWeight = await require("../assets/models/rvf-s-f/group1-shard.bin");
            break;
        }

        var fModelJson = null;
        var fModelWeight = null;
        switch (global.MODEL_MODES[4]) {
          case 0:
            fModelJson = await require("../assets/models/f-s-a/model.json");
            fModelWeight = await require("../assets/models/f-s-a/group1-shard.bin");
            break;
          case 1:
            fModelJson = await require("../assets/models/f-s-b/model.json");
            fModelWeight = await require("../assets/models/f-s-b/group1-shard.bin");
            break;
          case 2:
            fModelJson = await require("../assets/models/f-s-f/model.json");
            fModelWeight = await require("../assets/models/f-s-f/group1-shard.bin");
            break;
          default:
            fModelJson = await require("../assets/models/f-s-f/model.json");
            fModelWeight = await require("../assets/models/f-s-f/group1-shard.bin");
            break;
        }

        var rModelJson = null;
        var rModelWeight = null;
        switch (global.MODEL_MODES[5]) {
          case 0:
            rModelJson = await require("../assets/models/r-s-a/model.json");
            rModelWeight = await require("../assets/models/r-s-a/group1-shard.bin");
            break;
          case 1:
            rModelJson = await require("../assets/models/r-s-b/model.json");
            rModelWeight = await require("../assets/models/r-s-b/group1-shard.bin");
            break;
          case 2:
            rModelJson = await require("../assets/models/r-s-f/model.json");
            rModelWeight = await require("../assets/models/r-s-f/group1-shard.bin");
            break;
          default:
            rModelJson = await require("../assets/models/r-s-f/model.json");
            rModelWeight = await require("../assets/models/r-s-f/group1-shard.bin");
            break;
        }

        var renModelJson = null;
        var renModelWeight = null;
        switch (global.MODEL_MODES[6]) {
          case 0:
            renModelJson = await require("../assets/models/ren-s-a/model.json");
            renModelWeight = await require("../assets/models/ren-s-a/group1-shard.bin");
            break;
          case 1:
            renModelJson = await require("../assets/models/ren-s-b/model.json");
            renModelWeight = await require("../assets/models/ren-s-b/group1-shard.bin");
            break;
          case 2:
            renModelJson = await require("../assets/models/ren-s-f/model.json");
            renModelWeight = await require("../assets/models/ren-s-f/group1-shard.bin");
            break;
          default:
            renModelJson = await require("../assets/models/ren-s-f/model.json");
            renModelWeight = await require("../assets/models/ren-s-f/group1-shard.bin");
            break;
        }

        const rvfModel = await tf.loadGraphModel(bundleResourceIO(rvfModelJson, rvfModelWeight));
        global.rvfModel = new automl.ImageClassificationModel(rvfModel, global.rvfDict);

        const fModel = await tf.loadGraphModel(bundleResourceIO(fModelJson, fModelWeight));
        global.fModel = new automl.ImageClassificationModel(fModel, global.fDict);

        const rModel = await tf.loadGraphModel(bundleResourceIO(rModelJson, rModelWeight));
        global.rModel = new automl.ImageClassificationModel(rModel, global.rDict);

        const renModel = await tf.loadGraphModel(bundleResourceIO(renModelJson, renModelWeight));
        global.renModel = new automl.ImageClassificationModel(renModel, global.renDict);


      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);
  if (!appIsReady) {
    return null;
  }


  // RENDER THE VIEWS FOR THE HOME PAGE ========================================================================================
  return (

    <ImageBackground onLayout={onLayoutRootView} source={global.bg} style={{flex: 1, width:"100%", alignItems: 'center'}}>

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
                source={require('../assets/buttons/icon_info.png')}
                style={{ top: 30, width: 55, height: 52 }}
              />
              <TouchableOpacity style={styles.nav_button}
                onPress={ () => navigation.navigate('TreeInfo') }
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
