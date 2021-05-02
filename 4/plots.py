"""=============================================================================================================================
    plots.py
    Author: Michael Carter
    Date Created: 04-29-21
    Date Modified: 04-30-21
    This file contains functions for plotting our ML model results
============================================================================================================================="""

import numpy as np
import matplotlib.pylab as plt


def plot_MLP_hyperparameters(parameters, phase):

    if  phase == 0:
        param = 'solver'
    elif phase == 1:
        param = 'alpha'
    elif phase == 2 or phase == 3:
        param = 'hidden_layer_sizes'

    param_vals = []; accuracies = []; times = []

    print(parameters)

    for config in parameters[phase]:
        if phase < 2:
            param_vals.append(config.get(param))
        elif phase == 2:
            param_vals.append(config.get(param)[0])
        elif phase == 3:
            param_vals.append(config.get(param)[1])
        accuracies.append(config.get('avg_accuracy'))
        times.append(config.get('avg_time'))

    if phase == 0:
        fig, ax = plt.subplots() # create a plot
        width = -1             # stores width of a bar for formatting
        for i in range(len(param_vals)):
            width += 1 # add 1 to width for bar spacing
            ax.bar(width, accuracies[i], 0.8, label=param_vals[i])
        ax.set_title('Average Accuracies of Solvers in Multi-Layered Perceptron') # set plot title
        ax.set_xticks(np.arange(len(accuracies)))                # set x ticks to number of models
        ax.set_xticklabels(['%.4f' % e for e in accuracies])    # set tick labels to bar heights
        ax.set_ylim(0, max(accuracies)*1.5)                    # set y limit to 1.5 * tallest bar
        ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
        ax.set_ylabel('average accuracy ([0-1])')            # set y label to metric name
        ax.set_xlabel('solver type')                        # set x label to model
        ax.legend(loc='best')                              # include legend in plot
        plt.savefig('plots/MLP-solver-accuracies.png')

        fig, ax = plt.subplots() # create a plot
        width = -1             # stores width of a bar for formatting
        for i in range(len(param_vals)):
            width += 1 # add 1 to width for bar spacing
            ax.bar(width, times[i], 0.8, label=param_vals[i])
        ax.set_title('Average Execution Time of Solvers in Multi-Layered Perceptron') # set plot title
        ax.set_xticks(np.arange(len(times)))                # set x ticks to number of models
        ax.set_xticklabels(['%.4f' % e for e in times])         # set tick labels to bar heights
        ax.set_ylim(0, max(times)*1.5)                         # set y limit to 1.5 * tallest bar
        ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
        ax.set_ylabel('average training time (seconds)')     # set y label to metric name
        ax.set_xlabel('solver type')                        # set x label to model
        ax.legend(loc='best')                              # include legend in plot
        plt.savefig('plots/MLP-solver-times.png')

    if phase == 1:
        fig, ax = plt.subplots() # create a plot
        ax.set_title('Average Accuracies of Alphas in Multi-Layered Perceptron') # set plot title
        ax.plot(param_vals, accuracies, color="red", lw=2) # plot data points
        ax.set_ylabel('average accuracy ([0-1])')         # set y label to metric name
        ax.set_xlabel('alpha value')                     # set x label to model
        ax.set_xscale('log')
        plt.savefig('plots/MLP-alpha-accuracies.png')

        fig, ax = plt.subplots() # create a plot
        ax.set_title('Average Execution Time of Alphas in Multi-Layered Perceptron') # set plot title
        ax.plot(param_vals, times, color="blue", lw=2)    # plot data points
        ax.set_ylabel('average training time (seconds)') # set y label to metric name
        ax.set_xlabel('alpha value')                    # set x label to model
        ax.set_xscale('log')
        plt.savefig('plots/MLP-alpha-times.png')

    if phase == 2:
        fig, ax = plt.subplots() # create a plot
        ax.set_title('Average Accuracies of Hidden-Layer X in Multi-Layered Perceptron') # set plot title
        ax.plot(param_vals, accuracies, color="red", lw=2) # plot data points
        ax.set_ylabel('average accuracy ([0-1])')         # set y label to metric name
        ax.set_xlabel('hidden-layer x shape')            # set x label to model
        plt.savefig('plots/MLP-hlx-accuracies.png')

        fig, ax = plt.subplots() # create a plot
        ax.set_title('Average Execution Time of Hidden-Layer X in Multi-Layered Perceptron') # set plot title
        ax.plot(param_vals, times, color="blue", lw=2)    # plot data points
        ax.set_ylabel('average training time (seconds)') # set y label to metric name
        ax.set_xlabel('hidden-layer x shape')           # set x label to model
        plt.savefig('plots/MLP-hlx-times.png')

    if phase == 3:
        fig, ax = plt.subplots() # create a plot
        ax.set_title('Average Accuracies of Hidden-Layer Y in Multi-Layered Perceptron') # set plot title
        ax.plot(param_vals, accuracies, color="red", lw=2)      # plot data points
        ax.set_ylabel('average accuracy ([0-1])')            # set y label to metric name
        ax.set_xlabel('hidden-layer y shape')                        # set x label to model
        plt.savefig('plots/MLP-hly-accuracies.png')

        fig, ax = plt.subplots() # create a plot
        ax.set_title('Average Execution Time of Hidden-Layer Y in Multi-Layered Perceptron') # set plot title
        ax.plot(param_vals, times, color="blue", lw=2)           # plot data points
        ax.set_ylabel('average training time (seconds)')     # set y label to metric name
        ax.set_xlabel('hidden-layer y shape')                        # set x label to model
        plt.savefig('plots/MLP-hly-times.png')



