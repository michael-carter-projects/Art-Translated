import React from 'react';

import Home        from './components/Home';
import Crop        from './components/Crop';
import Predictions from './components/Predictions';
import Movement    from './components/Movement'
import TreeInfo    from './components/TreeInfo';

import { createAppContainer   } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

const RootStack = createStackNavigator({
  Home:        { screen: Home        },
  Crop:        { screen: Crop        },
  Predictions: { screen: Predictions },
  Movement:    { screen: Movement    },
  TreeInfo:    { screen: TreeInfo    }},
  { initialRoute: Home }
);

const App = createAppContainer(RootStack);

export default App;
