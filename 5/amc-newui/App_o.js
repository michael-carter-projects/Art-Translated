
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { Camera as CamComp}  from 'expo-camera';
import * as FileSystem       from 'expo-file-system';
import * as Font             from 'expo-font';
import * as ImagePicker      from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as SplashScreen     from 'expo-splash-screen';
import { StatusBar }         from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import   React, { useState, useEffect, useCallback }                        from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Progress                                                        from 'react-native-progress';
import Svg, { Circle, Line }                                                from 'react-native-svg';

import * as tf                          from '@tensorflow/tfjs';
import * as automl                      from '@tensorflow/tfjs-automl';
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';

let camera: CamComp; // camera ref to allow abort

// STYLES FOR VARIOUS ELEMENTS =================================================================================================
const teal   = 'rgba(  0,  75,  95, 1)'; //global.colors.teal;
const orange = 'rgba(242, 154, 124, 1)'; //global.colors.orange;
const white  = 'rgba(255, 255, 255, 1)'; //global.colors.white;
const grey   = 'rgba(180, 180, 180, 1)'; //global.colors.grey;
const black  = 'rgba(  0,   0,   0, 1)'; //global.colors.black;

const screen_dimensions = Dimensions.get('window');
const screen_width  = screen_dimensions.width;   // iPhone 12 Mini: 375
const screen_height = screen_dimensions.height; //  iPhone 12 Mini: 812

const image_side = screen_dimensions.width*0.9;

const shadow_size = image_side*3;
const shadow_border = image_side;
const shadow_offset = image_side*0.8*-1;

const title_bar_height = screen_height*0.11;

const button_panel_height = screen_height*0.12;

const navigation_bar_height = screen_height*0.1;

const photos_page_spacing = 5;
const photos_page_image_size = (screen_width - 5*photos_page_spacing) / 4;

