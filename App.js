import 'react-native-gesture-handler';
import React from 'react';
import {AppContainer} from './src/routes/routes'
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack'
import Login from './src/screens/Login';
import {Welcome} from './src/screens/Welcome';
import RegisterNavigator from './src/screens/Register/RegisterNavigator'
import FinalStep from './src/screens/FinalStep';
import ForgotPassword from './src/screens/ForgotPassword'
import BottomTabs from './src/components/BottomTabs';
import Reauthenticate from './src/screens/Reauthenticate';
import {store} from './src/redux/store';
import { Conversation } from './src/screens/Chats/Conversation';
import GobbleSelect from './src/screens/Gobble/GobbleSelect';

const Stack = createStackNavigator();

export default function App() {
  console.log('App Executed');
  return (
    <NavigationContainer>
      <Provider store={store}>
          <Stack.Navigator initialRouteName="Login"
          >
            <Stack.Screen name="Login" options={{headerShown: false}} component={Login}></Stack.Screen>
            <Stack.Screen name="RegisterNavigator" options={{headerShown: false}} component={RegisterNavigator}></Stack.Screen>
            <Stack.Screen name="BottomTabs" options={{headerShown: false}} component={BottomTabs}></Stack.Screen>
            <Stack.Screen name="FinalStep" options={{headerShown: false}} component={FinalStep}></Stack.Screen>
            <Stack.Screen name="ForgotPassword" options={{headerShown: false}} component={ForgotPassword}></Stack.Screen>
            <Stack.Screen name="Welcome" options={{headerShown: false}} component={Welcome}></Stack.Screen>
            <Stack.Screen name="Reauthenticate" options={{headerShown: false}} component={Reauthenticate}></Stack.Screen>
            <Stack.Screen name="Conversation" component={Conversation}></Stack.Screen>
            <Stack.Screen name="Edit Gobble Request" component={GobbleSelect}></Stack.Screen>
          </Stack.Navigator>
      </Provider> 
    </NavigationContainer>
  );
}

