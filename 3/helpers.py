import csv

""" ============================================================================================================================
prints a progress bar to be used for every iteration of a long loop
"""
def print_progress_bar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 30, fill = '█', printEnd = "\r"):
    fraction = str(iteration) + '/' + str(total)
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r{prefix} |{bar}| {fraction} {suffix}', end = printEnd)

""" ============================================================================================================================
given a filename, writes the header of a .csv file to be used by Google AutoML
to determine training, validation, and test datasets for a new Art Translate
movement detection model
"""
def write_csv_header(filename):
    with open(filename, mode='w', encoding='utf-8') as csv_file:   # set the header
        fieldnames = ['set', 'image_path', 'label']               # to identify the 3
        writer = csv.DictWriter(csv_file, fieldnames=fieldnames) # fields AutoML
        writer.writeheader()                                    # expects to read

""" ============================================================================================================================
given a list of values, writes them into a new line of a .csv file that is
formatted according to the description in the method above
"""
def write_csv_line(filename, csv_list):
    with open(filename, mode='a', encoding='utf-8') as csv_file: # write image data to new line of .csv
        writer = csv.DictWriter(csv_file, fieldnames=['set', 'image_path', 'label'] )
        writer.writerow({'set': csv_list[0], 'image_path': csv_list[1], 'label': csv_list[2]})

""" ============================================================================================================================
given a bucket of folders, each representing an art movement and containing
AutoML images associated with said movement, returns a dictionary that
contains movement titles as keys and the number of images in that movement
as values
"""
def get_movement_sizes(bucket_name, target_cat, l):

    total_image_count = 0 # progress bar stuff -------------------
    print("Calculating movement sizes...")
    print_progress_bar(total_image_count, l, prefix = 'Progress:')

    movement_size_dict = {} # empty movement:size dictionary
    movement_count = 0 # stores the tentative count of images in the current movement
    prev_movement = "" # stores the name of the movement associated with the previous file

    blobs = storage.Client().list_blobs(bucket_name)                         # get all filepaths in the GCP bucket
    for blob in blobs:                                                      # and loop through every file path
        category, movement_name = get_category_and_movement(blob.name)     # get movement of current image
        if (category == target_cat):                                      # if images are fakey:
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
