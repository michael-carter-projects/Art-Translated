"""=============================================================================================================================
    models.py
    Author: Michael Carter
    Date Created: 04-29-21
    Date Modified: 05-01-21
    This file contains functions for training our image data with a SKLearn Multi-Layer Perceptron Classifier
============================================================================================================================="""

import dataset as d
import cnn as c
from progress_bar import printProgressBar as ppb

import numpy as np
import random as rand
from time import time
from os import listdir
from os.path import isfile, join

import keras as k
from PIL import Image
from sklearn.neural_network import MLPClassifier


""" ============================================================================================================================
    Command line progress bar graciously provided by StackOverflow user "Greenstick"
    https://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console
"""
def format_MLP(x_raw, y_raw, n_cats):

    categories = np.arange(1, n_cats+1) # array of category integers

    x_formatted = [] # will contain x training set
    y_all_34 = [] # contains y training sets for all 34 classifiers

    for i in categories:           #
        single_y = []
        for y in y_raw:
            if y == i:
                single_y.append(1)
            else:
                single_y.append(0)
        y_all_34.append(single_y) # append binary y_train to list of all y_train sets

    for i in range(len(x_raw)):
        x_formatted.append(np.array(x_raw[i]).flatten())

    return x_formatted, y_all_34

def split_MLP(x_raw, y_raw, test_pct):

    x_train = []   # will store x values in training set
    y_train = []  # will store y values in training set
    x_test = []  # will store x values in testing set
    y_test = [] # will store y values in testing set

    # generate a random list of indices for our test set
    test_indices = rand.sample(range(0, len(y_raw)), int(len(y_raw)*test_pct/100))

    # split the data into train/test sets --------------------------------------------------------------------------------------
    for i in range(len(y_raw)):
        if i in test_indices:             # if the image has one of the test indices
            x_test.append(x_raw[i])      # append the x value to x testing set
            y_test.append(y_raw[i])     # append the y value to y testing set
        else:                          # otherwise,
            x_train.append(x_raw[i])  # append the x value to x training set
            y_train.append(y_raw[i]) # append the y value to y training set

    # normalize data for MLP ---------------------------------------------------------------------------------------------------
    x_train = np.array(x_train).astype('float32')  / 255 # convert x_train int list to float np array & normalize
    x_test = np.array(x_test).astype('float32') / 255 # convert x_test int list to float np array & normalize values

    return x_train, np.array(y_train), x_test, np.array(y_test)

