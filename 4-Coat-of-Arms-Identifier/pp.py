# This script will be used to pre-process the coat of arms images to be used for training.
#
#  coa_giovanni_de_medici_pope_leone_x, https://www.papalartifacts.com/the-medici-popes-the-papal-artifacts-collection/
from os import listdir
from os.path import isfile, join

img_folder = "coat-of-arms_images"
filenames = [f for f in listdir(img_folder) if isfile(join(img_folder, f))]

f = open("img_src.txt", "a")
for fn in filenames:
    f.write(fn)
    f.write("\n")
f.close()
