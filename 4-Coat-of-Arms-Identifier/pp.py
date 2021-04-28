# This script will be used to pre-process the coat of arms images to be used for training.
#
#  coa_giovanni_de_medici_pope_leone_x, https://www.papalartifacts.com/the-medici-popes-the-papal-artifacts-collection/
import os
from os import listdir
from os.path import isfile, join
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

""" ============================================================================================================================
    given a filename name.ext, returns 'name', '.ext'
"""
def split_filename(filename):
    name, ext = os.path.splitext(filename)
    print(name, ext)
    return name, ext

""" ============================================================================================================================
    create a new image with 'factor' contrast named 'filenamesuffix.ext'
"""
def create_new_contrast(filename, factor, suffix):
    im = Image.open(filename)            # open image
    enhancer = ImageEnhance.Contrast(im) # get image enhancer # https://stackoverflow.com/questions/33831572/get-image-mode-pil-python
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

""" For each of the source images (now 1 per COA), create 3 copies with different levels of contrast """
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))]
for fn in filenames:
    create_new_contrast(img_folder+'/'+fn, 0.4, "-ct") # filename-ct.png: ct = contrast tiny
    create_new_contrast(img_folder+'/'+fn, 0.7, "-cl") # filename-cl.png: cl = contrast low
    create_new_contrast(img_folder+'/'+fn, 1.3, "-ch") # filename-ch.png: ch = contrast high

""" For each of the source images (now 4 per COA), create 2 copies with different levels of contrast """
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))] # update filenames list
for fn in filenames:
    create_new_blur(img_folder+'/'+fn, '-b') # filename-cl-b.png: b = blurred

""" For each of the source images (now 8 per COA), create 2  copies with different levels of contrast """
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))] # update filenames list
for fn in filenames:
    create_new_exposure(img_folder+'/'+fn, 0.4, '-et') # filename-cl-bb-et.png: et = exposure tiny
    create_new_exposure(img_folder+'/'+fn, 0.7, '-el') # filename-cl-bb-el.png: el = exposure low
    create_new_exposure(img_folder+'/'+fn, 1.3, '-eh') # filename-cl-bb-eh.png: eh = exposure high

""" Now there should be 32 images per COA for 34*32 = 1088 total images """
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))] # update filenames list
c = 0
for fn in filenames: # print all filenames
    c+=1
    print(c, fn, "\n") #
