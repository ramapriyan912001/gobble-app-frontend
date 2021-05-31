import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Image } from 'react-native';
import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Welcome from './src/screens/Welcome';
import FinalStep from './src/screens/FinalStep';
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import ForgotPassword from './src/screens/ForgotPassword'
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
  FinalStep: {
    screen: FinalStep
  },
  Welcome:{
    screen: Welcome
  },
  ForgotPassword: {
    screen: ForgotPassword
  },
}, {
  initialRouteName: "LoginConfirmation",
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
