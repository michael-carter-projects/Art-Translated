"""=============================================================================================================================
    dataset.py
    Author: Michael Carter
    Date Created: 04-10-2021
    Date Modified: 05-01-21
    This script is used to pre-process the coat of arms images to be used for training.
============================================================================================================================="""

from progress_bar import printProgressBar as ppb

import os
from shutil import copyfile
from os import listdir
from os.path import isfile, join
from PIL import Image, ImageEnhance, ImageFilter
from random import randrange

p = 0 # progress counter for file multiplication
l = 1054 # number of images to be added to

""" ============================================================================================================================
    given a filename name.ext, returns 'name', '.ext'
"""
def split_filename(filename, p):
    ppb(p, l, prefix = 'Creating filtered images:  ', suffix = 'Complete') # update progress bar
    name, ext = os.path.splitext(filename) # split filename
    return name, ext # return both

""" ============================================================================================================================
    create a new image with 'factor' contrast named 'filenamesuffix.ext'
"""
def create_new_contrast(filename, factor, suffix, p):
    im = Image.open(filename)               # open image
    enhancer = ImageEnhance.Contrast(im)    # get image enhancer
    im_output = enhancer.enhance(factor)    # increase contrast
    name, ext = split_filename(filename, p) # separate filename and extension
    im_output.save(name+suffix+ext)         # save image with suffix appended to name

""" ============================================================================================================================
    create a new blurred image named 'filenamesuffix.ext'
"""
def create_new_blur(filename, suffix, p):
    im = Image.open(filename)               # open image
    im_output = im.filter(ImageFilter.BLUR) # blur the image
    name, ext = split_filename(filename, p) # separate filename and extension
    im_output.save(name+suffix+ext)         # save image with suffix appended to name

""" ============================================================================================================================
    create a new image with 'factor' exposure named 'filenamesuffix.ext'
"""
def create_new_exposure(filename, factor, suffix, p):
    im = Image.open(filename)               # open image
    enhancer = ImageEnhance.Brightness(im)  # get image enhancer
    im_output = enhancer.enhance(factor)    # increase brightness
    name, ext = split_filename(filename, p) # separate filename and extension
    im_output.save(name+suffix+ext)         # save image with suffix appended to name


"""=============================================================================================================================
    multipy the number of images in the initial dataset by 32, (31 new filtered images per original)
"""
def multiply_images(img_folder):
    p = 1
    ppb(0, l, prefix = 'Creating filtered images:  ', suffix = 'Complete', length = 100) # print initial progress bar

    # For each of the source images (now 1 per COA), create 3 copies with different levels of contrast -------------------------
    filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))]
    for fn in filenames:
        create_new_contrast(img_folder+'/'+fn, 0.2, "-ct", p) # filename-ct.png: ct = contrast tiny
        p += 1
        create_new_contrast(img_folder+'/'+fn, 0.4, "-cl", p) # filename-cl.png: cl = contrast low
        p += 1
        create_new_contrast(img_folder+'/'+fn, 1.5, "-ch", p) # filename-ch.png: ch = contrast high
        p += 1

    # For each of the source images (now 4 per COA), create a copy that is blurry ----------------------------------------------
    filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))] # update filenames list
    for fn in filenames:
        create_new_blur(img_folder+'/'+fn, '-b', p) # filename-cl-b.png: b = blurred
        p += 1

    # For each of the source images (now 8 per COA), create 3  copies with different levels of exposure ------------------------
    filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))] # update filenames list
    for fn in filenames:
        create_new_exposure(img_folder+'/'+fn, 0.2, '-et', p) # filename-cl-bb-et.png: et = exposure tiny
        p += 1
        create_new_exposure(img_folder+'/'+fn, 0.5, '-el', p) # filename-cl-bb-el.png: el = exposure low
        p += 1
        create_new_exposure(img_folder+'/'+fn, 1.5, '-eh', p) # filename-cl-bb-eh.png: eh = exposure high
        p += 1

""" ============================================================================================================================
    delete all images created by script and copy originals back into destination folder to run script again
"""
def reset_images(image_dest, image_base):

    # delete all images in the image_dest folder -------------------------------------------------------------------------------
    filenames = [f for f in listdir(image_dest) if isfile(join(image_dest, f))]
    if (len(filenames) != 0):
        ppb(0, len(filenames), prefix = 'Deleting current dataset:  ', suffix = 'Complete') # print progress
        for i in range(len(filenames)):
            os.remove(join(image_dest, filenames[i]))
            ppb(i+1, len(filenames), prefix = 'Deleting current dataset:  ', suffix = 'Complete') # print progress

     # copy all images from image_base to image_dest ----------------------------------------------------------------------------
    filenames_bu = [f for f in listdir(image_base) if isfile(join(image_base, f))]

    ppb(0, len(filenames_bu), prefix = 'Copying original images:   ', suffix = 'Complete') # print progress
    for i in range(len(filenames_bu)):
        copyfile(join(image_base, filenames_bu[i]), join(image_dest, filenames_bu[i]))
        ppb(i+1, len(filenames_bu), prefix = 'Copying original images:   ', suffix = 'Complete') # print progress


