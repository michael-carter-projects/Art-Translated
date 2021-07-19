import google.cloud.storage as storage
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
