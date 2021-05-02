"""=============================================================================================================================
    main.py
    Author: Michael Carter
    Date Created: 04-29-21
    Date Modified: 05-01-21
    This script is used to train all machine learning models, store their results, and plot them
============================================================================================================================="""

import dataset as d
import mlp as m
import cnn as c
import plots as p

""" manipulate dataset ======================================================================================================"""

image_dest = "coat-of-arms_images"      # name of destination folder for files created, filtered, & resized for training
image_base = "coat-of-arms_images_base" # name of folder containing original images collected on internet
dataset_fn = "coa_training_data.csv"    # filename of (image filename, class) pairs file
image_width = 50

d.reset_images(image_dest, image_base) # if re-running the script, delete all previous images and copy originals in place
d.multiply_images(image_dest) # create many filtered images for every original input image
d.resize_images(image_dest, image_width) # resize all images in dataset to a width of 100 (scale height proportionally)
d.write_filename_class_pairs(image_dest, dataset_fn) # classify training data from source file and write x, y matrix into .csv
x_raw, y_raw, n_cats = d.retreive_numerical_dataset_from_file(dataset_fn, image_width) # read the written file to two lists

""" train models using dataset from file over each phase of hyperparameter tuning ==========================================="""

predict_folder = "coa_prediction"
predict_base = "coa_prediction_base"
test_set_pct = 10
n_iterations = 10
phases = [0, 1, 2, 3]
nns = [0, 1, 2, 3, 4]
n_phases = len(phases)

# train MLP's for every phase at once ------------------------------------------------------------------------------------------
mlp_results = m.run_MLP_suite(x_raw, y_raw, test_set_pct, n_cats, n_iterations, phases, n_phases)

# train CNN's for every phase at once ------------------------------------------------------------------------------------------
cnn_results = c.run_CNN_suite(x_raw, y_raw, test_set_pct, n_cats, n_iterations, phases, n_phases)

# train CNN's for different configurations of layers ---------------------------------------------------------------------------
cnn_results = c.run_CNN_suite_layers(x_raw, y_raw, test_set_pct, n_cats, n_iterations, nns)


""" plot data obtained by running models over different parameters =========================================================="""

# plot data for all hyperparameter tuning phases of MLP ------------------------------------------------------------------------
for phase in phases:
    p.plot_MLP_hyperparameters(mlp_results, phase) """

# plot data for all hyperparameter tuning phases and layer choosing of CNN -----------------------------------------------------
for phase in phases:
    p.plot_CNN_hyperparameters(cnn_results, phase)
p.plot_CNN_layers(cnn_results)


""" plot/print data obtained by training best models with new dataset ======================================================="""

n_iterations = 20 # increase iterations for final training session

# for the final portion of the project, randomly filter the data using a random color overlay (tint) and random pixel noise
x_new = d.create_noise_and_tint(x_raw)

# run each model 20 times for final comparisons and predictions
filepaths, mlp_results, mlp_predictions = m.train_and_predict_with_best_MLP(predict_folder, predict_base, image_width, x_new, y_raw, test_set_pct, n_cats, n_iterations)
filepaths, cnn_results, cnn_predictions = c.train_and_predict_with_best_CNN(predict_folder, predict_base, image_width, x_new, y_raw, test_set_pct, n_cats, n_iterations)

# compare the two models in a bar chart
p.plot_model_against_model(mlp_results, cnn_results)

# print the results of the MLP predictions and the CNN predictions
p.print_prediction_names(mlp_predictions, cnn_predictions, filepaths)
