import {StatusBar} from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground, Image, Input} from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";

import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'

// MAKE A PREDICTION AND STORE AS GLOBAL VARIABLE ==========================================================================
async function predictMovementAsync(photo, nav)
{
    console.log("    Retrieving image and converting to tensors...");
    const response = await fetch(photo.uri, {}, { isBinary: true });
    const imageData = await response.arrayBuffer();
    const imageTensor = imageToTensor(imageData);

    console.log("    Making prediction...")
    global.prediction = await global.movementDetector.classify(imageTensor.resizeBilinear([224,224]));

    console.log(global.prediction)

    nav.navigate('Predictions', {img: photo});

    console.log("[+] Prediction Complete \n");
}

// CONVERT RAW IMAGE DATA TO TENSORS =======================================================================================
function imageToTensor(rawImageData)
{
  const { width, height, data } = jpeg.decode(rawImageData, true);
  const buffer = new Uint8Array(width * height * 3);
  let offset = 0;
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = data[offset];
    buffer[i + 1] = data[offset + 1];
    buffer[i + 2] = data[offset + 2];
    offset += 4;
  }
  return tf.tensor3d(buffer, [height, width, 3]);
}

// ALLOWS USER TO SELECT IMAGE FROM CAMERA ROLL ============================================================================
async function selectImageAsync(nav)
{
  let photo = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All,
                                                          allowsEditing: true,
                                                          aspect: [4, 3],
                                                          quality: 1,
                                                        });
  if (!photo.cancelled)
  {
    nav.navigate('Review', {img: photo, cam: false});
  }
}


// ON SCREEN ===============================================================================================================

function Review ({navigation})
{
  const photo = navigation.state.params.img;
  const backToCamera = navigation.state.params.cam;

  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1
        }}
      >
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
            onPress={() => predictMovementAsync(photo, navigation)}
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
        </ImageBackground>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  photo_options_container:{
    width: BASE_SIZE,
    height: BASE_SIZE,
    alignItems: 'center',
  }
})

export default Review;