const styles = StyleSheet.create({
  camera_title_bar: {
    position: 'absolute',
    top: 0,
    height: title_bar_height,
    width: screen_width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  photo_outline: {
    width: image_side,
    height: image_side,
    borderColor: white,
    borderWidth: 2,
  },
  transparent_frame: {
    top: shadow_offset,
    width: shadow_size,
    height: shadow_size,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderWidth: shadow_border,
  },
  button_panel: {
    position: 'absolute',
    bottom: navigation_bar_height + 15,
    width: screen_width,
    height: button_panel_height,
    alignItems: 'center',
  },
  nav_panel_outer: {
    position: 'absolute',
    bottom: 0,
    width: screen_width,
    height: navigation_bar_height,
    backgroundColor: white
  },
  nav_panel_inner: {
    width: screen_width,
    height: navigation_bar_height * (7/8),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nav_button: {
    alignItems: 'center',
    width: screen_width/2,
  },
  nav_button_text: {
    fontSize: 20,
    fontFamily:'ArgentumSansLight'
  },
  nav_selection_camera: {
    width: screen_width/2,
    height: navigation_bar_height/8,
    borderTopRightRadius: navigation_bar_height/16,
    borderBottomRightRadius: navigation_bar_height/16,
    backgroundColor: teal
  },
  nav_selection_photos: {
    left: screen_width/2,
    height: navigation_bar_height/8,
    width: screen_width/2,
    borderTopLeftRadius: navigation_bar_height/16,
    borderBottomLeftRadius: navigation_bar_height/16,
    backgroundColor: teal
  },
  photo_selection_page: {
    position: 'absolute',
    bottom: navigation_bar_height,
    width:screen_width,
    height: screen_height - navigation_bar_height,
    backgroundColor: white,
  },
  photo_title_bar: {
    height: title_bar_height,
    width: screen_width,
    backgroundColor: white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center',
  },
  image_row: {
    width: screen_width,
    height: (screen_width - 25)/4 + 5,
    paddingTop:   5,
    paddingLeft:  5,
    paddingRight: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    width:  photos_page_image_size,
    height: photos_page_image_size,
    backgroundColor: grey
  },

})


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

  return get_predictions_info(predictionTWO, predictionREN, predictionABS, threshold_FIN);
}

// ON STARTUP ==================================================================================================================
CamComp.requestPermissionsAsync(); // REQUEST CAMERA PERMISSIONS
//ImagePicker.requestMediaLibraryPermissionsAsync(); // REQUEST MEDIA LIBRARY PERMISSIONS (NOT NECESSARY?)

export default function App() {

  const [isCameraScreen, setCameraScreen] = useState(true);

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
      //const predictions = await predict_tree(b64_to_tensor(base64));

      //nav.navigate('Predictions', {selected_image_uri: uri, predictions: predictions}); // navigate to Predictions page

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
    //const predictions = await predict_tree(b64_to_tensor(base64));

    //nav.navigate('Predictions', {selected_image_uri: uri, predictions: predictions}); // navigate to Predictions page

    setInProgress(false); // reset inProgress hook to false
  }

  // LOAD ML MODEL TREE DURING SPLASH SCREEN =====================================================================================
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();  // Keep the splash screen visible while we fetch resources

        global.bg = require('./assets/backgrounds/bg3.png');

        await Font.loadAsync({ ArgentumSansLight: require('./assets/fonts/argentum-sans.light.ttf')});
        console.log("[+] Fonts loaded")

        /*const tfReady = await tf.ready();
        const twoDimensionalModel   = await require("./assets/models/twodimensional/model.json");
        const twoDimensionalWeights = await require("./assets/models/twodimensional/weights.bin");
        const twoDimensionalTF = await tf.loadGraphModel(bundleResourceIO(twoDimensionalModel, twoDimensionalWeights));
        global.twoDimensionalTF = new automl.ImageClassificationModel(twoDimensionalTF, global.twoDimensionalDict);
        console.log('[+] Tensorflow model A loaded');
        const abstractishModel   = await require("./assets/models/abstractish/model.json");
        const abstractishWeights = await require("./assets/models/abstractish/weights.bin");
        const abstractishTF = await tf.loadGraphModel(bundleResourceIO(abstractishModel, abstractishWeights));
        global.abstractishTF = new automl.ImageClassificationModel(abstractishTF, global.abstractishDict);
        console.log('[+] Tensorflow model B loaded');
        const renaissancishModel   = await require("./assets/models/renaissancish/model.json");
        const renaissancishWeights = await require("./assets/models/renaissancish/weights.bin");
        const renaissancishTF = await tf.loadGraphModel(bundleResourceIO(renaissancishModel, renaissancishWeights));
        global.renaissancishTF = new automl.ImageClassificationModel(renaissancishTF, global.renaissancishDict);
        console.log('[+] Tensorflow model C loaded');*/

        console.log("ALL ASSETS LOADED")
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

  return (
    <View onLayout={onLayoutRootView} style={{ width:screen_width, height: screen_height }}>
      <CamComp style={{flex: 1, paddingTop: 80, alignItems: 'center', overflow:'hidden'}} ref={(r) => { camera = r }}>

        <View style={styles.transparent_frame}>
          <View style={styles.photo_outline}/>

          { inProgress ?
            (
              <View style={{alignItems:'center', paddingTop: 40, justifyContent:'space-between'}}>
                <Text style={{fontSize:24, color:white, fontFamily:'ArgentumSansLight'}}>
                  analyzing...
                </Text>
                <Text/>
                <Progress.Bar
                  animationType={'timing'}
                  borderRadius={15}
                  borderWidth={5}
                  color={white}
                  height={10}
                  indeterminate={true}
                  width={image_side/1.5}
                />
              </View>
            ) : (null) }

        </View>

        <View style={styles.button_panel}>
          <Svg>
            <Circle
              cx={screen_width/2}
              cy={button_panel_height/2}
              r={button_panel_height/2}
              fill={white}
            />
            <Circle
              cx={screen_width/2}
              cy={button_panel_height/2}
              r={button_panel_height/2 - 4}
              fill={teal}
            />
            <Circle
              cx={screen_width/2}
              cy={button_panel_height/2}
              r={button_panel_height/2 - 8}
              fill={orange}
            />
            <Circle
              cx={screen_width/2}
              cy={button_panel_height/2}
              r={button_panel_height/2 - 10}
              fill={white}
              onPress={() => setInProgress(!inProgress)}
            />
          </Svg>
        </View>

      </CamComp>

      <View style={styles.nav_panel_outer}>

        { isCameraScreen ? (<View style={styles.nav_selection_camera}/>)
                         : (<View style={styles.nav_selection_photos}/>) }

        <View style={styles.nav_panel_inner}>

          <TouchableOpacity onPress={() => setCameraScreen(true)}>
            <View style={styles.nav_button}>
              <Text style={styles.nav_button_text}>Camera</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setCameraScreen(false)}>
            <View style={styles.nav_button}>
              <Text style={styles.nav_button_text}>Photos</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>


      { isCameraScreen ? (
        <View style={styles.camera_title_bar}>

          <View style={{width: screen_width/3, alignItems:'center'}}>
            <Ionicons name="ios-close" size={55} color={white} style={{position: 'absolute', left:title_bar_height*0.3, bottom: title_bar_height*-0.55}}/>
          </View>

          <View style={{width: screen_width/3, alignItems:'center'}}/>

          <View style={{width: screen_width/3, alignItems:'center'}}>
            <Ionicons name="md-help-circle" size={37} color={white} style={{position: 'absolute', right: title_bar_height*0.3, bottom: title_bar_height*-0.48}}/>
          </View>

          <StatusBar style="light" />
        </View>
      ) : (
        <View style={styles.photo_selection_page}>
          <View style={styles.photo_title_bar}>

            <View style={{width: screen_width/3, alignItems:'center'}}>
              <Ionicons name="ios-close" size={55} color={teal} style={{position: 'absolute', left:title_bar_height*0.3, bottom: title_bar_height*-0.55}}/>
            </View>

            <View style={{width: screen_width/3, alignItems:'center'}}>
              <Text style={{position: 'absolute', bottom: title_bar_height*-0.4, fontSize:26, color:black, fontFamily:'ArgentumSansLight'}}>Photos</Text>
            </View>

            <View style={{width: screen_width/3, alignItems:'center'}}/>
          </View>

          <ScrollView>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
            <View style={styles.image_row}>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
              <View style={styles.image}/>
            </View>
          </ScrollView>

          <StatusBar style="dark" />
        </View>
        ) }
    </View>
  );
}
