import 'react-native-gesture-handler';
import React from 'react';
import {AppContainer} from './src/routes/routes'
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import store from './src/reducers/index'
import {createStackNavigator} from '@react-navigation/stack'
import Login from './src/screens/Login';
import {Welcome} from './src/screens/Welcome';
import RegisterNavigator from './src/screens/Register/RegisterNavigator'
import FinalStep from './src/screens/finalstep';
import ForgotPassword from './src/screens/ForgotPassword'
import BottomTabs from './src/components/BottomTabs';

// const store = configureStore();

const Stack = createStackNavigator();

export default function App() {
  console.log('App Executed');
  return (
    <NavigationContainer>
      <Provider store={store}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login}></Stack.Screen>
            <Stack.Screen name="RegisterNavigator" component={RegisterNavigator}></Stack.Screen>
            <Stack.Screen name="BottomTabs" component={BottomTabs}></Stack.Screen>
            <Stack.Screen name="FinalStep" component={FinalStep}></Stack.Screen>
            <Stack.Screen name="ForgotPassword" component={ForgotPassword}></Stack.Screen>
            <Stack.Screen name="Welcome" component={Welcome}></Stack.Screen>
          </Stack.Navigator>
      </Provider> 
    </NavigationContainer>
  );
}

