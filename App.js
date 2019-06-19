import React from "react";
import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './app/screens/HomeScreen'
import SettingsScreen from './app/screens/SettingsScreen'

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: 'Jarvis'
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      headerTitle: 'Settings'
    }
  }
});

export default createAppContainer(AppNavigator);