def plot_CNN_hyperparameters(parameters, phase):

    if  phase == 0:
        param = 'loss'
    elif phase == 1:
        param = 'optimizer'

    param_vals = []; accuracies = []; times = []

    for config in parameters[phase]:
        param_vals.append(config.get(param))
        accuracies.append(config.get('avg_accuracy'))
        times.append(config.get('avg_time'))

    if phase == 0:
        fig, ax = plt.subplots() # create a plot
        width = -1             # stores width of a bar for formatting
        for i in range(len(param_vals)):
            width += 1 # add 1 to width for bar spacing
            ax.bar(width, accuracies[i], 0.8, label=param_vals[i])
        ax.set_title('Average Accuracies of Loss Functions in Basic CNN') # set plot title
        ax.set_xticks(np.arange(len(accuracies)))                # set x ticks to number of models
        ax.set_xticklabels(['%.4f' % e for e in accuracies])    # set tick labels to bar heights
        ax.set_ylim(0, max(accuracies)*1.5)                    # set y limit to 1.5 * tallest bar
        ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
        ax.set_ylabel('average accuracy ([0-1])')            # set y label to metric name
        ax.set_xlabel('loss function')                        # set x label to model
        ax.legend(loc='best')                              # include legend in plot
        plt.savefig('plots/CNN-loss-accuracies.png')

        fig, ax = plt.subplots() # create a plot
        width = -1             # stores width of a bar for formatting
        for i in range(len(param_vals)):
            width += 1 # add 1 to width for bar spacing
            ax.bar(width, times[i], 0.8, label=param_vals[i])
        ax.set_title('Average Execution Time of Loss Functions in Basic CNN') # set plot title
        ax.set_xticks(np.arange(len(times)))                # set x ticks to number of models
        ax.set_xticklabels(['%.4f' % e for e in times])         # set tick labels to bar heights
        ax.set_ylim(0, max(times)*1.5)                         # set y limit to 1.5 * tallest bar
        ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
        ax.set_ylabel('average training time (seconds)')     # set y label to metric name
        ax.set_xlabel('loss function')                        # set x label to model
        ax.legend(loc='best')                              # include legend in plot
        plt.savefig('plots/CNN-loss-times.png')

    if phase == 1:
        fig, ax = plt.subplots() # create a plot
        width = -1             # stores width of a bar for formatting
        for i in range(len(param_vals)):
            width += 1 # add 1 to width for bar spacing
            ax.bar(width, accuracies[i], 0.8, label=param_vals[i])
        ax.set_title('Average Accuracies of Optimizers in Basic CNN') # set plot title
        ax.set_xticks(np.arange(len(accuracies)))                # set x ticks to number of models
        ax.set_xticklabels(['%.4f' % e for e in accuracies])    # set tick labels to bar heights
        ax.set_ylim(0, max(accuracies)*1.5)                    # set y limit to 1.5 * tallest bar
        ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
        ax.set_ylabel('average accuracy ([0-1])')            # set y label to metric name
        ax.set_xlabel('optimizer type')                     # set x label to model
        ax.legend(loc='best')                              # include legend in plot
        plt.savefig('plots/CNN-optimizer-accuracies.png')

        fig, ax = plt.subplots() # create a plot
        width = -1             # stores width of a bar for formatting
        for i in range(len(param_vals)):
            width += 1 # add 1 to width for bar spacing
            ax.bar(width, times[i], 0.8, label=param_vals[i])
        ax.set_title('Average Execution Time of Optimizers in Basic CNN') # set plot title
        ax.set_xticks(np.arange(len(times)))                # set x ticks to number of models
        ax.set_xticklabels(['%.4f' % e for e in times])         # set tick labels to bar heights
        ax.set_ylim(0, max(times)*1.5)                         # set y limit to 1.5 * tallest bar
        ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
        ax.set_ylabel('average training time (seconds)')     # set y label to metric name
        ax.set_xlabel('optimizer type')                     # set x label to model
        ax.legend(loc='best')                              # include legend in plot
        plt.savefig('plots/CNN-optimizer-times.png')



