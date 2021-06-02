# Author: Michael Carter
# 20-12-15

import os
import pathlib
import urllib.request
import urllib.parse

# list of movements, (wikiart URL conventions)
art_movements = ["academicism",
                "art-deco",
                "art-nouveau-modern",
                "baroque",
                "cubism",
                "dada",
                "early-renaissance",
                "expressionism",
                "fauvism",
                "gothic",
                "high-renaissance",
                "impressionism",
                "mannerism-late-renaissance",
                "neoclassicism",
                "northern-renaissance",
                "post-impressionism",
                "realism",
                "rococo",
                "romanesque",
                "romanticism",
                "surrealism",
                "symbolism"]
# not included: art establishment,
#               egyptian,
#               ferrara school,
#               florentine,
#               greek art,
#               history painting,
#               hudson river,
#               nabis,
#               pre-raphaelite,
#               roman,
#               victorian classicism,
#               venetian

"""
given a singular art movement, accesses WikiArt via URI request, and returns a
list of response strings, each containing up to 60 dictionaries, each represent-
ing a single painting in that movement

e.g. there are 475 images under "Dada" on WikiArt
get_resp_strings("dada") will return 8 responses, each with 60 painting dicts
except for the last, which will only contain 55. (7*60 + 55 = 475)
"""
def get_response_strings(movement):

    # will store the strings returned by URI request
    response_strings = []

    # print a thousand pages max (3600 images is max )
    for page in range(1, 61):

        # create the url required for the URI request
        url = "https://www.wikiart.org/en/paintings-by-style/" + movement + "/" + str(page) + "?json=1"

        print("Accessing", movement, "page", page, end = "\r")

        req = urllib.request.Request(url)              # request info for
        with urllib.request.urlopen(req) as response: # a single page of
           response_bytes = response.read()          # a certain movement

        response_string = response_bytes.decode("utf-8") # convert bytes data to string

        if (response_string != "[]"):                                # if the response string contains
            response_strings.append(response_bytes.decode("utf-8")) # painting dicts, append to list
        else:                                                      # otherwise, no more paintings,
            break                                                 # break out of the loop

    return response_strings


"""
given response strings representing painting dictionaries, as outlined above
return a list of strings, 1 for each painting dictionary.

e.g. given the 8 response strings returned by the function above, this function
will return a list of 475 strings: {title: ... width : ... url : ...} etc.
"""
def get_painting_list(response_strings):

    painting_no = 0      # keeps track of the painting being written
    painting_list = [""] # stores list of painting dictionaries

    response_string = ""                               # take the list of response
    for resp in response_strings:                     # strings passed as a parameter
        last = len(resp)-1                           # and concatenate them into a
        if (resp!= "[]"):                           # single string for parsing, then
            response_string += ", " + resp[1:last] # remove the outer brackets

    # loop through ever letter in the string representing all responses
    for l in range(len(response_string)):

        if (l <= len(response_string)-4):    # if we are more than 4 indices from the
            sep4 = response_string[l:l+4]   # end of the string, create temporary
            sep3 = response_string[l:l+3]  # "separation" variables to determine if
            sep2 = response_string[l:l+2] # the loop is currently between dictionaries

            if (sep4 == '}, {'):                   # if we encounter this, we are done
                painting_list[painting_no] += '}' # writing one painting dict into the
                painting_no += 1                 # list, so we end the line, add 1 to the
                painting_list.append("")        # count, and add a new empty line to list

            elif (sep3 == ', {' or sep2 == ' {'): # if we just finished writing a painting dict
                painting_list[painting_no] += "" # do nothing for the next 2 characters
            else:
                painting_list[painting_no] += response_string[l] # these lines write the actual
        else:                                                   # painting info into the list of
            painting_list[painting_no] += response_string[l]   # painting dictionaries

    return painting_list

"""
given a list of painting information represented as strings (formatted as dicts)
returns a list of tuples storing the title and url of each image.

e.g. given the 475 strings returned by the function above, returns 475 tuples:
("Bicycle Wheel, 1913", "https://uploads4.wikiart.org/images/marcel...")
"""
def get_painting_titles_and_urls(painting_list):

    title_url_lists = [] # will store painting titles and urls

    # loop through the entire list of paintings to create list of 'tuples'
    for painting in painting_list:

        title_first = 0 # used to store
        title_last = 0 # the indices of
        url_first = 0 # the paintings'
        url_last = 0 # titles and urls

        # find the first index of the painting title
        for l in range(len(painting)):
            sep1 = painting[l:l+10]
            if (sep1 == "title\" : \""):
                title_first = l+10
                break
        # find the last index of the painting title
        for l in range(title_first, len(painting)):
            sep2 = painting[l:l+2]
            if (sep2 == "\","):
                title_last = l
                break

        # find the first index of the image url
        for l in range(len(painting)):
            sep1 = painting[l:l+10]
            if (sep1 == "image\" : \""):
                url_first = l+10
                break

        # url_endings = ["!Large.jpg",  "!Large.JPG", "!Large.png", "!Large.PNG",
        #               "!Large.jpeg", "!Large.JPEG"]

        # find the last index of the image url
        for l in range(url_first, len(painting)):
            sep2 = painting[l:l+7]
            if (sep2 == "!Large."):
                url_last = l
                break
        # select title and url and append to list as 2 length list
        title = painting[title_first:title_last]
        url = painting[url_first:url_last]
        title_url_lists.append([title, url])


    duplicates = [] # used to store tuples that share a name with another
    dup_num = 0     # keeps track of which duplicate is being recorded
    # loop through the entire list of titles and urls
    for i in range(1, len(title_url_lists)):
        if (title_url_lists[i][0] ==  title_url_lists[i-1][0]): # check for dupes
            if (dup_num == 0):                                     # make sure to add "first"
                duplicates.append([title_url_lists[i-1][0], i-1]) # dupe to duplicates list
            duplicates.append([title_url_lists[i][0], i]) # add every other duplicate
            dup_num += 1  # used to ensure that
        else:            # the first duplicate
            dup_num = 0 # is included in the list

    inc = 1 #
    # loop through all duplicates
    for i in range(1, len(duplicates)):
        if (duplicates[i][0] == duplicates[i-1][0]): # group duplicates together
            url_index = duplicates[i][1]                                 # add the number
            first28 = title_url_lists[url_index][0][:28]                # of the duplicate to
            title_url_lists[url_index][0] = first28 + '['+str(inc)+']' # the end of the title
            inc += 1  # used to increment
        else:        # the number being
            inc = 1 # appended to the title

    return title_url_lists

