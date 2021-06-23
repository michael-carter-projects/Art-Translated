import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import React, { useState, useEffect } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";

import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';

// MAKE A PREDICTION AND STORE AS GLOBAL VARIABLE ==========================================================================
async function predictMovementAsync(uri, nav)
{
    const imgB64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
    });
    const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
    const imgRaw = new Uint8Array(imgBuffer);
    const imgTensor = decodeJpeg(imgRaw);

    global.prediction = await global.movementDetector.classify(imgTensor.resizeBilinear([224,224]));

    nav.navigate('Predictions', {image: uri});

    console.log("[+] Prediction Complete \n");
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
  if (!photo.cancelled)
  {
    nav.navigate('Review', {image: photo, cam: false});
  }
}


// ON SCREEN ===============================================================================================================

function Review ({navigation})
{
  const { uri, width, height, base64 } = navigation.state.params.image;
  const backToCamera = navigation.state.params.cam;

  return (
    <View style={styles.outer_view}>

      <View height={45}/>

      <View style={styles.photo_outline}>
        <Image source={{uri: uri}} style={styles.image}/>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          flexDirection: 'column',
          flex: 1,
          width: '100%',
          padding: 50,
          justifyContent: 'space-between'
        }}
      >
        <AwesomeButton
          progress
          stretch
          backgroundColor={'#323264'}
          backgroundDarker={'#161632'}
          borderRadius={15}
          textSize={18}
          fontFamily={'System'}
          onPress={() => predictMovementAsync(uri, navigation)}
        >PREDICT MOVEMENT
        </AwesomeButton>
        <View height={10}/>

        { backToCamera ? (
          <AwesomeButton
              stretch
              backgroundColor={'#525284'}
              backgroundDarker={'#363652'}
              borderRadius={15}
              textSize={18}
              fontFamily={'System'}
              onPress={ () => navigation.navigate('Home') }
          >RETAKE PHOTO
          </AwesomeButton>
        ) : (
          <AwesomeButton
              stretch
              backgroundColor={'#525284'}
              backgroundDarker={'#363652'}
              borderRadius={15}
              textSize={18}
              fontFamily={'System'}
              onPress={ () => selectImageAsync(navigation) }
            >RESELECT IMAGE
            </AwesomeButton>
        )}
      </View>
      <StatusBar style="light" />
    </View>
  );
}

Review.navigationOptions = navigation => ({
  title: "Review",
  headerStyle: {
    backgroundColor: '#333333', //'#444444',
  },
  headerTintColor: '#fff',
});

// STYLES FOR VARIOUS ELEMENTS =================================================================================================
const BASE_SIZE = 110
const win = Dimensions.get('window');
const image_side = win.width*0.9;

const styles = StyleSheet.create({
  outer_view: {
    alignItems: 'center',
    backgroundColor: '#444444',
    flex: 1,
  },
  photo_outline: {
    width: image_side,
    height: image_side,
    backgroundColor: 'rgba(170, 170, 170, 1)',
    borderColor: 'rgba(170, 170, 170, 1)',
    borderWidth: 10,
    borderTopLeftRadius:     25,
    borderTopRightRadius:    25,
    borderBottomLeftRadius:  25,
    borderBottomRightRadius: 25
  },
  image: {
      alignSelf: 'stretch',
      width:  image_side-20,
      height: image_side-20,
      borderTopLeftRadius:     15,
      borderTopRightRadius:    15,
      borderBottomLeftRadius:  15,
      borderBottomRightRadius: 15
  },
})


export default Review;