def plot_CNN_layers(parameters):

    nns = [0, 1, 2, 3, 4]
    layers = ["1 Convolution", "2 Convolutions", "Convolution & MaxPooling", "Convolution & Dropout", "All of the above"]

    accuracies = []; times = []

    for nn in parameters:
        accuracies.append(nn.get('avg_accuracy'))
        times.append(nn.get('avg_time'))

    fig, ax = plt.subplots() # create a plot
    width = -1             # stores width of a bar for formatting
    for i in range(len(layers)):
        width += 1 # add 1 to width for bar spacing
        ax.bar(width, accuracies[i], 0.8, label=layers[i])
    ax.set_title('Average Accuracy of CNN Layer Configurations') # set plot title
    ax.set_xticks(np.arange(len(accuracies)))                # set x ticks to number of models
    ax.set_xticklabels(['%.4f' % e for e in accuracies])    # set tick labels to bar heights
    ax.set_ylim(0, max(accuracies)*1.5)                    # set y limit to 1.5 * tallest bar
    ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
    ax.set_ylabel('average accuracy ([0-1])')            # set y label to metric name
    ax.set_xlabel('layer configuration')                # set x label to model
    ax.legend(loc='best')                              # include legend in plot
    plt.savefig('plots/CNN-layers-accuracies.png')

    fig, ax = plt.subplots() # create a plot
    width = -1             # stores width of a bar for formatting
    for i in range(len(layers)):
        width += 1 # add 1 to width for bar spacing
        ax.bar(width, times[i], 0.8, label=layers[i])
    ax.set_title('Average Execution Time of CNN Layer Configurations') # set plot title
    ax.set_xticks(np.arange(len(times)))                # set x ticks to number of models
    ax.set_xticklabels(['%.4f' % e for e in times])         # set tick labels to bar heights
    ax.set_ylim(0, max(times)*1.5)                         # set y limit to 1.5 * tallest bar
    ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
    ax.set_ylabel('average training time (seconds)')     # set y label to metric name
    ax.set_xlabel('layer configuration')                # set x label to model
    ax.legend(loc='best')                              # include legend in plot
    plt.savefig('plots/CNN-layers-times.png')

def plot_model_against_model(mlp_results, cnn_results):

    accuracies = [mlp_results.get('avg_accuracy'), cnn_results.get('avg_accuracy')]
    times = [mlp_results.get('avg_time'), cnn_results.get('avg_time')]

    fig, ax = plt.subplots() # create a plot
    ax.bar(0, accuracies[0], 0.8, label="MLP")
    ax.bar(1, accuracies[1], 0.8, label="CNN")

    ax.set_title('Accuracies of best MLP vs. best CNN ') # set plot title
    ax.set_xticks(np.arange(len(accuracies)))                # set x ticks to number of models
    ax.set_xticklabels(['%.4f' % e for e in accuracies])    # set tick labels to bar heights
    ax.set_ylim(0, max(accuracies)*1.5)                    # set y limit to 1.5 * tallest bar
    ax.set_xlim(-1, 2)                         # set x limits to low-1 to hi+1
    ax.set_ylabel('average accuracy ([0-1])')       # set y label to metric name
    ax.set_xlabel('model type')                    # set x label to model
    ax.legend(loc='best')                         # include legend in plot
    plt.savefig('plots/MLP-vs-CLP-acc.png')

    fig, ax = plt.subplots() # create a plot
    ax.bar(0, times[0], 0.8, label="MLP")
    ax.bar(1, times[1], 0.8, label="CNN")

    ax.set_title('Training Times of best MLP vs. best CNN ') # set plot title
    ax.set_xticks(np.arange(len(times)))                # set x ticks to number of models
    ax.set_xticklabels(['%.4f' % e for e in times])         # set tick labels to bar heights
    ax.set_ylim(0, max(times)*1.5)                         # set y limit to 1.5 * tallest bar
    ax.set_xlim(-1, 2)                              # set x limits to low-1 to hi+1
    ax.set_ylabel('average training time (seconds)')     # set y label to metric name
    ax.set_xlabel('model type')                # set x label to model
    ax.legend(loc='best')                              # include legend in plot
    plt.savefig('plots/MLP-vs-CLP-times.png')


def print_prediction_names(mlp_predictions, cnn_predictions, filepaths):

    for file in range(len(filepaths)):

        mlp_class = "No class predicted."
        cnn_class = "No class predicted."

        for clss in range(len(mlp_predictions)):
            if mlp_predictions[clss][file] != 0:
                mlp_pred = clss
                break
            else:
                mlp_pred = -1

        cnn_pred = cnn_predictions[file]

        f = open('coa_training_data.csv', 'r') # open data file for reading
        xyPairs = f.readlines() # read lines into a list

        for xy in xyPairs:
            if (int(xy.split(',')[1].strip('\n')) == mlp_pred):
                mlp_class = xy.split('=')[0]

            if (int(xy.split(',')[1].strip('\n')) == cnn_pred):
                cnn_class = xy.split('=')[0]
        f.close()

        print("\n Image: ",     filepaths[file].split('/')[1])
        print("     MLP Prediction:", mlp_class)
        print("     CNN Prediction:", cnn_class)
