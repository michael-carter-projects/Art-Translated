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

    if  phase == 1:
        param = 'solver'
    elif phase == 2:
        param = 'alpha'
    elif phase == 3:
        param = 'hidden_layer_sizes'

    param_vals = []; accuracies = []; times = []

    for config in parameters[phase]:
        param_vals.append(config.get(param))
        accuracies.append(config.get('avg_accuracy'))
        times.append(config.get('avg_time'))

    if phase == 1:
        fig, ax = plt.subplots() # create a plot
        width = -1             # stores width of a bar for formatting
        for i in range(len(param_vals)):
            width += 1 # add 1 to width for bar spacing
            ax.bar(width, accuracies[i], 0.8, label=param_vals[i])
        ax.set_title('Average '+param+' Accuracies in Multi-Layered Perceptron') # set plot title
        ax.set_xticks(np.arange(len(accuracies)))                # set x ticks to number of models
        ax.set_xticklabels(['%.4f' % e for e in accuracies])    # set tick labels to bar heights
        ax.set_ylim(0, max(accuracies)*1.5)                    # set y limit to 1.5 * tallest bar
        ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
        ax.set_ylabel('accuracy')                            # set y label to metric name
        ax.set_xlabel(param)                                # set x label to model
        ax.legend(loc='best')                              # include legend in plot
        plt.savefig('plots/'+'MLP-'+param+'-accuracies.png')

        fig, ax = plt.subplots() # create a plot
        width = -1             # stores width of a bar for formatting
        for i in range(len(param_vals)):
            width += 1 # add 1 to width for bar spacing
            ax.bar(width, times[i], 0.8, label=param_vals[i])
        ax.set_title('Average '+param+' Elapsed Time in Multi-Layered Perceptron') # set plot title
        ax.set_xticks(np.arange(len(accuracies)))                # set x ticks to number of models
        ax.set_xticklabels(['%.4f' % e for e in times])         # set tick labels to bar heights
        ax.set_ylim(0, max(times)*1.5)                         # set y limit to 1.5 * tallest bar
        ax.set_xlim(-1, width+1)                              # set x limits to low-1 to hi+1
        ax.set_ylabel('elapsed time (seconds)')              # set y label to metric name
        ax.set_xlabel(param)                                # set x label to model
        ax.legend(loc='best')                              # include legend in plot
        plt.savefig('plots/'+'MLP-'+param+'-times.png')

def plot_CNN_hyperparameters():

    print("no")


def plot_model_against_model():

    print("no")


def plot_in_the_wild_results():

    print("no")
