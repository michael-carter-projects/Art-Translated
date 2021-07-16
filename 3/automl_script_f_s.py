# Author: Michael Carter
# 21-07-15

""" WINDOWS powershell commands """
# cd C:\Users\lunch\Art-Translated\3
# $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\lunch\Art-Translated\3\ignore\numeric-polygon-283403-e4d6147767c1.json"
# python automl_script_f_s.py

import google.cloud.storage as storage
import csv

"""
given a blob name (directory in image bucket), returns:
the 2nd folder in the directory name (category)
the 3rd folder in the directory name (movement)
"""
def get_category_and_movement(blobname):
    slashes = []
    for l in range(0, len(blobname)):
        if blobname[l] == '/':
            slashes.append(l)
    return blobname[slashes[0]+1:slashes[1]], blobname[slashes[1]+1:slashes[2]]

"""
given a bucket of folders, each representing an art movement and containing
AutoML images associated with said movement, returns a dictionary that
contains movement titles as keys and the number of images in that movement
as values
"""
def create_movement_size_dict():

    total_image_count = 0                    # progress bar stuff ------------------------
    l = 26884                               #
    print("Calculating movement sizes...") #
    printProgressBar(total_image_count, l, prefix = 'Progress:', suffix = '', length = 50)

    movement_size_dict = {} # empty movement:size dictionary
    movement_count = 0 # stores the tentative count of images in the current movement
    prev_movement = "" # stores the name of the movement associated with the previous file

    blobs = storage.Client().list_blobs("art-translated-rvf") # get all filepaths in the GCP bucket
    for blob in blobs:                                    # and loop through every file path
        category, movement_name = get_category_and_movement(blob.name)     # get movement of current image
        if (category == 'fakey'):                                         # if images are fakey:
            if (movement_name != prev_movement):                         # if we have started a new movement:
                if (prev_movement != ""):                               #    / check that one was just completed
                    movement_size_dict[prev_movement] = movement_count #     \ and if so update the dictionary.
                prev_movement = movement_name                         # update the previous movement to current one
                movement_count = 0                                   # and reset the movement image count

            movement_count += 1 # add 1 to the number of images in current movement

            total_image_count += 1 # update image count and print the updated progress bar
            printProgressBar(total_image_count, l, prefix = 'Progress:', suffix = '', length = 50)

    movement_size_dict[prev_movement] = movement_count # add the key:value pair of the last movement

    return movement_size_dict

"""
prints a progress bar to be used for every iteration of a long loop
"""
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = "\r"):
    fraction = str(iteration) + '/' + str(total)
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r{prefix} |{bar}| {fraction} {suffix}', end = printEnd)

"""
given a filename, writes the header of a .csv file to be used by Google AutoML
to determine training, validation, and test datasets for a new Art Translate
movement detection model
"""
def write_csv_header(filename):
    with open(filename, mode='w', encoding='utf-8') as csv_file: # set the header
        fieldnames = ['set', 'image_path', 'label']                         # to identify the 3
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames)           # fields AutoML
        writer.writeheader()                                              # expects to read

"""
given a list of values, writes them into a new line of a .csv file that is
formatted according to the description in the method above
"""
def write_csv_line(filename, csv_list):
    with open(filename, mode='a', encoding='utf-8') as csv_file: # write image data to new line of .csv
        writer = csv.DictWriter(csv_file, fieldnames=['set', 'image_path', 'label'] )
        writer.writerow({'set': csv_list[0], 'image_path': csv_list[1], 'label': csv_list[2]})

"""
writes every image in art_translate_images into a .csv file
formatted to file Google AutoML's specifications:
dataset, google cloud directory, label
"""
def write_csv_file(filename, num_images_in_category, pct_train, pct_valid):

    write_csv_header(filename) # write the header of the .csv file

    movement_size_dict = create_movement_size_dict() # get the number of images in each movement
    movement_count = 0 # stores the tentative count of images in the current movement
    prev_movement = "" # stores the name of the movement associated with the previous file
    img_count = 0;

    print("Retreiving blobs from GCP...")
    blobs = storage.Client().list_blobs("art-translated-rvf") # get all filepaths in the GCP bucket/folder

    print("\nWriting images to .csv file...") #
    printProgressBar(0, num_images_in_category, prefix = 'Progress:', suffix = 'lines written', length = 30)

    for blob in blobs:                                                      # loop through every file path
        category, movement_name = get_category_and_movement(blob.name);         # retreive category and movement

        if (category == 'fakey'):

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
            printProgressBar(img_count, num_images_in_category, prefix = 'Progress:', suffix = 'lines written', length = 30)

    print("\nLook for", filename, "in the parent directory.")

"""
WHERE THE MAGIC HAPPENS ===========================================================================
"""
filename = 'automl_f_s_training_data.csv' # output filename
percent_training   = 80   # here the percentage splits
percent_validation = 10  # for training, validation, and
percent_testing    = 10 # test sets can be adjusted

write_csv_header(filename) # write the header of the .csv file
write_csv_file(filename, 26884, percent_training, percent_validation)
