import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native'
import {Camera} from 'expo-camera'
import * as ImagePicker from 'expo-image-picker';
import * as Constants   from 'expo-constants';
let camera: Camera

import * as tf from '@tensorflow/tfjs';
import * as automl from '@tensorflow/tfjs-automl';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';


// LOADS THE MOVEMENT DETECTION MODEL AND STORES AS GLOBAL VARIABLE ========================================================
async function getMovementDetectorAsync()
{
    console.log("[+] Application started")
    const tfReady = await tf.ready();

    console.log("    Loading movement detection model...")
    const modelJson = await require("./assets/model/model.json");
    const modelWeight = await require("./assets/model/group1-shard.bin");
    const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight));
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
  nav.navigate('PhotoPreview', {img: photo, cam: true});
}

// ALLOWS USER TO SELECT IMAGE FROM CAMERA ROLL ============================================================================
async function selectImageAsync(nav)
{
  let photo = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All,
                                                          allowsEditing: true,
                                                          aspect: [4, 3],
                                                          quality: 1,
                                                        });
  if (!photo.cancelled) {
    nav.navigate('PhotoPreview', {img: photo, cam: false});
  }
}

// =========================================================================================================================
// ON STARTUP ==============================================================================================================

getMovementDetectorAsync(); // LOAD MOVEMENT DETECTION ML MODEL
Camera.requestPermissionsAsync(); // REQUEST CAMERA PERMISSIONS
//ImagePicker.requestMediaLibraryPermissionsAsync(); // REQUEST MEDIA LIBRARY PERMISSIONS (NOT NECESSARY?)

// =========================================================================================================================
// ON SCREEN ===============================================================================================================
function HomeCamera ({navigation})
{
  return (
    <Camera
      style={{flex: 1,width:"100%"}}
      ref={(r) => { camera = r }}
    >
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row',
          flex: 1,
          width: '100%',
          padding: 20,
          justifyContent: 'space-between'
        }}
      >
        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            alignItems: 'center'
          }}
        >
          <View style={styles.circlesContainer}>
            <Image
              source={require('../icons/icon_gallery.gif')}
              fadeDuration={0}
              style={{ top: 20, width: 70, height: 70 }}
            />
            <TouchableOpacity style={styles.gallery_button}
              onPress={ () => selectImageAsync(navigation) }
            />
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            alignItems: 'center'
          }}
        >
          <View style={styles.circlesContainer}>
            <View style={styles.take_pic_button_outer_ring} />
            <TouchableOpacity style={styles.take_pic_button}
              onPress={ () => takePictureAsync(navigation) }
            />
          </View>
        </View>
        <View
          style={{
            alignSelf: 'center',
            flex: 1,
            alignItems: 'center'
          }}
        >
          <View style={styles.circlesContainer}>
            <Image
              source={require('../icons/icon_history.gif')}
              fadeDuration={0}
              style={{ top: 30, width: 50, height: 52 }}
            />
            <TouchableOpacity style={styles.history_button}
              onPress={ () => navigation.navigate('History') }
            />
          </View>
        </View>
      </View>
    </Camera>
  );
}

HomeCamera.navigationOptions = navigation => ({
  title: "Art Movement Image Classifer",
  headerStyle: {
    backgroundColor: '#333333', //'#444444',
  },
  headerTintColor: '#fff',
});


// STYLES FOR VARIOUS ELEMENTS =================================================================================================
const BASE_SIZE=110

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#555',
    alignItems: 'center',
    justifyContent: 'center'
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
  gallery_button:{
      top:BASE_SIZE*0.2,
      left:BASE_SIZE*0.2,
      position: 'absolute',
      width:BASE_SIZE*0.6,
      height:BASE_SIZE*0.6, // 60% of the base size
      borderRadius: BASE_SIZE*0.6/2,
      backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  history_button:{
      top:BASE_SIZE*0.2,
      left:BASE_SIZE*0.2,
      position: 'absolute',
      width:BASE_SIZE*0.6,
      height:BASE_SIZE*0.6, // 60% of the base size
      borderRadius: BASE_SIZE*0.6/2,
      backgroundColor: 'rgba(0, 0, 0, 0)'
  }
})

export default HomeCamera;
