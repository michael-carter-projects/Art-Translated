"""
 dataset.py
 Author: Michael Carter
 Date Created: 04-10-2021
 Last Modified: 04-28-2021
 This script is used to pre-process the coat of arms images to be used for training.
"""
import os
from shutil import copyfile
from os import listdir
from os.path import isfile, join
from PIL import Image, ImageEnhance, ImageFilter

p = 0 # progress counter for file multiplication
l = 1054 # number of images to be added to

""" ============================================================================================================================
    Command line progress bar graciously provided by StackOverflow user "Greenstick"
    https://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console
"""
def printProgressBar (iteration, total = l, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = "\r"):
    """ @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
        printEnd    - Optional  : end character (e.g. "\r", "\r\n") (Str) """

    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r{prefix} |{bar}| {percent}% {suffix}', end = printEnd)
    if iteration == total:
        print()

""" ============================================================================================================================
    given a filename name.ext, returns 'name', '.ext'
"""
def split_filename(filename, p):
    printProgressBar(p, prefix = 'Creating filtered images:  ', suffix = 'Complete') # update progress bar
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

    printProgressBar(0, l, prefix = 'Creating filtered images:  ', suffix = 'Complete', length = 100) # print initial progress bar

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
        printProgressBar(0, len(filenames), prefix = 'Deleting current dataset:  ', suffix = 'Complete') # print progress
        for i in range(len(filenames)):
            os.remove(join(image_dest, filenames[i]))
            printProgressBar(i+1, len(filenames), prefix = 'Deleting current dataset:  ', suffix = 'Complete') # print progress

     # copy all images from image_base to image_dest ----------------------------------------------------------------------------
    filenames_bu = [f for f in listdir(image_base) if isfile(join(image_base, f))]

    printProgressBar(0, len(filenames_bu), prefix = 'Copying original images:   ', suffix = 'Complete') # print progress
    for i in range(len(filenames_bu)):
        copyfile(join(image_base, filenames_bu[i]), join(image_dest, filenames_bu[i]))
        printProgressBar(i+1, len(filenames_bu), prefix = 'Copying original images:   ', suffix = 'Complete') # print progress


""" ============================================================================================================================
    resize every image to a new width of nw
"""
def resize_images(image_dest, nw):
    filenames = [f for f in listdir(image_dest) if isfile(join(image_dest, f))]
    printProgressBar(0, len(filenames), prefix = 'Resizing multiplied images:', suffix = 'Complete') # print progress

    for i in range(len(filenames)):
        im = Image.open(join(image_dest, filenames[i])) # open the image
        resized_im = im.resize((nw, round(im.size[1]/round(im.size[0]/nw)))) # resize every image to "nw" pixels wide
        resized_im.save(join(image_dest, filenames[i]))    # save the cropped image
        printProgressBar(i+1, len(filenames), prefix = 'Resizing multiplied images:', suffix = 'Complete') # print progress

""" ============================================================================================================================
    'classify' each image with a number representing it's class
"""
def write_filename_class_pairs(image_dest, dataset_fn):

    filenames = [f for f in listdir(image_dest) if isfile(join(image_dest, f))]
    curr_name = "" # name of current image excluding filter suffixes
    last_name = "" # name of previous image excluding filter suffixes
    y = 0          # value of class to be attributed to an image

    f = open(dataset_fn, "w+") # open file for writing

    for fn in filenames:
        curr_name = fn.split('=')[0]   # store current filename excluding filter suffixes
        if (curr_name != last_name):  # if we have entered a new class of images
            y += 1                   # iterate y value
        f.write(fn+','+str(y)+"\n") # write x, y pair to file
        last_name = curr_name      # update last-name to current-name
    f.close()                       #

""" ============================================================================================================================
    read the file containing the image data and convert it into numerical data for use with sklearn and keras
"""
def retreive_numerical_dataset_from_file(filename):

    print("no")
