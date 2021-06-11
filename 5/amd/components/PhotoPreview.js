import {StatusBar} from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';

import React, { useState, useEffect } from 'react';
import {StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground, Image, Input} from 'react-native';
import AwesomeButton from "react-native-really-awesome-button";

import * as tf from '@tensorflow/tfjs';
import { fetch, decodeJpeg } from '@tensorflow/tfjs-react-native';
import * as jpeg from 'jpeg-js'


export default class PhotoPreview extends React.Component
{
  render()
  {
    // MAKE A PREDICTION AND STORE AS GLOBAL VARIABLE ==========================================================================
    async function predictMovement(uri, nav)
    {
        console.log("    Retrieving image and converting to tensors...");
        const response = await fetch(uri, {}, { isBinary: true });
        const imageData = await response.arrayBuffer();
        const imageTensor = imageToTensor(imageData);

        console.log("    Making prediction...")
        global.prediction = await global.movementDetector.classify(imageTensor.resizeBilinear([224,224]));

        nav.navigate('MovementInfo');

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
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        nav.navigate('PhotoPreview', {img: result, cam: false})
      }
    }


    // ON SCREEN ===============================================================================================================
    const photo = this.props.navigation.getParam('img')
    const backToCamera = this.props.navigation.getParam('cam')

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
              borderRadius={80}
              textSize={20}
              fontFamily={'System'}
              onPress={() => predictMovement(photo.uri, this.props.navigation)}
            >Predict movement
            </AwesomeButton>
            <View height={10}/>

            { backToCamera ? (
              <AwesomeButton
                  stretch
                  backgroundColor={'#993232'}
                  backgroundDarker={'#501616'}
                  borderRadius={80}
                  textSize={20}
                  fontFamily={'System'}
                  onPress={ () => this.props.navigation.navigate('HomeCamera') }
              >Re-take photo
              </AwesomeButton>
            ) : (
              <AwesomeButton
                  stretch
                  backgroundColor={'#993232'}
                  backgroundDarker={'#501616'}
                  borderRadius={80}
                  textSize={20}
                  fontFamily={'System'}
                  onPress={ () => selectImageAsync(this.props.navigation) }
                >Re-select image
                </AwesomeButton>
              )}
            </View>
          </ImageBackground>
        <StatusBar style="auto" />
      </View>
    );
  }
}

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
