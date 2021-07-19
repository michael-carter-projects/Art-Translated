# Author: Michael Carter
# 21-07-19

""" WINDOWS powershell credentials command """
# $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\lunch\Art-Translated\3\ignore\numeric-polygon-283403-e4d6147767c1.json"

import google.cloud.storage as storage
from helpers import print_progress_bar
from helpers import write_csv_header
from helpers import write_csv_line
from helpers import get_movement_sizes

""" ============================================================================================================================
given a blob name (directory in image bucket), returns:
the 2nd folder in the directory name (category)
the 3rd folder in the directory name (movement)
"""
def get_category_and_movement(blobname):
    slashes = []
    for l in range(0, len(blobname)):
        if blobname[l] == '/':
            slashes.append(l)

    m = blobname[slashes[1]+1:slashes[2]]

    if (m == 'early-renaissance' or m == 'high-renaissance' or m == 'mannerism-late-renaissance' or m == 'northern-renaissance'):
        return blobname[slashes[0]+1:slashes[1]], 'renaissance'
    else:
        return blobname[slashes[0]+1:slashes[1]], m

""" ============================================================================================================================
writes every image in art_translate_images into a .csv file
formatted to file Google AutoML's specifications:
dataset, google cloud directory, label
"""
def write_csv_file(filename, l, pct_train, pct_valid):

    write_csv_header(filename) # write the header of the .csv file

    movement_size_dict = get_movement_sizes("art-translated-rvf", 'realey', l) # get the number of images in each movement
    movement_count = 0 # stores the tentative count of images in the current movement
    prev_movement = "" # stores the name of the movement associated with the previous file
    img_count = 0;

    blobs = storage.Client().list_blobs("art-translated-rvf") # get all filepaths in the GCP bucket/folder

    print("\nWriting images to .csv file...") #
    print_progress_bar(0, l, prefix = 'Progress:', suffix = 'lines written')

    for blob in blobs:                                                  # loop through every file path
        category, movement_name = get_category_and_movement(blob.name) # retreive category and movement




        if (category == 'realey'):

            if (movement_name != prev_movement): # if we have started a new movement,
                prev_movement = movement_name   # update the previous movement to current one
                movement_count = 0             # and reset the movement image count

            num_images = movement_size_dict[movement_name] # number of images in current movement
            num_train = int((pct_train/100) * num_images) # convert percentages
            num_valid = int((pct_valid/100) * num_images) # to integer counts

            if movement_count in range(0, num_train):                         # .csv 0 -- dataset
                dataset = "TRAIN"                                            #     assign images to
            elif movement_count in range(num_train, num_train + num_valid): #     TRAIN, VALIDATE, or TEST
                dataset = "UNASSIGNED"                                     #     datasets according to the
            else:                                                         #     percentages set above
                dataset = "TEST"                                         #
            directory = "gs://art-translated-rvf/" + blob.name          # .csv 1 -- google cloud directory
            label = movement_name                                      # .csv 2 -- AutoML classification label

            csv_list = [dataset, directory, label] # create list of values for next line of .csv file
            movement_count += 1                   # increment the number of images in current movement

            write_csv_line(filename, csv_list) # write the values to a new line of the file

            img_count += 1 # update image count and print the updated progress bar
            print_progress_bar(img_count, l, prefix = 'Progress:', suffix = 'lines written')

    print("\nLook for", filename, "in the parent directory.")

""" ============================================================================================================================
WHERE THE MAGIC HAPPENS
"""
write_csv_file('automl_r_s_training_data.csv', 34485, 80, 10)
