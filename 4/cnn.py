"""=============================================================================================================================
    cnn.py
    Author: Michael Carter
    Date Created: 04-29-21
    Date Modified: 05-01-21
    This file contains functions for training our image data with a Keras Convolutional Neural Network
============================================================================================================================="""

import dataset as d
from progress_bar import printProgressBar as ppb

import numpy as np
import random as rand
from time import time
from os import listdir
from os.path import isfile, join

from PIL import Image
from keras.models import Sequential
from keras.layers import Dense, Dropout, Activation, Flatten
from keras.layers import Convolution2D, MaxPooling2D
from keras.utils import np_utils

""" ============================================================================================================================
    given raw x, y, data from the training set, split into train/test and format appropriately for use in Keras CNN
"""
def split_format_CNN(x_raw, y_raw, test_pct, n_cats):

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

    # format data appropriately for Keras CNN (normalized numpy arrays) --------------------------------------------------------
    x_train = np.array(x_train).astype('float32')  / 255 # convert x_train int list to float np array & normalize
    x_test = np.array(x_test).astype('float32') / 255 # convert x_test int list to float np array & normalize values

    y_train = np_utils.to_categorical(np.array(y_train), n_cats+1) # categorize y_train into (n x 34) list
    y_test = np_utils.to_categorical(np.array(y_test), n_cats+1) # categorize y-test into (n x 34) list

    return x_train, y_train, x_test, y_test

""" ============================================================================================================================
    return a list of dictionaries representing the configurations of parameters with which to create CNN's
"""
def get_CNN_params(phases):
    params = [[{"loss": "categorical_crossentropy", "optimizer": "SGD"  },
               {"loss": "kl_divergence",            "optimizer": "SGD"  },
               {"loss": "poisson",                  "optimizer": "SGD"  }],

              [{"loss": "categorical_crossentropy", "optimizer": "SGD"  },
               {"loss": "categorical_crossentropy", "optimizer": "adam" }],

              [{"loss": "kl_divergence",            "optimizer": "adam" }]]

    num_params = 0
    for phase in range(len(params)):
        if phase in phases:
            num_params += len(params[phase])

    return params, num_params

