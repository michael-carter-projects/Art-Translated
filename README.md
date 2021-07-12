# Art-Translated Movement Classification
[Python] This repo contains various code I have written as I use Google AutoML Vision (see **2** and **3**) and React Native (see **5**) to make a cross-platform mobile app that can predict the art movement associated with a given image (from camera or gallery) and display information about said movement (all offline). The app may soon be incorporated into a larger app called "Art Translated" that is being developed by another team (also led by my boss).


**Repository Directory:**

**1:** Proof-of-Concept

    The purpose of this program is to show that a cloud-deployed Google AutoML model can be used to predict
    the art movement associated with a given image of a painting. The user is asked to choose a file from
    /test_images. The image selected (or all images) will be passed to an AutoML movement detection model,
    and the results will be returned as a string. The movement with the highest score is mapped to database
    entries which contain the name and brief description of the movement given.

    poc_main.py                     - the main file that runs the menu
    model_tests.py                  - script that tests every image in /test-images. called by main
    movements_results_w_image_v2.py - gets the movement data and displays the image analyzed (macOS)
    api_caller_t3.py                - script that passes image to AutoML model (t3 for short, NOT CURRENT)

**2:** WikiArt Image Scraping

    The purpose of this program is to collect images to use as training data in Google AutoML for the purposes
    outlined above. It does this by scraping images from WikiArt by movement. The images need to be sorted by
    movement, so the script also places them into appropriately named folders on the machine running it.
    Running this script once downloaded, sorted by movement, and named over 50,000 images. (As a bonus the
    script encodes the filenames in a way the Google Cloud likes. I say bonus but this was 100% necessary.)

    wikiart-script.py  - downloads, names, and sorts images
    wikiart-output.png - screenshot of console output

**3:** Write CSV for AutoML

    This program is used as a map between the dataset collected in Part 1 and Google AutoML. Given the file
    directory of the training images, this script creates the .csv file containing the training data (with a
    80:10:10 train:validation:test split) that AutoML needs to actually train a model.

    automl_script_symbols.py - the script that writes the .csv (symbols because the .csv only contains
                               training data for movements that contain symbols)
    automl_training_data.csv - the file that was used to train the latest AutoML model.

**4:** Coat of Arms Classification

    This is an investigation into image classification using 'hands-on' machine learning models made with
    Keras that I completed for my Machine Learning course. The object is to create a model that can classify
    images of a coat of arms using an initial dataset of digitally recreated coats of arms. I first turned 34
    images into 1088 images by running each of them through multiple permutations of filters using Python
    Pillow, including exposure/contrast adjustments and blur effects. Then I applied my own randomized color
    filter to each image as well as each pixel in each image in an effort to increase the variability in the
    data. Finally I used a Multi-Layer Perceptron and a few different Convolutional Neural Networks to deter-
    mine which performed the best over a random train/test split of my dataset and which performed the best
    when classifying real images of coat of arms. The conclusion of the project was that with artificially
    varied images, both MLPs and CNNs were able to produce astonishing accuracy when classifying images that
    were part of my dataset, but neither were able to make useful predictions given real photographs of coats
    of arms. The general lesson here is that a model's training data must reflect as much as possible that
    which the model ultimately aims to classify.

    coa_prediction           - testing images resized for prediction
    coa_prediction_base      - original images for testing
    coat-of-arms_images      - artificially varied set of 1088 coat of arms images
    coat-of-arms_images_base - original 34 digitally recreated coat of arms images
    models                   - contains the keras model of the best CNN
    plots                    - plots created with matplotlib for report
    cnn.py                   - python code pertaining to neural network training/testing
    coa_training_data.csv    - training data generated by script in dataset.py
    dataset.py               - python code pertaining to manipulation of the dataset
    main.py                  - python code which runs the entire experiment at once
    mlp.py                   - python code pertaining to multi-layered perceptron
    plots.py                 - python code pertaining to plotting data from training/testing
    progress_bar.py          - contains a nice command line progress bar from StackOverflow

**5:** React Native Movement Classification App

    This is a cross-platform app that uses a local Tensorflow model trained in Google AutoML to predict the
    art movement associated with an image provided by the user either through the camera roll or by
    taking a picture. Currently photos can be taken or selected from storage and the Tensorflow model
    will provide the user with the 3 most likely movements. The user may then select a movement and read
    the details about the movement which were provided originally by my boss as a spreadsheet. Movement data
    and model are stored locally so that cell service is not required for the app to function, and the
    prediction itself currently takes less than a second. (~15 sec for camera roll images due to expo Image-
    Manipulator compatibility. ***FIX***)

[YouTube link to a video demonstration](https://www.youtube.com/watch?v=zNAkUXwmYPs) as of 07/07/21

    amd/App.js                    - the file that handles navigation through the app (react-navigation)
    amd/components                - folder that contains the .js files responsible for each page of the app
    amd/components/Home.js        - renders the home screen (camera)
    amd/components/Review.js      - renders review screen (predict? or retake?) (may remove screen)
    amd/components/Predictions.js - renders prediction buttons (nav to details)
    amd/components/Details.js     - renders movement details
