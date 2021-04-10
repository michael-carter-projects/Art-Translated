"""
gives user the option of analyzing any image in the test_images folder,
then calls the required methods to:
    1: call AutoML API and retreive movement info for image
    2: access movement database .csv and output movement information
    3: test model to determine the
"""

from os import listdir
from os.path import isfile, join
import art_translate_api_caller_t3
import art_translate_movements_results_w_image_v2
import art_translate_model_tests

""" -----------------------------------------------------------------------------------------------
determines if a string is an integer
"""
def is_integer(s):
    try:
        int(s)
        return True
    except ValueError:
        return False

""" -----------------------------------------------------------------------------------------------
determines if user input is valid yes/no selection
"""
def valid_yesno(s):
    if (s == 'Y' or s == 'y' or s == 'N' or s == 'n'):
        return True
    else:
        print('Input must be y, Y, n, N')
        return False

""" -----------------------------------------------------------------------------------------------
determines if user input is valid selection of test_image, and prints relevant messages
"""
def valid_input(input, num_img):
    if (is_integer(input) == False):
        print('Input must be an integer.')
        print()
        return False
    else:
        if (int(input) < 0 or int(input) > num_img-1):
            print('Input must be within range 0 -', num_img-1)
            print()
            return False
        else:
            return True

""" -----------------------------------------------------------------------------------------------
given a filename, uses AutoML to determine the movement associated with a piece of art
and prints information about said movement from database .csv file
"""
def analyze_image(img_folder, filenames):

    num_img = len(filenames) # store number of images in file for later
    valid = False            # used to loop menu prompt

    # repeatedly prompt user for the image to be analyzed
    while(valid == False):
        print('Which image would you like to analyze?') # prompt user

        for i in range(num_img):                # print image filenames
            print('[', i, '] --', filenames[i]) # and menu options

        input1 = input()                      # get user input
        valid  = valid_input(input1, num_img) # and validate

    # set the filepath of the file to be analyzed
    filepath = img_folder + "/" + filenames[int(input1)]

    # preview the image being analyzed for user convenience
    art_translate_movements_results_w_image_v2.preview_subject_image(filepath)

    # run API caller to determine movement data using AutoML model
    results = art_translate_api_caller_t3.get_results_from_automl(filepath)

    for result in results:
        print(result)

    # run movements_results_v2 to aquire movement information
    art_translate_movements_results_w_image_v2.report_art_movement_image_analysis_results(results)

""" -----------------------------------------------------------------------------------------------
displays a menu that allows user to either analyze a single image or test the AutoML model
"""
def run_main_menu(img_folder, filenames):

    num_img = len(filenames) # store number of images in file for later
    valid = False            # used to loop inner menu prompts
    repeat_main = True       # used to loop outer menu prompt

    print('===================================') # print menu title
    print('Art Translate Proof of Concept Test') #
    print('===================================') #
    print()

    # loop indefinitely so that user may analyze any number of images or
    # test the images as much as they want
    while(repeat_main == True):
        # reset valid flag if main menu is being repeated
        valid = False
        # loop until the user selects a valid menu option
        while(valid == False):
            print('What do you want to do?')
            print('[ 0 ] -- Analyze a single image')
            print('[ 1 ] -- Test model results for all images')

            input1 = input()                # get user input
            valid  = valid_input(input1, 2) # and validate

            if (input1 == '0'):
                # preview image, analyze and print movement information
                analyze_image(img_folder, filenames)
            elif (input1 == '1'):
                # test every image for correct
                art_translate_model_tests.test_model_on_all_images(img_folder, filenames)

        valid = False # reset valid

        # ask user if they want to analyze/test more images
        while(valid == False):
            print()
            print('Would you like to do something else?')
            input2 = input()

            valid = valid_yesno(input2) # validate user input

            if (input2 == 'n' or input2 == 'N'): # if user selects no,
                repeat_main = False              # do not repeat the main menu
            else:
                valid = True



"""============================================================================================="""
""" THE PART THAT RUNS EVERYTHING                                                               """
"""============================================================================================="""

# automatically retreive filenames from test image folder -----------------------------------------
img_folder = "test_images"
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))]

# run the main menu of the program ----------------------------------------------------------------
run_main_menu(img_folder, filenames)
