import * as tf                          from '@tensorflow/tfjs';
import * as automl                      from '@tensorflow/tfjs-automl';
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';


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
export async function PredictTree(base64)
{
  const imgTensor = b64_to_tensor(base64);

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
};

export async function LoadModelTree()
{
  const tfReady = await tf.ready();
  const twoDimensionalModel   = await require("../assets/models/twodimensional/model.json");
  const twoDimensionalWeights = await require("../assets/models/twodimensional/weights.bin");
  const twoDimensionalTF = await tf.loadGraphModel(bundleResourceIO(twoDimensionalModel, twoDimensionalWeights));
  global.twoDimensionalTF = new automl.ImageClassificationModel(twoDimensionalTF, global.twoDimensionalDict);
  console.log('[+] Tensorflow model A loaded');
  const abstractishModel   = await require("../assets/models/abstractish/model.json");
  const abstractishWeights = await require("../assets/models/abstractish/weights.bin");
  const abstractishTF = await tf.loadGraphModel(bundleResourceIO(abstractishModel, abstractishWeights));
  global.abstractishTF = new automl.ImageClassificationModel(abstractishTF, global.abstractishDict);
  console.log('[+] Tensorflow model B loaded');
  const renaissancishModel   = await require("../assets/models/renaissancish/model.json");
  const renaissancishWeights = await require("../assets/models/renaissancish/weights.bin");
  const renaissancishTF = await tf.loadGraphModel(bundleResourceIO(renaissancishModel, renaissancishWeights));
  global.renaissancishTF = new automl.ImageClassificationModel(renaissancishTF, global.renaissancishDict);
  console.log('[+] Tensorflow model C loaded');
};
