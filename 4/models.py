"""
    models.py
    Author: Michael Carter
    Date Created: 04-29-21
    Date Modified:
    This file contains functions for training our image data with different ML models
"""
import numpy as np
import sklearn as sk

from sklearn.neural_network import MLPClassifier

def convert_to_MLP():

    print("no")

def get_MLP_params():

    print("no")


def get_CNN_params():

    print("no")


def train_MLP(x_train, y_train, params):

    print("no")


def train_CNN(x_train, y_train, params):

    print("no")


def run_MLP_suite(x_train, y_train):

    mlp_params = get_mlp_params() # list of dictionaries of parameters to run tests on

    for params in mlp_params:
        train_MLP(mlp_x, mlp_y, params)


def run_CNN_suite(x_train, y_train):

    cnn_params = get_cnn_params() # list of dictionaries of parameters

    for params in cnn_params:
        train_CNN(cnn_x, cnn_y, params)
