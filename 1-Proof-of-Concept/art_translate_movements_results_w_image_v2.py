# !/usr/bin/env python
# -*- coding: utf-8 -*-
__author__ = 'mevans'
"""
Takes art movement label designation output from an AutoML analysis of an image and matches it to a database of
information about that specific art movement.

Differs from: art_translate_test_t3.py in that it shows the *subject image* in iOS Preview Window

/Users/markevans/Documents/Python_Projects/Art_Translate_Machine_Learning/art_translate-movements_results_w_image_v2.py
Companion program: art_translate_test_t3.py

Designed to work with incoming automl data formatted as: Desired output from: art_translate_test_t3.py.png
Designed to work with: art_translate_test_t3.py which process the above input as python results.

"""

import csv
from operator import itemgetter  # sorts results list to print the results
# Why won't this module work? below:
# from Open_Symbol_DB import open_Symbol_Database_csv                  # Open Symbol_Database.csv
# ModuleNotFoundError: No module named 'Open_Symbol_DB'  BECAUSE IT ISN'T IN THE SAME PROJECT!!!!!!!!


def art_translate_movements_csv_path():
    return ''
def csv_art_movements_file_title():
    return 'Art_Translate_Art_Movements_10_21_20.csv'

def accepted_level_of_confidence():
    """ Only reports on results higher or = this confidence level."""
    level_of_confidence = 0  # set to generate all possible results from automl
    return level_of_confidence

def open_movements_csv_convert_to_db():
    """ Create movements data from csv."""
    file_title = csv_art_movements_file_title()
    file_folder = art_translate_movements_csv_path()
    file_subject = file_folder+file_title
    myfile = open(file_subject,'rt') # or "ascii" , "utf8"
    movements_data = csv.reader(myfile)
    return movements_data

#def automl_input():
    # Import strings of results from automl labeling process and puts into nested lists.
    # This will come from automl labeling process """
#    test_dev_input = [['Early Renaissance',8],['Impressionism',7]]
#    return test_dev_input      # this is manual override till automl import works.

def preview_subject_image(filepath):
    import os
    """ Finds and previews the subject image for better UX."""
    #subject_image_path = '/Users/markevans/Documents/Python_Projects/Art_Translate_Machine_Learning/'
    #subject_image_file_name = 'test_image_0.png'
    os.system("open " + filepath) #subject_image_path + subject_image_file_name ) # Previewing
#preview_subject_image()

def prep_results_from_automl_labeling(automl_movement_title):
    """ preps and normalizes automl labeling input for matching."""
    automl_movement_title = automl_movement_title.lower()
    automl_movement_title = automl_movement_title.strip()
    # automl_movement_probability_score = ?????        # when this is ready it might need formatting
    return automl_movement_title    #,automl_movement_probability_score

def prep_art_movements_csv_data_fields(data_field_input):
    """ preps and normalizes data csv fields for matching."""
    data_field_input = data_field_input.lower()
    data_field_input = data_field_input.strip()
    # possible pythonic? Not that much faster: https://stackoverflow.com/questions/50494216/performing-multiple-string-operations-on-a-pandas-series-dataframe
    return data_field_input

def nested_output_of_automl_label_results_matched_to_movements_db(automl_results):
    """Matches input from automl labeling to Movements DB csv and creates nested lists for reporting."""
    movements_database = open_movements_csv_convert_to_db()
    #automl_results = automl_input()
    movement_all_results = []
    for data_field in movements_database:
        for movement in automl_results:
            movement_from_automl_prepped = prep_results_from_automl_labeling(movement[0])
            movement_name = data_field[0]
            movement_name_from_db_prepped = prep_art_movements_csv_data_fields(movement_name)
            movement_results_output_list = []
            if movement_name_from_db_prepped == movement_from_automl_prepped and movement[1] >= accepted_level_of_confidence():
                movement_results_output_list.append(data_field[0])  # movement name
                movement_results_output_list.append(data_field[9])  # movement start date
                movement_results_output_list.append(data_field[11]) # movement end date
                movement_results_output_list.append(data_field[3])  # style description
                movement_results_output_list.append(data_field[18]) # critical commentary of movement
                movement_results_output_list.append(data_field[5])  # movement themes
                movement_results_output_list.append(data_field[6])  # why movement evolved
                movement_results_output_list.append(data_field[7])  # why movement devolved
                movement_results_output_list.append(movement[1])    # automl movement labeling confidence
                movement_all_results.append(movement_results_output_list)
    return movement_all_results

def report_art_movement_image_analysis_results(automl_results):
    """ Preview the subject image and output report of results. """
    #preview_subject_image()
    report_list_of_art_movement_results = nested_output_of_automl_label_results_matched_to_movements_db(automl_results)
    report_list_of_art_movement_results = sorted(report_list_of_art_movement_results, key=itemgetter(8),
                                                  reverse=True) # Desending confidence factors.
    num_of_results = len(report_list_of_art_movement_results)
    if num_of_results != 0:
        for results in report_list_of_art_movement_results:
            print ()
            print ("---  Movement Results -------------------------------------------------------")
            print ("         Movement Name: ",results[0])
            print ("           Dates:       ",results[1],"-",results[2])
            print ("           Style:       ",results[3])
            print ("           Critical Commentary:  ",results[4])
            print ("           Themes:               ",results[5])
            print ("           Reason for starting:  ",results[6])
            print ("           Reason for ending:    ",results[7])
            print ("           Confidence Factor:    ",results[8])
            print ()
        print ("--- Total Number of Results: -----------------------------------------------------",num_of_results)
    else:
        print ()
        print ("Sorry. The specific art movement cannot be identified above a confidence level of: ",
               accepted_level_of_confidence())
        print ()
    return

#report_art_movement_image_analysis_results()
