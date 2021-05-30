import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './src/screens/Login';
import Register from './src/screens/Register'
import step1 from './src/screens/step1'
import step2 from './src/screens/step2'
import finalstep from './src/screens/finalstep'
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import { Header } from 'react-native/Libraries/NewAppScreen';

export default function App() {
  console.log('App Executed');
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
  },
  step1: {
    screen: step1
  },
  step2: {
    screen: step2
  },
  finalstep: {
    screen: finalstep
  },
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
