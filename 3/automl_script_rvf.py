# Author: Michael Carter
# 20-01-07

""" WINDOWS shell commands """
# cd X:\Computer-Science\GitHub\Art-Translate\3-AutoML-CSV
# set GOOGLE_APPLICATION_CREDENTIALS=C:\Users\lunch\Art-Translated\3\ignore\numeric-polygon-283403-e4d6147767c1.json
""" WINDOWS powershell commands """
# cd C:\Users\lunch\Art-Translated\3
# $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\lunch\Art-Translated\3\ignore\numeric-polygon-283403-e4d6147767c1.json"
""" MAC/LINUX shell commands """
# cd Documents/GitHub/4-Art-Translate/3-AutoML-CSV
# export GOOGLE_APPLICATION_CREDENTIALS="/Users/Michael/Documents/GitHub/Art-Translate/3-AutoML-CSV/art-translate-testing-b921ae47d69e.json"

# python automl_script_rvf.py

import google.cloud.storage as storage
import csv

"""
given a blob name (directory in art_translate_1 image bucket), returns the first
folder in the directory name, which is the movement associated with an image
e.g. get_movement("cubism/art_image.png") = "cubism"
"""
def get_category(blobname):
    slashes = []
    for l in range(0, len(blobname)):
        if blobname[l] == '/':
            slashes.append(l)
    return blobname[slashes[0]+1:slashes[1]]

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
    printProgressBar(0, num_images_in_category, prefix = 'Progress:', suffix = 'lines written', length = 50)

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
            printProgressBar(img_count, num_images_in_category, prefix = 'Progress:', suffix = 'lines written', length = 50)

    print("\nLook for", filename, "in the parent directory.")

"""
WHERE THE MAGIC HAPPENS ===========================================================================
"""
filename = 'automl_rvf_training_data.csv' # output filename
percent_training   = 80   # here the percentage splits
percent_validation = 10  # for training, validation, and
percent_testing    = 10 # test sets can be adjusted

write_csv_header(filename) # write the header of the .csv file
write_csv_file(filename, 'fakey', percent_training, percent_validation)
write_csv_file(filename, 'realey', percent_training, percent_validation)
