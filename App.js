import 'react-native-gesture-handler';
import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import {AppContainer} from './src/routes/routes'
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import {createStackNavigator} from '@react-navigation/stack'
import Login from './src/screens/Login';
import RegisterNavigator from './src/screens/Register/RegisterNavigator'
import FinalStep from './src/screens/FinalStep';
import ForgotPassword from './src/screens/ForgotPassword';
import Welcome from './src/screens/Welcome';
import BottomTabs from './src/components/BottomTabs';
import Reauthenticate from './src/screens/Reauthenticate';
import {store} from './src/redux/store';
import { Conversation } from './src/screens/Chats/Conversation';
import GobbleSelect from './src/screens/Gobble/GobbleSelect';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Setting a timer']);


export default function AppWrapper() {
  return (
    <AppearanceProvider>
      <App />
    </AppearanceProvider>
  );
}
import ProfileDrawer from './src/components/ProfileDrawer';
import Test from './src/components/Test';

const Stack = createStackNavigator();

export function App() {
  console.log('App Executed');
  return (
    <NavigationContainer>
      <Provider store={store}>
          <Stack.Navigator initialRouteName="Welcome" 
          >
            <Stack.Screen name="Welcome" options={{headerShown: false, gestureEnabled: false}} component={Welcome}></Stack.Screen>
            <Stack.Screen name="Login" options={{headerShown: false, gestureEnabled: false}} component={Login}></Stack.Screen>
            <Stack.Screen name="RegisterNavigator" options={{headerShown: false, gestureEnabled: false}} component={RegisterNavigator}></Stack.Screen>
            <Stack.Screen name="BottomTabs" options={{headerShown: false, gestureEnabled: false}} component={BottomTabs}></Stack.Screen>
            <Stack.Screen name="FinalStep" options={{headerShown: false, gestureEnabled: false}} component={FinalStep}></Stack.Screen>
            <Stack.Screen name="ForgotPassword" options={{headerShown: false, gestureEnabled: false}} component={ForgotPassword}></Stack.Screen>
            <Stack.Screen name="Reauthenticate" options={{headerShown: false, gestureEnabled: false}} component={Reauthenticate}></Stack.Screen>
            <Stack.Screen name="Conversation" component={Conversation}></Stack.Screen>
            <Stack.Screen name="Edit Gobble Request" component={GobbleSelect}></Stack.Screen>
            <Stack.Screen name="Test" options={{headerShown: false, gestureEnabled: true}} component={Test}></Stack.Screen>
          </Stack.Navigator>
      </Provider> 
    </NavigationContainer>
  );
}