""" ============================================================================================================================
    return a list of dictionaries representing the configurations of parameters with which to create MLP's
"""
def get_MLP_params(phases):

    params = [[{'solver': 'lbfgs', 'alpha': 0.001, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'sgd',   'alpha': 0.001, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'adam',  'alpha': 0.001, 'hidden_layer_sizes': (4, 2)}],

              [{'solver': 'lbfgs', 'alpha': 1e-7, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-6, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-5, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-3, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'lbfgs', 'alpha': 0.01, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'lbfgs', 'alpha':  0.1, 'hidden_layer_sizes': (4, 2)}],

              [{'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (1, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (2, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (3, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (4, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (5, 2)}],

              [{'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (1, 1)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (1, 2)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (1, 3)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (1, 4)},
               {'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (1, 5)}],

              [{'solver': 'lbfgs', 'alpha': 1e-4, 'hidden_layer_sizes': (1, 3)}]]

    num_params = 0
    for phase in range(len(params)):
        if phase in phases:
            num_params += len(params[phase])

    return params, num_params

""" ============================================================================================================================
    create an MLP for each entry in parameters list and save the one that produces the highest accuracy
"""
def train_MLP(x_train, y_train, params):

    start = time()

    slvr = params.get('solver')
    alph = params.get('alpha')
    hlsz = params.get('hidden_layer_sizes')

    clf = MLPClassifier(solver=slvr, alpha=alph, hidden_layer_sizes=hlsz, random_state=1, max_iter=1000)

    clf.fit(x_train, y_train)

    return (clf, (time()-start))

""" ============================================================================================================================
    create an MLP for each entry in parameters list and save the one that produces the highest accuracy
"""
def run_MLP_suite(x_raw, y_raw, test_pct, n_cats, iterations, phases, n_phases):

    all_params_and_results = []
    x_formatted, y_all_34 = format_MLP(x_raw, y_raw, n_cats) # format data to use 34 classifiers
    mlp_params, num_params = get_MLP_params(phases)

    l = len(phases) * num_params * n_cats * iterations # number of times an MLP is trained in total
    ppb(0, l, prefix = 'Training and testing MLPs: ', suffix = 'Complete', length = 100) # print initial progress bar
    n = 0 # count required to print progress bar

    # loop through every phase from 0-4 ----------------------------------------------------------------------------------------
    # all_params_and_results appends a dict of parameters and results if phase is in given list, otherwise appends none
    for phase in range(n_phases):

        if phase in phases: # if the current phase (0-4) is one of the phases provided in main, train MLP accordingly ----------

            phase_params_and_results = [] # will store the parameters and results dictionary associated with current phase

            # for every parameter value, run all 34 1-vs-all classifiers "iterations" times and average results ----------------
            for i in range(len(mlp_params[phase])):

                iteration_accs  = [] # stores accuracy results for each iteration
                iteration_times = [] # stores total execution times for each iteration

                # run all classifiers for given number of iterations -----------------------------------------------------------
                for j in range(iterations):

                    it_acc  = 0 # used to find mean accuracy of current iteration
                    it_time = 0 # used to sum total execution time of current iteration

                     # run all 34 1-vs-all classifiers -------------------------------------------------------------------------
                    for y_train in y_all_34:

                        x_train, y_train, x_test, y_test = split_MLP(x_formatted, y_train, test_pct) # split data for MLP

                        model, time = train_MLP(x_train, y_train, mlp_params[phase][i]) # train model & store training time
                        acc = model.score(x_test, y_test)                              # store accuracy of current model

                        it_acc += acc / n_cats # update accuracy of current iteration with weight 1/n_categories to find mean
                        it_time += time       # update execution time of current iteration

                        n+=1 # progress bar stuff
                        ppb(n, l, prefix = 'Training and testing MLPs: ', suffix = 'Complete', length = 100)

                    iteration_accs.append(it_acc)    # store accuracy of current iteration in results list
                    iteration_times.append(it_time) # store execution time of current iteration in times list

                mlp_params[phase][i]['avg_accuracy'] = np.mean(iteration_accs) # add accuracy key/value pair to dictionary
                mlp_params[phase][i]['avg_time'] = np.mean(iteration_times)   # add tune key/value pair to dictionary
                phase_params_and_results.append(mlp_params[phase][i])        # update results of current phase

            all_params_and_results.append(phase_params_and_results) # add all phase results to list of all results

        else:
            all_params_and_results.append(None)

    return all_params_and_results

""" ============================================================================================================================
    given a folder of new RGBA images, predict what class they belong to using the best of each model
"""
def train_and_predict_with_best_MLP(img_folder, base_folder, image_width, x_new, y_raw, test_pct, n_cats, n_iterations):

    filepaths = [img_folder+'/'+f for f in listdir(img_folder) if isfile(join(img_folder, f))]

    # use functions from dataset.py to preprocess new prediction images --------------------------------------------------------
    d.reset_images(img_folder, base_folder)                         # delete preprocessed images & recopy
    d.resize_images(img_folder, image_width)                       # resize images for prediction
    x_tuple = []                                                  #
    for fp in filepaths:                                         # get pixel data from every image
        x_tuple.append(list(Image.open(fp, 'r').getdata()))     #
    image_data = d.get_lists_from_tuples(x_tuple, image_width) # format pixel data properly for prediction
    image_data = np.array(image_data).astype('float32') / 255 # turn image_data into array and normalize

    # flatten image data for use with MLP prediction
    flat_image_data = []
    for i in range(len(image_data)):
        flat_image = []
        for j in range(len(image_data[i])):
            for k in range(len(image_data[i][j])):
                for l in range(len(image_data[i][j][k])):
                    flat_image.append(image_data[i][j][k][l])
        flat_image_data.append(flat_image)
    flat_image_data = np.array(flat_image_data)

    # awdawwdaa wd
    x_formatted, y_all_34 = format_MLP(x_new, y_raw, n_cats) # format data to use 34 classifiers
    mlp_params, num_params = get_MLP_params([2])
    mlp_params = mlp_params[4][0]

    n = 0 # count required to print progress bar=
    l = n_iterations*n_cats
    ppb(0, l, prefix = 'Training and testing MLPs: ', suffix = 'Complete', length = 100) # print initial progress bar

    best_acc = 0
    results = {}
    iteration_accs  = [] # stores accuracy results for each iteration
    iteration_times = [] # stores total execution times for each iteration

    # run all classifiers for given number of iterations -----------------------------------------------------------
    for j in range(n_iterations):

        it_acc  = 0 # used to find mean accuracy of current iteration
        it_time = 0 # used to sum total execution time of current iteration
        models_34 = []

         # run all 34 1-vs-all classifiers -------------------------------------------------------------------------
        for y_train in y_all_34:

            x_train, y_train, x_test, y_test = split_MLP(x_formatted, y_train, test_pct) # split data for MLP

            model, time = train_MLP(x_train, y_train, mlp_params) # train model & store training time
            acc = model.score(x_test, y_test)                              # store accuracy of current model
            models_34.append(model)

            it_acc += acc / n_cats # update accuracy of current iteration with weight 1/n_categories to find mean
            it_time += time       # update execution time of current iteration

            n+=1 # progress bar stuff
            ppb(n, l, prefix = 'Training and testing MLPs: ', suffix = 'Complete', length = 100)

        iteration_accs.append(it_acc)    # store accuracy of current iteration in results list
        iteration_times.append(it_time) # store execution time of current iteration in times list

        if (acc > best_acc):
            best_mlp = models_34
            best_acc = acc

    results['avg_accuracy'] = np.mean(iteration_accs) # add accuracy key/value pair to dictionary
    results['avg_time'] = np.mean(iteration_times)   # add tune key/value pair to dictionary

    predictions =[]
    for model in models_34:
        predictions.append(model.predict(flat_image_data))

    return filepaths, results, predictions
