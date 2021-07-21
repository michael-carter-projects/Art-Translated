import React from 'react';

import Home        from './components/Home';
import Predictions from './components/Predictions';
import Movement    from './components/Movement'
import TreeInfo    from './components/TreeInfo';

import { createAppContainer   } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import './global.js';

const RootStack = createStackNavigator({
  Home:        { screen: Home        },
  Predictions: { screen: Predictions },
  Movement:    { screen: Movement    },
  TreeInfo:    { screen: TreeInfo    }},
  { initialRoute: Home }
);

const App = createAppContainer(RootStack);

export default App;
