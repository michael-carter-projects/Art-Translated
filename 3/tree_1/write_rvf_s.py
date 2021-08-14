# Author: Michael Carter
# 21-07-13

""" WINDOWS powershell credentials command """
# $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\lunch\Art-Translated\3\ignore\numeric-polygon-283403-e4d6147767c1.json"

import google.cloud.storage as storage
from helpers import print_progress_bar
from helpers import write_csv_header
from helpers import write_csv_line

""" ============================================================================================================================
given a blob name (directory in image bucket), returns:
the 2nd folder in the directory name (category)
"""
def get_category(blobname):
    slashes = []
    for l in range(0, len(blobname)):
        if blobname[l] == '/':
            slashes.append(l)
    return blobname[slashes[0]+1:slashes[1]]








""" ============================================================================================================================
writes every image in art_translate_images into a .csv file
formatted to file Google AutoML's specifications:
dataset, google cloud directory, label
"""
def write_csv_file(filename, category, pct_train, pct_valid):

    print("Retreiving blobs from GCP...")
    blobs = storage.Client().list_blobs("art-translated-rvf") # get all filepaths in the GCP bucket/folder

    if (category == 'fakey'):
        num_images_in_category = 26884 # number of images in current category
    else:
        num_images_in_category = 34485 # number of images in current category

    num_train  = int((pct_train/100) * num_images_in_category) # convert percentages
    num_valid  = int((pct_valid/100) * num_images_in_category) # to integer counts
    img_count = 0 # stores the tentative count of images in the current category

    print("\nWriting "+category+" images to .csv file...") #
    print_progress_bar(0, num_images_in_category, prefix = 'Progress:', suffix = 'lines written')

    for blob in blobs:                                                     # and loop through every file path
        if (get_category(blob.name) == category):                         #
            if img_count in range(0, num_train):                         # .csv 0 -- dataset
                dataset = "TRAIN"                                       #     assign images to
            elif img_count in range(num_train, num_train + num_valid): #     TRAIN, VALIDATE, or TEST
                dataset = "UNASSIGNED"                                #     datasets according to the
            else:                                                    #     percentages set above
                dataset = "TEST"                                    #
            directory = "gs://art-translated-rvf/" + blob.name      # .csv 1 -- google cloud directory
            label = category                                      # .csv 2 -- AutoML classification label

            csv_list = [dataset, directory, label] # create list of values for next line of .csv file

            write_csv_line(filename, csv_list) # write the values to a new line of the file

            img_count += 1 # update image count and print the updated progress bar
            print_progress_bar(img_count, num_images_in_category, prefix = 'Progress:', suffix = 'lines written')

    print("\nLook for", filename, "in the parent directory.")

""" ============================================================================================================================
WHERE THE MAGIC HAPPENS
"""
write_csv_file('automl_rvf_s_training_data.csv', 'fakey',  80, 10)
write_csv_file('automl_rvf_s_training_data.csv', 'realey', 80, 10)
