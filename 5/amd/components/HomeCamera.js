import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native'
import {Camera} from 'expo-camera'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Constants   from 'expo-constants';
let camera: Camera

import * as tf from '@tensorflow/tfjs';
import * as automl from '@tensorflow/tfjs-automl';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

export default class HomeCamera extends React.Component {


  render() {
    async function checkMultiPermissions() {
      const { status, expires, permissions } = await Permissions.getAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
      );
      if (status !== 'granted') {
        alert('Hey! You have not enabled selected permissions');
      }
    }

    // PROMPTS USER FOR PERMISSION TO ACCESS CAMERA ============================================================================
    async function getCameraAsync() {
      // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
      const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA);
      if (status === 'granted') {
        console.log("[+] Attained camera permissions")
        return
      } else {
        throw new Error('Camera permission not granted');
      }
    }

    // PROMPTS USER FOR PERMISSION TO ACCESS CAMERA ROLL =======================================================================
    async function getCameraRollAsync(){
      // permissions returns only for location permissions on iOS and under certain conditions, see Permissions.LOCATION
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status === 'granted') {
        console.log("[+] Attained camera roll permissions")
        return
      } else {
        throw new Error('Camera roll permission not granted');
      }
    }

    // LOADS THE MOVEMENT DETECTION MODEL AND STORES AS GLOBAL VARIABLE ========================================================
    async function getMovementDetectorAsync() {
        console.log("[+] Application started")
        const tfReady = await tf.ready();

        console.log("[+] Loading movement detection model")
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
    }

    const __takePicture = async () => {
      if (!camera) return
      const photo = await camera.takePictureAsync()
      this.props.navigation.navigate('PhotoPreview', {img: photo, cam: true})
    };

    const __selectImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log(result);

      if (!result.cancelled) {
        this.props.navigation.navigate('PhotoPreview', {img: result, cam: false})
      }
    };

    getMovementDetectorAsync()
    getCameraAsync()
    getCameraRollAsync()

    return (
      <Camera
        style={{flex: 1,width:"100%"}}
        ref={(r) => {
          camera = r
        }}
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
                onPress={__selectImage}
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
                onPress={__takePicture}
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
                onPress={
                  () => this.props.navigation.navigate('History')
                }
              />
            </View>
          </View>
        </View>
      </Camera>
    );
  }
}

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
