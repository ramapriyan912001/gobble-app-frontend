import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './src/screens/Login';
import Register from './src/screens/Register'
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function App() {
  return (
    <AppContainer/>
  );
}

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login
  },
  Register: {
    screen: Register
  }
}, {
  initialRouteName: "Login",
  defaultNavigationOptions: {
    headerShown: false
  }
});

const AppContainer = createAppContainer(AppNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
