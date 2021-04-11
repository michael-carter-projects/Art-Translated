"""
tests every test image in test_images to determine if model predicted
the correct movement
"""
import csv
import api_caller_t3


""" -----------------------------------------------------------------------------------------------
given a list of strings, returns the length of the longest string
"""
def get_max_string_length(L):
    best = 0
    for s in L:
        if len(s) > best:
            best = len(s)
    return best


""" -----------------------------------------------------------------------------------------------
given the filename of an art image, read correct_movements.csv to determine the art movement
associated with the piece
"""
def get_expected_movement(filename):

    csv_file = csv.reader(open('correct_movements.csv', "r"), delimiter=",")
    expected_mvmt = "*** correct movement not found ***"

    for row in csv_file:           # search correct_movements.csv,
        if filename == row[0]:     # find the file name, and
            expected_mvmt = row[1] # return corresponding movement

    return expected_mvmt


""" -----------------------------------------------------------------------------------------------
compare an art image's true art movement with the one predicted by AutoML and print the success or
failure of said prediction as well as the confidence score
"""
def print_image_result(filepath, filename, result_mvmt, result_score, longest_file):

    if (get_expected_movement(filename) == result_mvmt): # if the model predicted the movement,
        msg = "SUCCESS"                                  # function will print success
    else:                                                # otherwise,
        msg = "FAILURE"                                  # function will print failure

    for i in range(longest_file - len(filename)): # add spaces to the filename
        filename += " "                           # for formatting
    for i in range(22 - len(result_mvmt)): # add spaces to the movement
        result_mvmt += " "                 # for formatting

    # print the results of the test
    print(filename, ' --  Model predicted', result_mvmt, 'with score', result_score, '::', msg)


"""------------------------------------------------------------------------------------------------
given a list of predictions returned by AutoML, returns the one with the highest confidence score
"""
def get_best_result(results):

    if len(results) == 0:                        # if the model did not predict anything,
        return ["*** no prediction made ***", 1] # return this tuple

    best = results[0]             # otherwise,
    for result in results:        # find the prediction
        if (result[1] > best[1]): # with the highest
            best = result         # confidence score

    return best # return the best prediction as a tuple


""" -----------------------------------------------------------------------------------------------
Runs every image in test_images folder through AutoML model and compares prediction to the correct
movement as listed in correct_movements.csv
"""
def test_model_on_all_images(img_folder, filenames):

    # loop through every file in test_images folder
    for file_index in range(len(filenames)):

        # store name of current file
        filename = filenames[file_index]

        # set the filepath of the file to be analyzed
        filepath = img_folder + "/" + filenames[file_index]

        # run API caller to determine most likely movement using AutoML model
        results = api_caller_t3.get_results_from_automl(filepath)
        automl_result = get_best_result(results)

        longest_file = get_max_string_length(filenames) # for formatting

        # print the result of the test for each image
        print_image_result(filepath, filename, automl_result[0], automl_result[1], longest_file)

    print("===================================================== TESTING COMPLETE =====================================================")
