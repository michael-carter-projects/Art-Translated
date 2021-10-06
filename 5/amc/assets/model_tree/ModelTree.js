import * as tf                          from '@tensorflow/tfjs';
import * as automl                      from '@tensorflow/tfjs-automl';
import { decodeJpeg, bundleResourceIO } from '@tensorflow/tfjs-react-native';

import { movement_details } from '../mvmt_details.js'

// REALEY MODEL INFO ===========================================================
var twoDimensionalTF = null;
const twoDimensionalDict = ['romanticism',
                              'gothic',
                              'neoclassicism',
                              'art_nouveau',
                              'gothic',
                              'grotesque',
                              'gothic',
                              'byzantine',
                              'renaissancish',
                              'symbolism',
                              'gothic',
                              'cubism',
                              'realism_naturalism',
                              'abstractish',
                              'baroque',
                              'vanitas',
                              'surrealism',
                              'rococo',
                              'art_deco',
                              'egyptian'];

// RENAISSANCE MODEL INFO ======================================================
var renaissancishTF = null;
const renaissancishDict = ['mannerism',
                            'northern_renaissance',
                            'high_renaissance',
                            'early_renaissance',
                            'academic_classicism'];

// ABSTRACTISH MODEL INFO ======================================================
var abstractishTF = null;
const abstractishDict = ['expressionism',
                          'fauvism',
                          'impressionism',
                          'post_impressionism'];

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

  for (let i=0; i < sorted_results.length; i++) {
    if (prediction.prob > sorted_results[i].prob) {
      index = i;
      break;
    }
  }
  sorted_results.splice(index, 0, prediction)
  return sorted_results;
}

// GIVEN A LIST OF SORTED RESULTS, REMOVES DUPLICATE RESULTS THAT MAP TO THE SAME MOVEMENT =====================================
function remove_duplicates(sorted_results) {

  // VARIABLES FOR FINDING DUPLICATES ------------------------------------------
  var gothic_count = 0;
  var duplicate_indices = [];

  // LOOK THROUGH THE LIST AND RECORD DUPLICATE INDICES ------------------------
  for (let i=0; i<sorted_results.length; i++) {
    if (sorted_results[i].label.substring(0, 6) === 'gothic') {
      gothic_count++;
      if (gothic_count > 1) {
        duplicate_indices.push(i);
      }
    }
  }
  // PUSH ONLY NON_DUPLICATES TO NEW RESULTS -----------------------------------
  var new_sorted_results = [];
  for (let i=0; i<sorted_results.length; i++) {
    if (!duplicate_indices.includes(i)) {
      new_sorted_results.push(sorted_results[i]);
    }
  }

  return new_sorted_results;
}

// GETS LIST OF PREDICTIONS SORTED BY DESCENDING PROBABILITY ABOVE CERTAIN PROBABILITY =========================================
function get_predictions_info(two, ren, abs) {

    var sorted_results = [two[0]];

    // INSERT ALL RESULTS INTO A LIST SORTED BY DESCENDING PROBABILITY ---------
    for (let i=1; i < two.length; i++) {
      sorted_results = insert_descending(sorted_results, two[i]);
    }
    for (let i=0; i < ren.length; i++) {
      sorted_results = insert_descending(sorted_results, ren[i]);
    }
    for (let i=0; i < abs.length; i++) {
      sorted_results = insert_descending(sorted_results, abs[i]);
    }

    // REMOVE LOWER PROB DUPLICATES OF SAME PREDICTION -------------------------
    sorted_results = remove_duplicates(sorted_results);

    // LIMIT THE NUMBER OF RESULTS BY SUM OF PROBABILITIES OR COUNT ------------
    const threshold_percent_sum = 1.2; // max sum of probabilties
    const threshold_results_num = 10; // max number of results
    var probability_sum = 0;
    var results_count = 0;
    var threshold_index = sorted_results.length;

    for (let i=0; i < sorted_results.length; i++) {
      probability_sum += sorted_results[i].prob;
      results_count += 1;

      if (probability_sum > threshold_percent_sum
       || results_count  == threshold_results_num ) {
        threshold_index = i;
        break;
      }
    }
    sorted_results = sorted_results.slice(0, threshold_index);

    // GET MOVEMENT INFO FOR ALL RESULTS AND RETURN ----------------------------
    var sorted_info = [];
    for (let i=0; i < sorted_results.length; i++) {
      sorted_info.splice(i, 0, get_movement_info(sorted_results[i]));
    }
    return sorted_info;
  }

// GIVEN A PROBABILITY SCORE, RETURNS JSON: { "MOVEMENT MAP", "PROBABILITY" } ==================================================
function get_movement_info(prediction) {
  return { info: movement_details[prediction.label],
           prob: parseInt(prediction.prob*100)
         }
}

// RUN GIVEN TENSOR IMAGE THROUGH MODEL TREE ===================================================================================
export async function run_predict_tree(base64) {

  const imgTensor = b64_to_tensor(base64); // convert base64 data to tensors

  const threshold_REN = 0.5; // probability with which "renaissancish" must be predicted to run renaissancish model
  const threshold_ABS = 0.5; // probability with which "abstractish"   must be predicted to run abstractish model

  var predictionREN = []; // list for storing renaissancish predictions
  var predictionABS = []; // list for storing abstractish predictions

  console.log("[+] Running Two Dimensional")
  const predictionTWO = await twoDimensionalTF.classify(imgTensor); // run 2D model

  if (predictionTWO[8].prob  > threshold_REN) { // renaissancish = 8
    predictionREN = await renaissancishTF.classify(imgTensor);
    console.log("[+] Running Renaissancish")
  }
  if (predictionTWO[13].prob > threshold_ABS) { // abstractish = 13
    predictionABS = await abstractishTF.classify(imgTensor);
    console.log("[+] Running Abstractish")
  }

  return get_predictions_info(predictionTWO, predictionREN, predictionABS);
};

// LOAD ALL MODELS IN MODEL TREE ===============================================================================================
export async function load_model_tree() {

  const tfReady = await tf.ready();
  const twoDimensionalModel   = await require("./twodimensional/model.json");
  const twoDimensionalWeights = await require("./twodimensional/weights.bin");
  const twoDimensionalGraph = await tf.loadGraphModel(bundleResourceIO(twoDimensionalModel, twoDimensionalWeights));
  twoDimensionalTF = new automl.ImageClassificationModel(twoDimensionalGraph, twoDimensionalDict);
  console.log('[+] Tensorflow model A loaded');
  const abstractishModel   = await require("./abstractish/model.json");
  const abstractishWeights = await require("./abstractish/weights.bin");
  const abstractishGraph = await tf.loadGraphModel(bundleResourceIO(abstractishModel, abstractishWeights));
  abstractishTF = new automl.ImageClassificationModel(abstractishGraph, abstractishDict);
  console.log('[+] Tensorflow model B loaded');
  const renaissancishModel   = await require("./renaissancish/model.json");
  const renaissancishWeights = await require("./renaissancish/weights.bin");
  const renaissancishGraph = await tf.loadGraphModel(bundleResourceIO(renaissancishModel, renaissancishWeights));
  renaissancishTF = new automl.ImageClassificationModel(renaissancishGraph, renaissancishDict);
  console.log('[+] Tensorflow model C loaded');
};
