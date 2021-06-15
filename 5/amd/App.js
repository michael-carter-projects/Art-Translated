import {StatusBar} from 'expo-status-bar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import Home   from './components/Home';
import Review from './components/Review';
import Predictions from './components/Predictions';
import History     from './components/History';

import { createAppContainer   } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import './global.js';

const RootStack = createStackNavigator({
  Home:        { screen: Home        },
  Review:      { screen: Review      },
  Predictions: { screen: Predictions },
  Movement:    { screen: Movement    },
  History:     { screen: History     }},
  {
        initialRoute: Home
  }
);

const App = createAppContainer(RootStack);

export default App;
