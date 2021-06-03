import React, { useState, useEffect }  from 'react';
import { StyleSheet, View,Image } from 'react-native';
import { Button, Input } from 'react-native-elements';
import Svg, {Rect} from 'react-native-svg';

import * as tf from '@tensorflow/tfjs';
//import * as tfautoml from '@tensorflow/tfjs-automl';
import { fetch, bundleResourceIO } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet'

import * as jpeg from 'jpeg-js'


export default function App() {
    const [imageLink, setImageLink] = useState("https://raw.githubusercontent.com/ohyicong/masksdetection/master/dataset/without_mask/142.jpg")
    const [isEnabled, setIsEnabled] = useState(true)
    const [mvmtDetector, setMvmtDetector] = useState("")

    useEffect(() => {
      async function loadModel(){
        console.log("[+] Application started")
        const tfReady = await tf.ready();

        console.log("[+] Loading movement detection model")
        //const modelJson = await require("./assets/mvmt_model/model.json");
        //const modelWeight = await require("./assets/mvmt_model/group1-shard.bin");
        //const mvmtDetector = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeight));
        //const mvmtDetector = await mobilenet.load()

        const mvmtDetector = await tf.automl.loadImageClassification("./assets/mvmt_model/model.json");
        setMvmtDetector(mvmtDetector);



        console.log("[+] Model Loaded")
      }
      loadModel()
    }, []);
    function imageToTensor(rawImageData){
      //Function to convert jpeg image to tensors
      const TO_UINT8ARRAY = true;
      const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY);
      // Drop the alpha channel info for mobilenet
      const buffer = new Uint8Array(width * height * 3);
      let offset = 0; // offset into original data
      for (let i = 0; i < buffer.length; i += 3) {
        buffer[i] = data[offset];
        buffer[i + 1] = data[offset + 1];
        buffer[i + 2] = data[offset + 2];
        offset += 4;
      }
      return tf.tensor3d(buffer, [height, width, 3]);
    }
    const predictMovement = async() => {
      try {
        console.log("[+] Retrieving image from link :" + imageLink);
        const response = await fetch(imageLink, {}, { isBinary: true });
        const rawImageData = await response.arrayBuffer();
        // decodeJpeg ??
        const imageTensor = imageToTensor(rawImageData).resizeBilinear([224,224]);

        console.log("3");
        //console.log(mvmtDetector);

        const result = await mvmtDetector.classify(image);
      //  const result = await mvmtDetector.predict(imageTensor).data();

        console.log("!!!!");
        console.log(result);

        console.log("[+] Prediction Completed");
      }
      catch {
        console.log("[-] Unable to load image");
      }

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
          onPress={()=>{predictMovement()}}
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
