import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import HomeScreen from "./app/screens/HomeScreen";
import SettingsScreen from "./app/screens/SettingsScreen";

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      headerTitle: "JARVIS",
      headerStyle: {
        marginTop: 15,
        backgroundColor: "#2980B9",
        borderBottomWidth: 0,
        borderColor: "#2980B9",
      },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 28,
        letterSpacing: 8,
      },
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      headerTitle: "SETTINGS",
      headerStyle: {
        marginTop: 15,
        backgroundColor: "#2980B9",
        borderBottomWidth: 0,
        borderColor: "#2980B9",
      },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 4,
      },
    }
  }
});

export default createAppContainer(AppNavigator);
