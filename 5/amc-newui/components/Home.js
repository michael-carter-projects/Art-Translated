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
function b64_to_tensor(base64) {
  const imgBuffer = tf.util.encodeString(base64, 'base64').buffer; // get image buffer from base 64
  const imgRaw = new Uint8Array(imgBuffer);                      // convert image buffer to array of ints
  return decodeJpeg(imgRaw);                                   // convert array of ints to image tensors
}

// INSERTS A PREDICTION INTO A LIST OF PREDICTIONS SORTED BY DESCENDING PROBABILITY ============================================
function insert_descending(sorted_results, prediction) {

  if (prediction.label === 'renaissancish' || prediction.label === 'abstractish') {
    return sorted_results;
  }

  var index = sorted_results.length;

  for (var i=0; i < sorted_results.length; i++) {
    if (prediction.prob > sorted_results[i].prob) {
      index = i;
      break;
    }
  }
  sorted_results.splice(index, 0, prediction)
  //console.log(sorted_results);
  return sorted_results;
}

// GIVEN A PROBABILITY SCORE, RETURNS JSON: { "MOVEMENT MAP", "PROBABILITY" } ==================================================
function get_movement_info(prediction) {
  // SEARCH MOVEMENT MAP FOR INFO OF MOVEMENT ----------------------------------
  const label = JSON.stringify(prediction.label);

  for (var i = 0; i < global.movementMap.length; i++) {
    if (global.movementMap[i].key === label.replace(/['"]+/g, '')) {
      return { map:  global.movementMap[i],
               prob: (parseFloat(prediction.prob)*100).toFixed(2)
             }
    }
  }
}

// GETS LIST OF PREDICTIONS SORTED BY DESCENDING PROBABILITY ABOVE CERTAIN PROBABILITY =========================================
function get_predictions_info(two, ren, abs, threshold) {

  var sorted_results = [two[0]];

  for (var i=1; i < two.length; i++) {
    sorted_results = insert_descending(sorted_results, two[i]);
  }
  for (var i=0; i < ren.length; i++) {
    sorted_results = insert_descending(sorted_results, ren[i]);
  }
  for (var i=0; i < abs.length; i++) {
    sorted_results = insert_descending(sorted_results, abs[i]);
  }

  /*var threshold_index = sorted_results.length-1;
  for (var i=0; i < sorted_results.length; i++) {
    if (sorted_results[i].prob < threshold) {
      threshold_index = i;
      break;
    }
  }
  sorted_results = sorted_results.slice(0, threshold_index);
  */

  var sorted_info = [];
  for (var i=0; i < sorted_results.length; i++) {
    sorted_info.splice(i, 0, get_movement_info(sorted_results[i]));
  }

  return sorted_info;
}

// RUN GIVEN TENSOR IMAGE THROUGH MODEL TREE ===================================================================================
async function predict_tree(imgTensor) {

  const threshold_FIN = 0.0; // probability with which movement must be predicted to display on page

  const threshold_REN = 0.5; // probability with which "renaissancish" must be predicted to run renaissancish model
  const threshold_ABS = 0.5; // probability with which "abstractish"   must be predicted to run abstractish model

  var predictionREN = []; // list for storing renaissancish predictions
  var predictionABS = []; // list for storing abstractish predictions

  console.log("[+] Running Two Dimensional")
  const predictionTWO = await global.twoDimensionalTF.classify(imgTensor); // run 2D model

  if (predictionTWO[8].prob  > threshold_REN) { // renaissancish = 8
    predictionREN = await global.renaissancishTF.classify(imgTensor);
    console.log("[+] Running Renaissancish")
  }
  if (predictionTWO[13].prob > threshold_ABS) { // abstractish = 13
    predictionABS = await global.abstractishTF.classify(imgTensor);
    console.log("[+] Running Abstractish")
  }

  //global.predictions_info = get_predictions_info(predictionTWO, predictionREN, predictionABS, threshold_FIN);
  return get_predictions_info(predictionTWO, predictionREN, predictionABS, threshold_FIN);
}


// ON STARTUP ==================================================================================================================
Camera.requestPermissionsAsync(); // REQUEST CAMERA PERMISSIONS
//ImagePicker.requestMediaLibraryPermissionsAsync(); // REQUEST MEDIA LIBRARY PERMISSIONS (NOT NECESSARY?)

// ON SCREEN ===================================================================================================================
function Home ({navigation})
{
  const [inProgress, setInProgress] = useState(false);
  const [progress,   setProgress  ] = useState(0);
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
      // await predict_tree(b64_to_tensor(base64));
      const predictions = await predict_tree(b64_to_tensor(base64));

      //nav.navigate('Predictions', {selected_image_uri: uri}); // navigate to Predictions page
      nav.navigate('Predictions', {selected_image_uri: uri, predictions: predictions}); // navigate to Predictions page

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
    //await predict_tree(b64_to_tensor(base64));
    const predictions = await predict_tree(b64_to_tensor(base64));

    //nav.navigate('Predictions', {selected_image_uri: uri}); // navigate to Predictions page
    nav.navigate('Predictions', {selected_image_uri: uri, predictions: predictions}); // navigate to Predictions page

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

        const twoDimensionalModel   = await require("../assets/models/twodimensional/model.json");
        const twoDimensionalWeights = await require("../assets/models/twodimensional/weights.bin");
        const twoDimensionalTF = await tf.loadGraphModel(bundleResourceIO(twoDimensionalModel, twoDimensionalWeights));
        global.twoDimensionalTF = new automl.ImageClassificationModel(twoDimensionalTF, global.twoDimensionalDict);

        const abstractishModel   = await require("../assets/models/abstractish/model.json");
        const abstractishWeights = await require("../assets/models/abstractish/weights.bin");
        const abstractishTF = await tf.loadGraphModel(bundleResourceIO(abstractishModel, abstractishWeights));
        global.abstractishTF = new automl.ImageClassificationModel(abstractishTF, global.abstractishDict);

        const renaissancishModel   = await require("../assets/models/renaissancish/model.json");
        const renaissancishWeights = await require("../assets/models/renaissancish/weights.bin");
        const renaissancishTF = await tf.loadGraphModel(bundleResourceIO(renaissancishModel, renaissancishWeights));
        global.renaissancishTF = new automl.ImageClassificationModel(renaissancishTF, global.renaissancishDict);

      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);
  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
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
            <Camera style={{flex: 1, width:"100%", alignItems: 'center', overflow:'hidden'}} ref={(r) => { camera = r }}>
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