""" ============================================================================================================================
    train a single convolutional neural network on x_train, y_train, using params
"""
def train_CNN(x_train, y_train, params, phase, nn):

    start = time()

    # get parameter values from dictionary given -------------------------------------------------------------------------------
    lossF = params.get("loss")       # get loss function
    optim = params.get("optimizer") # get optimizers

    cnn = Sequential()

    if phase == 0 or phase == 1 or nn == 0:
        cnn.add(Convolution2D(32, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
        cnn.add(Flatten())
        cnn.add(Dense(35, activation='softmax'))
    else:

        if (nn == 1):
            cnn.add(Convolution2D(32, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
            cnn.add(Convolution2D(32, kernel_size=3, activation='softmax'))
            cnn.add(Flatten())
            cnn.add(Dense(35, activation='softmax'))

        elif (nn == 2):
            cnn.add(Convolution2D(32, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
            cnn.add(MaxPooling2D(pool_size=(2,2)))
            cnn.add(Flatten())
            cnn.add(Dense(35, activation='softmax'))

        elif (nn == 3):
            cnn.add(Convolution2D(32, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
            cnn.add(Dropout(0.5))
            cnn.add(Flatten())
            cnn.add(Dense(35, activation='softmax'))

        elif (nn == 4):
            cnn.add(Convolution2D(32, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
            cnn.add(Convolution2D(32, kernel_size=3, activation='relu'))
            cnn.add(MaxPooling2D(pool_size=(2,2)))
            cnn.add(Dropout(0.5))
            cnn.add(Flatten())
            cnn.add(Dense(35, activation='softmax'))

        elif (nn == 5):
            cnn.add(Convolution2D(32, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
            cnn.add(MaxPooling2D(pool_size=(2,2)))
            cnn.add(Dropout(0.5))
            cnn.add(Flatten())
            cnn.add(Dense(35, activation='softmax'))

    cnn.compile(loss=lossF, optimizer=optim, metrics=['accuracy'])
    cnn.fit(x_train, y_train, batch_size=32, epochs=10, verbose=1)

    return (cnn, (time() - start))


""" ============================================================================================================================
    create a CNN for each entry in parameters list for every phase
"""
def run_CNN_suite_layers(x_raw, y_raw, test_pct, n_cats, iterations, nns):

    all_params_and_results = []
    x_train, y_train, x_test, y_test = split_format_CNN(x_raw, y_raw, test_pct, n_cats) # format training data for CNN
    cnn_params, num_params = get_CNN_params([2])
    cnn_params = cnn_params[2][0]

    n = 0 # count required to print progress bar
    l = len(nns) * iterations # number of times an CNN is trained in total
    ppb(0, l, prefix = 'Training and testing CNNs: ', suffix = 'Complete', length = 100) # print initial progress bar

    nn_results = []
    for nn in nns:
        nn_results.append(cnn_params.copy())

    # loop through every phase from 0-4 ----------------------------------------------------------------------------------------
    # all_params_and_results appends a dict of parameters and results if phase is in given list, otherwise appends none
    for nn in nns:

        iteration_accs  = [] # stores accuracy results for each iteration
        iteration_times = [] # stores total execution times for each iteration

        # run all classifiers for given number of iterations -----------------------------------------------------------
        for j in range(iterations):

            model, time = train_CNN(x_train, y_train, cnn_params, 2, nn) # store model and time elapsed
            acc = model.evaluate(x_test, y_test)[1] # evaluate using test data

            iteration_accs.append(acc)    # store accuracy of current iteration in results list
            iteration_times.append(time) # store execution time of current iteration in times list

            n+=1 # progress bar stuff
            ppb(n, l, prefix = 'Training and testing CNNs: ', suffix = 'Complete', length = 100)

        nn_results[nn]['avg_accuracy'] = np.mean(iteration_accs) # add accuracy key/value pair to dictionary
        nn_results[nn]['avg_time'] = np.mean(iteration_times)   # add tune key/value pair to dictionary

        all_params_and_results.append(nn_results[nn]) # add all phase results to list of all results

    return all_params_and_results






































""" ============================================================================================================================
    create a CNN for each entry in parameters list for every phase
"""
def run_CNN_suite(x_raw, y_raw, test_pct, n_cats, iterations, phases, n_phases):

    all_params_and_results = []
    x_train, y_train, x_test, y_test = split_format_CNN(x_raw, y_raw, test_pct, n_cats) # format training data for CNN
    cnn_params, num_params = get_CNN_params(phases)

    n = 0 # count required to print progress bar
    l = len(phases) * num_params * iterations # number of times an CNN is trained in total
    ppb(0, l, prefix = 'Training and testing CNNs: ', suffix = 'Complete', length = 100) # print initial progress bar


    # loop through every phase from 0-4 ----------------------------------------------------------------------------------------
    # all_params_and_results appends a dict of parameters and results if phase is in given list, otherwise appends none
    for phase in range(n_phases):

        if phase in phases: # if the current phase (0-4) is one of the phases provided in main, train MLP accordingly ----------

            phase_params_and_results = [] # will store the parameters and results dictionary associated with current phase

            # for every parameter value, run all 34 1-vs-all classifiers "iterations" times and average results ----------------
            for i in range(len(cnn_params[phase])):

                iteration_accs  = [] # stores accuracy results for each iteration
                iteration_times = [] # stores total execution times for each iteration

                # run all classifiers for given number of iterations -----------------------------------------------------------
                for j in range(iterations):

                    model, time = train_CNN(x_train, y_train, cnn_params[phase][i], phase) # store model and time elapsed
                    acc = model.evaluate(x_test, y_test)[1] # evaluate using test data

                    iteration_accs.append(acc)    # store accuracy of current iteration in results list
                    iteration_times.append(time) # store execution time of current iteration in times list

                    n+=1 # progress bar stuff
                    ppb(n, l, prefix = 'Training and testing CNNs: ', suffix = 'Complete', length = 100)

                cnn_params[phase][i]['avg_accuracy'] = np.mean(iteration_accs) # add accuracy key/value pair to dictionary
                cnn_params[phase][i]['avg_time'] = np.mean(iteration_times)   # add tune key/value pair to dictionary
                phase_params_and_results.append(cnn_params[phase][i])        # update results of current phase

            all_params_and_results.append(phase_params_and_results) # add all phase results to list of all results

        else:
            all_params_and_results.append(None)

    return all_params_and_results

""" ============================================================================================================================
    given a folder of new RGBA images, predict what class they belong to using the best of each model
"""
def train_and_predict_with_best_CNN(img_folder, base_folder, image_width, x_new, y_raw, test_pct, n_cats, n_iterations):

    filepaths = [img_folder+'/'+f for f in listdir(img_folder) if isfile(join(img_folder, f))] # get prediction image paths

    # use functions from dataset.py to preprocess new prediction images --------------------------------------------------------
    d.reset_images(img_folder, base_folder)                         # delete preprocessed images & recopy
    d.resize_images(img_folder, image_width)                       # resize images for prediction
    x_tuple = []                                                  #
    for fp in filepaths:                                         # get pixel data from every image
        x_tuple.append(list(Image.open(fp, 'r').getdata()))     #
    image_data = d.get_lists_from_tuples(x_tuple, image_width) # format pixel data properly for prediction
    image_data = np.array(image_data).astype('float32') / 255 # turn image_data into array and normalize

    # awdawwdaa wd
    x_train, y_train, x_test, y_test = split_format_CNN(x_new, y_raw, test_pct, n_cats) # format training data for CNN
    cnn_params, num_params = get_CNN_params([2])
    cnn_params = cnn_params[2][0]

    n = 0 # count required to print progress bar=
    ppb(0, n_iterations, prefix = 'Training and testing CNNs: ', suffix = 'Complete', length = 100) # print initial progress bar

    best_acc = 0
    results = {}
    iteration_accs  = [] # stores accuracy results for each iteration
    iteration_times = [] # stores total execution times for each iteration

    # run all classifiers for given number of iterations -----------------------------------------------------------
    for j in range(n_iterations):

        model, time = train_CNN(x_train, y_train, cnn_params, 2, 5) # store model and time elapsed
        acc = model.evaluate(x_test, y_test)[1] # evaluate using test data

        iteration_accs.append(acc)    # store accuracy of current iteration in results list
        iteration_times.append(time) # store execution time of current iteration in times list

        if (acc > best_acc):
            best_cnn = model
            best_acc = acc

        n+=1 # progress bar stuff
        ppb(n, n_iterations, prefix = 'Training and testing CNNs: ', suffix = 'Complete', length = 100)

    results['avg_accuracy'] = np.mean(iteration_accs) # add accuracy key/value pair to dictionary
    results['avg_time'] = np.mean(iteration_times)   # add tune key/value pair to dictionary

    predictions = np.argmax(best_cnn.predict(image_data), axis=-1) # predict the image's class

    return filepaths, results, predictions