"""
given a painting title and image url, extracts the filetype from the url,
replaces problem characters and punctuation with filename-friendly characters,
limits the name length to 31, and appends a filetype to the end of the title

e.g. "Somebody, does :\(something)"  ==>  "Somebody_does_something.jpg"
"""
def format_name(title, url):

    filename = "" # stores tentative filename
    filetype = "" # stores tentative filetype
    if   (url[len(url)-4] == '.'):
        filetype = url[len(url)-3:] # stores file extension (jpg)
    elif (url[len(url)-5] == '.'):
        filetype = url[len(url)-4:] # stores file extension (jpeg)

    c = 0 # counts the number of characters in the filename
    # loop through every letter in the title
    for l in title:
        if c > 31: # limit number of letters in a filename to 31
            break

        # list of characters to be removed from a filename
        badchars = ['\\', ':', '*', '?', '\"', '<', '>', '|', '.',
                    '\'', ';', ',', '(', ')',  '{', '}']

        if (l == " "):       # swap spaces
            filename += '_' # with underscores
        elif (l == '/'):     # swap slashes
            filename += '-' # with hyphens
        elif l in badchars:  # remove problematic
            filename += ''  # characters
        else:                # keep
            filename += l   # everything else
        c += 1

    # add file extension and return
    return filename + '.' + filetype

"""
prints a progress bar to be used for every iteration of a long loop
"""
def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = "\r"):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
        printEnd    - Optional  : end character (e.g. "\r", "\r\n") (Str)
    """
    #percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    fraction = str(iteration) + '/' + str(total)
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r{prefix} |{bar}| {fraction} {suffix}', end = printEnd)

"""
given a list of title/url tuples representing all paintings in a movement,
downloads each image, naming it by its title
"""
def download_movement(movement, titles_and_urls):

    # tell the user what's going on
    print("Downloading WikiArt images from:", movement)

    # print the initial progress bar
    c = 0
    l = len(titles_and_urls)
    printProgressBar(c, l, prefix = 'Progress:', suffix = 'images downloaded', length = 50)

    # download and name each file in the movement
    for tup in titles_and_urls:

        # check to make sure that tuple is valid
        if (tup[0] != "" and tup[1] != ""):

            # format the title so it can be used as a filename
            filename = format_name(tup[0], tup[1])

            # the filepath of a folder that has the name of the currenct movement
            newpath = os.path.join('X:/art_translate_images', movement)

            # create a new filepath if the movement folder doesn't exist
            if not os.path.exists(newpath):
                os.makedirs(newpath)

            #encodes accents in ascii - allows urllib to read non-ascii symbols as ascii
            url = "https://" + urllib.parse.quote(tup[1][8:])

            # the full filepath of a downloaded image
            fullpath = os.path.join(newpath, filename)

            if not os.path.exists(fullpath):                # if the image hasn't already been
                urllib.request.urlretrieve(url, fullpath)  # downloaded, download it
                #print(c, '-', fullpath)                  # print for debugging purposes

            # update the progress bar
            printProgressBar(c + 1, l, prefix = 'Progress:', suffix = 'images downloaded', length = 50)
            c += 1
    print()
    return

"""
given a list of art movements, uses the download_movement function to download
all images from every movement in the list
"""
def download_all_images(art_movements):

    # download all images from each art movement
    for movement in art_movements:

        # get each ~60 painting API response as a string
        response_strings = get_response_strings(movement)

        # convert response strings to a list of painting info strings
        painting_list = get_painting_list(response_strings)

        # retreive title/url tuples from painting lists
        titles_and_urls = get_painting_titles_and_urls(painting_list)

        # download images to computer
        download_movement(movement, titles_and_urls)

    print("============================================================================================")
    print("All done!") # completion message
    print("============================================================================================")

# art_movements_t = ["art-nouveau-modern"] # fix duplicate issue and tricky urls DONE!

""" download images from all art movements available on wikiart """
download_all_images(art_movements)
