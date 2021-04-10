import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { fetch, decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';

export default function Predictor() {
  // Get reference to bundled model assets
  const modelJson = require('../assets/model/movement_metadata.json');
  const modelWeights = require('../assets/model/movement_labels.bin'); // ???

  // Use the bundleResorceIO IOHandler to load the model
  const model = await tf.loadLayersModel(
    bundleResourceIO(modelJson, modelWeights));

  // Get a reference to the bundled asset and convert it to a tensor
  const image = require('./assets/madonna.jpg');
  const imageAssetPath = Image.resolveAssetSource(image);
  const response = await fetch(imageAssetPath.uri, {}, { isBinary: true });
  const imageData = await response.arrayBuffer();
  const imageTensor = decodeJpeg(imageData);

  const prediction = (await model.predict(imageTensor))[0];

  console.log(prediction)
}
