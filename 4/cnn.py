"""=============================================================================================================================
    cnn.py
    Author: Michael Carter
    Date Created: 04-29-21
    Date Modified: 04-30-21
    This file contains functions for training our image data with a Keras Convolutional Neural Network
============================================================================================================================="""

import dataset as d

import numpy as np
import random as rand
from time import time
from os import listdir
from os.path import isfile, join

import keras as k
#import theano as th
import sklearn as sk
from PIL import Image

from sklearn.neural_network import MLPClassifier
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
def get_CNN_params():
    params = [#{"loss": "categorical_crossentropy", "optimizer": "SGD"  },
              {"loss": "categorical_crossentropy", "optimizer": "adam" }]
              #{"loss": "kl_divergence", "optimizer": "SGD"  },
              #{"loss": "kl_divergence", "optimizer": "adam" },
              #{"loss": "poisson", "optimizer": "SGD"  },
              #{"loss": "poisson", "optimizer": "adam" },]

    return params

""" ============================================================================================================================
    train a single convolutional neural network on x_train, y_train, using params
"""
def train_CNN(x_train, y_train, params, phase):

    start = time()

    # get parameter values from dictionary given -------------------------------------------------------------------------------
    lossF = params.get("loss")       # get loss function
    optim = params.get("optimizer") # get optimizers

    cnn = Sequential()

    if phase == 2:
        cnn.add(Convolution2D(8, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
        #cnn.add(Convolution2D(8, kernel_size=3, activation='softmax'))
        cnn.add(Flatten())
        cnn.add(Dense(35, activation='softmax'))

    elif phase == 3:
        cnn.add(Convolution2D(16, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
        #cnn.add(Convolution2D(16, kernel_size=3, activation='softmax'))
        cnn.add(Flatten())
        cnn.add(Dense(35, activation='softmax'))

    elif phase == 1:
        cnn.add(Convolution2D(32, kernel_size=3, activation='softmax', input_shape=(50,50,4)))
        #cnn.add(Convolution2D(32, kernel_size=3, activation='softmax'))
        cnn.add(Flatten())
        cnn.add(Dense(35, activation='softmax'))



    elif phase == 4:
        cnn.add(Convolution2D(32, kernel_size=3, activation='relu', input_shape=(50,50,4)))
        cnn.add(Convolution2D(32, kernel_size=3, activation='relu'))
        cnn.add(MaxPooling2D(pool_size=(2,2)))
        cnn.add(Dropout(0.25))

        cnn.add(Flatten())
        cnn.add(Dense(128, activation='relu'))
        cnn.add(Dropout(0.5))
        cnn.add(Dense(35, activation='softmax'))


    cnn.compile(loss=lossF, optimizer=optim, metrics=['accuracy'])
    cnn.fit(x_train, y_train, batch_size=32, epochs=10, verbose=1)

    return (cnn, (time() - start))

""" ============================================================================================================================
    create a CNN for each entry in parameters list and save the one that produces the highest accuracy
"""
def run_CNN_suite(x_raw, y_raw, test_pct, n_cats, phase):

    x_train, y_train, x_test, y_test = split_format_CNN(x_raw, y_raw, test_pct, n_cats) # format training data for CNN

    all_params = get_CNN_params() # stores list of parameter configurations to make CNN's out of
    models = []                  # stores all CNNs
    accuracies = []             # stores accuracies for different CNNs
    best_acc = 0               # stores best accuracy
    #best_par = {}            # stores parameters of model with best accuracy

    for params in all_params:                                     # train a new CNN model for every
        model, time = train_CNN(x_train, y_train, params, phase) # store model and time elapsed

        models.append(model)                           # append model to list of models
        results = models[-1].evaluate(x_test, y_test) # evaluate using test data
        acc = results[1]                             # store accuracy score

        params['accuracy'] = acc                    # add accuracy key/value pair to dictionary
        params['time taken'] = time                # add tune key/value pair to dictionary

        if (acc > best_acc):     #
            best_acc = acc      # use accuracy to find the best model
            best_mdl = model   #
            best_par = params #
        #print("accuracy: "+str(acc)) # print the accuracy of the model

    best_mdl.save("models/best_cnn") # save the best model for use later

    print("Best model:", best_par)

    return all_params, best_par

""" ============================================================================================================================
    given a folder of new RGBA images, predict what class they belong to using the best of each model
"""
def predict_with_CNN(img_folder, base_folder, image_width):

    best_cnn = k.models.load_model("models/best_cnn")

    filepaths = [img_folder+'/'+f for f in listdir(img_folder) if isfile(join(img_folder, f))]

    # use functions from dataset.py to preprocess new prediction images --------------------------------------------------------
    d.reset_images(img_folder, base_folder)                         # delete preprocessed images & recopy
    d.resize_images(img_folder, image_width)                       # resize images for prediction
    x_tuple = []                                                  #
    for fp in filepaths:                                         # get pixel data from every image
        x_tuple.append(list(Image.open(fp, 'r').getdata()))     #
    image_data = d.get_lists_from_tuples(x_tuple, image_width) # format pixel data properly for prediction
    image_data = np.array(image_data).astype('float32') / 255 # turn image_data into array and normalize

    prediction = best_cnn.predict_classes(image_data) # predict the image's class
    print(prediction)                                #
