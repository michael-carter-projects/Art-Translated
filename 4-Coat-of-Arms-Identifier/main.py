"""
 main.py
 Author: Michael Carter
 Date Created: 04-29-21
 Date Modified:
 This script is used to train all machine learning models, store their results,
 and plot them
"""

import dataset as d
import models as m
import plots as p

""" manipulate dataset ======================================================================================================"""

image_dest = "coat-of-arms_images"      # name of destination folder for files created, filtered, & resized for training
image_base = "coat-of-arms_images_base" # name of folder containing original images collected on internet
dataset_fn = "coa_training_data.csv"    # filename of (image filename, class) pairs file
image_width = 100

d.reset_images(image_dest, image_base) # if re-running the script, delete all previous images and copy originals in place

d.multiply_images(image_dest) # create many filtered images for every original input image

d.resize_images(image_dest, image_width) # resize all images in dataset to a width of 100 (scale height proportionally)

d.write_filename_class_pairs(image_dest, dataset_fn) # classify training data from source file and write x, y matrix into .csv

#X_train, y_train = d.retreive_dataset_from_file(dataset_fn) # read the written file to two lists
""" train models using dataset from file ===================================================================================="""
