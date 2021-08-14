# Author: Michael Carter
# 21-07-15

""" WINDOWS powershell credentials command """
# $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\lunch\Art-Translated\3\ignore\numeric-polygon-283403-e4d6147767c1.json"

import google.cloud.storage as storage
from helpers import print_progress_bar
from helpers import write_csv_header
from helpers import write_csv_line

""" ============================================================================================================================
given a blob name (directory in image bucket), returns:
the 2nd folder in the directory name (category)
the 3rd folder in the directory name (movement)
"""
def get_movement(blobname):
    slashes = []
    for l in range(0, len(blobname)):
        if blobname[l] == '/':
            slashes.append(l)

    # print(blobname[            :slashes[0]]) # 1_a20
    # print(blobname[slashes[0]+1:slashes[1]]) # 2_arch, 3_2D, 4_obj
    # print(blobname[slashes[1]+1:slashes[2]]) # 5_abs, 6_ren, art_deco, art_nouveau, etc.
    if (len(slashes) <= 3):
        #print(blobname[slashes[2]+1:]) # image name
        return blobname[slashes[1]+1:slashes[2]]
    #else:
        #print(blobname[slashes[2]+1:slashes[3]]) # abs or ren movement
        #print(blobname[slashes[3]+1:])           # image name """
    return blobname[slashes[2]+1:slashes[3]]


""" ============================================================================================================================
given a bucket of folders, each representing an art movement and containing
AutoML images associated with said movement, returns a dictionary that
contains movement titles as keys and the number of images in that movement
as values
"""
def get_movement_sizes(bucket_name, l):

    total_image_count = 0 # progress bar stuff -------------------
    print("Calculating movement sizes...")
    print_progress_bar(total_image_count, l, prefix = 'Progress:')

    movement_size_dict = {} # empty movement:size dictionary
    movement_count = 0 # stores the tentative count of images in the current movement
    prev_movement = "" # stores the name of the movement associated with the previous file

    blobs = storage.Client().list_blobs(bucket_name)                         # get all filepaths in the GCP bucket
    for blob in blobs:                                                      # and loop through every file path
        movement_name = get_movement(blob.name)                            # get movement of current image

        if (movement_name != prev_movement):                         # if we have started a new movement:
            if (prev_movement != ""):                               #    / check that one was just completed
                movement_size_dict[prev_movement] = movement_count #     \ and if so update the dictionary.
            prev_movement = movement_name                         # update the previous movement to current one
            movement_count = 0                                   # and reset the movement image count

        movement_count += 1 # add 1 to the number of images in current movement

        total_image_count += 1 # progress bar stuff ------------------
        print_progress_bar(total_image_count, l, prefix = 'Progress:')

    movement_size_dict[prev_movement] = movement_count # add the key:value pair of the last movement

    return movement_size_dict

""" ============================================================================================================================
writes every image in art_translate_images into a .csv file
formatted to file Google AutoML's specifications:
dataset, google cloud directory, label
"""
def write_csv_file(filename, bucketname, l, pct_train, pct_valid):

    write_csv_header(filename) # write the header of the .csv file

    movement_size_dict = get_movement_sizes(bucketname, l) # get the number of images in each movement
    #movement_count = 0 # stores the tentative count of images in the current movement
    #prev_movement = "" # stores the name of the movement associated with the previous file
    img_count = 0;

    blobs = storage.Client().list_blobs(bucketname) # get all filepaths in the GCP bucket/folder

    print("\nWriting images to .csv file...") #
    print_progress_bar(0, l, prefix = 'Progress:', suffix = 'lines written')

    for blob in blobs:                                                  # loop through every file path
        movement_name = get_movement(blob.name) # retreive category and movement

        #if (movement_name != prev_movement): # if we have started a new movement,
        #    prev_movement = movement_name   # update the previous movement to current one
        #    movement_count = 0             # and reset the movement image count

        #num_images = movement_size_dict[movement_name] # number of images in current movement
        #num_train = int((pct_train/100) * num_images) # convert percentages
        #num_valid = int((pct_valid/100) * num_images) # to integer counts

        #if movement_count in range(0, num_train):                         # .csv 0 -- dataset
        #    dataset = "TRAIN"                                            #     assign images to
        #elif movement_count in range(num_train, num_train + num_valid): #     TRAIN, VALIDATE, or TEST
        #    dataset = "UNASSIGNED"                                     #     datasets according to the
        #else:                                                         #     percentages set above
        #    dataset = "TEST"                                         #

        dataset = "UNASSIGNED"                                       # .csv 0 -- dataset
        directory = "gs://" + bucketname + "/" + blob.name          # .csv 1 -- google cloud directory
        label = movement_name                                      # .csv 2 -- AutoML classification label

        csv_list = [dataset, directory, label] # create list of values for next line of .csv file
        #movement_count += 1                   # increment the number of images in current movement

        write_csv_line(filename, csv_list) # write the values to a new line of the file

        img_count += 1 # update image count and print the updated progress bar
        print_progress_bar(img_count, l, prefix = 'Progress:', suffix = 'lines written')

    print("\nLook for", filename, "in the parent directory.")

""" ============================================================================================================================
WHERE THE MAGIC HAPPENS
"""
write_csv_file('automl_ffa_training_data.csv', "art-translated", 60012, 80, 10)
