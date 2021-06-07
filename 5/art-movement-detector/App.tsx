import {StatusBar} from 'expo-status-bar'
import React from 'react'
import {StyleSheet, Text, View} from 'react-native'

import HomeCamera   from './components/HomeCamera'
import PhotoPreview from './components/PhotoPreview'
import MovementInfo from './components/MovementInfo'
import History      from './components/History'

import { createAppContainer   } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const RootStack = createStackNavigator({
  HomeCamera:   { screen: HomeCamera   },
  PhotoPreview: { screen: PhotoPreview },
  MovementInfo: { screen: MovementInfo },
  History:      { screen: History      }
});

const App = createAppContainer(RootStack);

export default App;