""" ============================================================================================================================
    resize every image to a new width of nw
"""
def resize_images(image_dest, nw):
    filenames = [f for f in listdir(image_dest) if isfile(join(image_dest, f))]
    ppb(0, len(filenames), prefix = 'Resizing multiplied images:', suffix = 'Complete') # print progress

    for i in range(len(filenames)):
        im = Image.open(join(image_dest, filenames[i])) # open the image
        # round(im.size[1]/round(im.size[0]/nw))
        resized_im = im.resize((nw, nw)) # resize every image to "nw" pixels wide & tall
        resized_im.save(join(image_dest, filenames[i]))    # save the cropped image
        ppb(i+1, len(filenames), prefix = 'Resizing multiplied images:', suffix = 'Complete') # print progress

""" ============================================================================================================================
    'classify' each image with a number representing it's class
"""
def write_filename_class_pairs(image_dest, dataset_fn):

    filenames = [f for f in listdir(image_dest) if isfile(join(image_dest, f))]
    curr_name = "" # name of current image excluding filter suffixes
    last_name = "" # name of previous image excluding filter suffixes
    y = 0          # value of class to be attributed to an image

    f = open(dataset_fn, "w+") # open file for writing

    # write every name and it's class as an integer into the file given by dataset_fn  ----------------------------------------
    for fn in filenames:
        curr_name = fn.split('=')[0]                      # store current filename excluding filter suffixes
        if (curr_name != last_name):                     # if we have entered a new class of images
            y += 1                                      # iterate y value
        f.write(image_dest+'/'+fn + ',' + str(y)+'\n') # write x, y pair to file
        last_name = curr_name                         # update last-name to current-name
    f.close()                                        # close the file

""" ============================================================================================================================
    given a 2D list with 3rd dimension of tuples ([num_images], [all_pixels], (each_pixel))
    return 4D list of lists with xy values =>    ([num_images], [rows], [columns], [each_pixel])
"""
def get_lists_from_tuples(x_tuple, image_width):

    x_train = []
    for i in x_tuple:
        im = [] # will be 2d list
        index = 0;
        jindex = 0;
        for j in i:
            if (jindex == 0):
                new_row = []
                im.append(new_row)
            im[index].append(list(j))
            jindex += 1;
            if (jindex == image_width):
                jindex = 0;
                index += 1;
        x_train.append(im)
    return x_train

def randomize_invisible_pixels(x_train):
    out = []
    for image in range(len(x_train)):
        for row in range(len(x_train[image])):
            for col in range(len(x_train[image][row])):
                if (x_train[image][row][col][3] < 50): # if alpha value is lower than 50 (0 = transparent, 255 = opaque)
                    x_train[image][row][col][0] = randrange(256)    # randomize the values of the red
                    x_train[image][row][col][1] = randrange(256)   # randomize the values of the blue
                    x_train[image][row][col][2] = randrange(256)  # randomize the values of the green
                    x_train[image][row][col][3] = randrange(256) # randomize the values of the alpha
                if image == 300:
                    out.append(tuple(x_train[image][row][col]))

    image_out = Image.new('RGBA', (50,50))
    image_out.putdata(out)
    image_out.save('plots/test_out.png')

    return x_train

""" ============================================================================================================================
    read the file containing the image data and convert it into numerical data for use with sklearn and keras
"""
def retreive_numerical_dataset_from_file(data_file, image_width):

    f = open(data_file, 'r') # open data file for reading
    xyPairs = f.readlines() # read lines into a list
    x_tuple = []           # list for storing x values (list of pixel tuples )
    y_train = []          # list for storing y values (classes 0-33)

    # for every x, y, pair, append x and y to x_train and y to y_train respectively --------------------------------------------
    for xy in xyPairs:
            x_tuple.append(list(Image.open(xy.split(',')[0], 'r').getdata()))  # append pixel values to x list
            y_train.append(int(xy.split(',')[1].strip('\n')))                 # append read y value to y list

    x_train = get_lists_from_tuples(x_tuple, image_width) # re-format 1D list of tuples for each image as 2D list of lists
    x_train = randomize_invisible_pixels(x_train) # randomize values of invisible pixels so as to nullify the influence of the
                                                 # background on training

    return x_train, y_train, y_train[len(y_train)-1] # return x and y lists, and number of categories


def create_noise_and_tint(x_train):

     # create random rgba offsets between [-31, 31] to add to every pixel
    tint = [randrange(-31, 32), randrange(-31, 32), randrange(-31, 32), randrange(-31, 32)]

    out = []
    for image in range(len(x_train)):
        for row in range(len(x_train[image])):
            for col in range(len(x_train[image][row])):
                x_train[image][row][col][0] += randrange(-31, 32) + tint[0]    # randomize the values of the red
                x_train[image][row][col][1] += randrange(-31, 32) + tint[1]   # randomize the values of the blue
                x_train[image][row][col][2] += randrange(-31, 32) + tint[2]  # randomize the values of the green
                x_train[image][row][col][3] += randrange(-31, 32) + tint[3] # randomize the values of the alpha
                if image == 300:
                    out.append(tuple(x_train[image][row][col]))

    image_out = Image.new('RGBA', (50,50))
    image_out.putdata(out)
    image_out.save('plots/test_out_2.png')

    return x_train
