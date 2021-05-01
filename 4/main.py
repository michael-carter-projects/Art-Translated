"""=============================================================================================================================
    main.py
    Author: Michael Carter
    Date Created: 04-29-21
    Date Modified:
    This script is used to train all machine learning models, store their results, and plot them
============================================================================================================================="""

import dataset as d
import cnn as c
import mlp as m
import plots as p

""" manipulate dataset ======================================================================================================"""

image_dest = "coat-of-arms_images"      # name of destination folder for files created, filtered, & resized for training
image_base = "coat-of-arms_images_base" # name of folder containing original images collected on internet
dataset_fn = "coa_training_data.csv"    # filename of (image filename, class) pairs file
image_width = 50

#d.reset_images(image_dest, image_base) # if re-running the script, delete all previous images and copy originals in place
#d.multiply_images(image_dest) # create many filtered images for every original input image
#d.resize_images(image_dest, image_width) # resize all images in dataset to a width of 100 (scale height proportionally)
#d.write_filename_class_pairs(image_dest, dataset_fn) # classify training data from source file and write x, y matrix into .csv
x_raw, y_raw, n_cats = d.retreive_numerical_dataset_from_file(dataset_fn, image_width) # read the written file to two lists

""" train models using dataset from file ===================================================================================="""

predict_folder = "coa_prediction"
predict_base = "coa_prediction_base"
num_phases = 3

#parameters =[{'solver': 'lbfgs', 'alpha': 0.001, 'hidden_layer_sizes': (4, 2), 'avg_accuracy': 0.9722222222222223, 'avg_time': 28.879051685333252},
#             {'solver': 'sgd',   'alpha': 0.001, 'hidden_layer_sizes': (4, 2), 'avg_accuracy': 0.9744008714596949, 'avg_time': 285.2565641403198},
#             {'solver': 'adam',  'alpha': 0.001, 'hidden_layer_sizes': (4, 2), 'avg_accuracy': 0.9697712418300654, 'avg_time': 118.85793161392212}]
parameters = m.run_MLP_suite(x_raw, y_raw, 10, n_cats, 5) # run MLP tests on a train/test split of 9:1, average over 5 runs for each parameter


#num_phases = 4
#c.run_CNN_suite(x_raw, y_raw, 10, n_cats, phase)# run CNN type 0 tests on a train/test split of 9:1
#results_CNN.append(c.run_CNN_suite(x_raw, y_raw, 10, n_cats, 1)) # run CNN type 1 tests on a train/test split of 9:1
#results_CNN.append(c.run_CNN_suite(x_raw, y_raw, 10, n_cats, 2)) # run CNN type 2 tests on a train/test split of 9:1
#results_CNN.append(c.run_CNN_suite(x_raw, y_raw, 10, n_cats, 3)) # run CNN type 3 tests on a train/test split of 9:1
#print(results_CNN)

#c.predict_with_CNN(predict_folder, predict_base, image_width)

""" plot data obtained by running models over different parameters, then plot model performances on in-the-wild images ======"""

p.plot_MLP_hyperparameters(parameters, 0)

#p.plot_MLP_hyperparameters(results_MLP)

#p.plot_CNN_hyperparameters(results_CNN)

#p.plot_model_against_model(results_MLP, results_CNN)

#p.plot_in_the_wild_results()
