import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Button, Input } from 'react-native-elements';

import * as tf from '@tensorflow/tfjs'
import * as automl from '@tensorflow/tfjs-automl';
import {loadDictionary} from '@tensorflow/tfjs-automl';
import { fetch, decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';

import * as jpeg from 'jpeg-js'

export default function App() {
    const [imageLink, setImageLink] = useState("https://raw.githubusercontent.com/ohyicong/masksdetection/master/dataset/without_mask/142.jpg")
    const [isEnabled, setIsEnabled] = useState(true)

    // LOAD ML MODEL AND MAKE A PREDICTION
    async function predictMovement() {
      try {
        console.log("[+] Application started")
        const tfReady = await tf.ready();

        console.log("[+] Loading movement detection model")
        const modelJson = await require("./assets/model/model.json");
        const modelWeight = await require("./assets/model/group1-shard.bin");
        const model = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight));
        const dict = ["mannerism-late-renaissance", "renaissance", "baroque", "northern-renaissance", "post_impressionism", "neoclassicism", "rococo", "gothic"];
        const mvmtDetector = new automl.ImageClassificationModel(model, dict);
        console.log("[+] Model Loaded")


        console.log("[+] Retrieving image from assets");
        const image = require('./assets/images/madonna.jpg');
        const imageAssetPath = Image.resolveAssetSource(image);
        const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
        const imageData = await response.arrayBuffer();

        console.log("[+] Converting image to Tensors")
        const imageTensor = imageToTensor(imageData);

        console.log("[+] Making prediction")
        const prediction = await mvmtDetector.classify(imageTensor.resizeBilinear([224,224]));

        console.log(JSON.stringify(prediction));

        console.log("[+] Prediction Completed");
      }
      catch {
        console.log("[-] Unable to load image");
      }
    }

    // CONVERT RAW IMAGE DATA TO TENSORS =======================================
    function imageToTensor(rawImageData){
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


  return (
    <View style={styles.container}>
      <Input
        placeholder="image link"
        onChangeText = {(inputText)=>{
          console.log(inputText)
          setImageLink(inputText)
          const elements= inputText.split(".")
          if(elements.slice(-1)[0]=="jpg" || elements.slice(-1)[0]=="jpeg"){
            setIsEnabled(true)
          }else{
            setIsEnabled(false)
          }
        }}
        value={imageLink}
        containerStyle={{height:40,fontSize:10,margin:15}}
        inputContainerStyle={{borderRadius:10,borderWidth:1,paddingHorizontal:5}}
        inputStyle={{fontSize:15}}

      />
      <View style={{marginBottom:20}}>
        <Image
          style={{width:224,height:224,borderWidth:2,borderColor:"black",resizeMode: "contain"}}
          source={{
            uri: imageLink
          }}
          PlaceholderContent={<View>No Image Found</View>}
        />
      </View>
        <Button
          title="Predict"
          onPress={()=>{ predictMovement() }}
          disabled={!isEnabled}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
