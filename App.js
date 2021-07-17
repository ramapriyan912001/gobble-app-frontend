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
import MakeReport from './src/screens/MakeReport';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);


export default function AppWrapper() {
  return (
    <AppearanceProvider>
      <App />
    </AppearanceProvider>
  );
}
import ProfileDrawer from './src/components/ProfileDrawer';
import Test from './src/components/Test';
import DestinationSearch from './src/components/DestinationSearch';
import SearchBox from './src/components/SearchBox';
import GobbleSelect2 from './src/screens/Gobble/GobbleSelect2';
import ComplaintHistory from './src/screens/ComplaintHistory';
import ReportDetails from './src/screens/ReportDetails';
import Restaurants from './src/components/Restaurants';

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
            <Stack.Screen name="Report" component={MakeReport}></Stack.Screen>
            <Stack.Screen name="Edit Gobble Request" component={GobbleSelect}></Stack.Screen>
            <Stack.Screen name="Edit Location" options={{headerShown: false}}  component={DestinationSearch}></Stack.Screen>
            <Stack.Screen name="Confirm Request" options={{headerShown: false}} component={GobbleSelect2}></Stack.Screen>
            <Stack.Screen name="Test" options={{headerShown: false, gestureEnabled: true}} component={Test}></Stack.Screen>
            <Stack.Screen name="User History" options={{gestureEnabled: true, headerBackTitle: 'Back'}} component={ComplaintHistory}></Stack.Screen>
            <Stack.Screen name="Complaint Details" options={{gestureEnabled: true}} component={ReportDetails}></Stack.Screen>
            <Stack.Screen name="Restaurants" options={{headerBackTitle: 'Matches',gestureEnabled: true}} component={Restaurants}></Stack.Screen>
          </Stack.Navigator>
      </Provider> 
    </NavigationContainer>
  );
}