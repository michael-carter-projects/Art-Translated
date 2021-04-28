"""
 coa-multiplier.py
 Author: Michael Carter
 Date Created: 04-10-2021
 Last Modified: 04-28-2021
 This script will be used to pre-process the coat of arms images to be used for training.
"""
import os
from os import listdir
from os.path import isfile, join
from PIL import Image, ImageEnhance, ImageFilter

prog = 0 # stores script progress for printing progress bar
l = 1054 # stores number of files to be created for printing progress bar

""" ============================================================================================================================
    Command line progress bar graciously provided by StackOverflow user "Greenstick"
    https://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console
"""
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = "\r"):
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
def split_filename(filename):
    printProgressBar(prog + 1, l, prefix = 'Creating new dataset:', suffix = 'Complete') # update progress bar
    name, ext = os.path.splitext(filename) # split filename
    return name, ext # return both

""" ============================================================================================================================
    create a new image with 'factor' contrast named 'filenamesuffix.ext'
"""
def create_new_contrast(filename, factor, suffix):
    im = Image.open(filename)            # open image
    enhancer = ImageEnhance.Contrast(im) # get image enhancer
    im_output = enhancer.enhance(factor) # increase contrast
    name, ext = split_filename(filename) # separate filename and extension
    im_output.save(name+suffix+ext)      # save image with suffix appended to name

""" ============================================================================================================================
    create a new blurred image named 'filenamesuffix.ext'
"""
def create_new_blur(filename, suffix):
    im = Image.open(filename)               # open image
    im_output = im.filter(ImageFilter.BLUR) # blur the image
    name, ext = split_filename(filename)    # separate filename and extension
    im_output.save(name+suffix+ext)         # save image with suffix appended to name

""" ============================================================================================================================
    create a new image with 'factor' exposure named 'filenamesuffix.ext'
"""
def create_new_exposure(filename, factor, suffix):
    im = Image.open(filename)              # open image
    enhancer = ImageEnhance.Brightness(im) # get image enhancer
    im_output = enhancer.enhance(factor)   # increase brightness
    name, ext = split_filename(filename)   # separate filename and extension
    im_output.save(name+suffix+ext)        # save image with suffix appended to name


"""=============================================================================================================================
    MAIN
============================================================================================================================="""

img_folder = "coat-of-arms_images" # the name of the image source folder

printProgressBar(0, l, prefix = 'Creating new dataset:', suffix = 'Complete', length = 100) # print initial progress bar

""" For each of the source images (now 1 per COA), create 3 copies with different levels of contrast ------------------------"""
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))]
for fn in filenames:
    create_new_contrast(img_folder+'/'+fn, 0.2, "-ct") # filename-ct.png: ct = contrast tiny
    prog += 1
    create_new_contrast(img_folder+'/'+fn, 0.4, "-cl") # filename-cl.png: cl = contrast low
    prog += 1
    create_new_contrast(img_folder+'/'+fn, 1.5, "-ch") # filename-ch.png: ch = contrast high
    prog += 1

""" For each of the source images (now 4 per COA), create a copy that is blurry ---------------------------------------------"""
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))] # update filenames list
for fn in filenames:
    create_new_blur(img_folder+'/'+fn, '-b') # filename-cl-b.png: b = blurred
    prog += 1

""" For each of the source images (now 8 per COA), create 3  copies with different levels of exposure -----------------------"""
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))] # update filenames list
for fn in filenames:
    create_new_exposure(img_folder+'/'+fn, 0.2, '-et') # filename-cl-bb-et.png: et = exposure tiny
    prog += 1
    create_new_exposure(img_folder+'/'+fn, 0.5, '-el') # filename-cl-bb-el.png: el = exposure low
    prog += 1
    create_new_exposure(img_folder+'/'+fn, 1.5, '-eh') # filename-cl-bb-eh.png: eh = exposure high
    prog += 1

""" Now there should be 32 images per COA for 34*32 = 1088 total images. Global var l = 1088-34 -----------------------------"""
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))] # update filenames list
print(l, "images created, for a total of", len(filenames)) # print complete message
