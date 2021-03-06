import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react';
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
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { useColorScheme } from 'react-native-appearance';
import themes from './src/styles/Themes';

LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified.']);
LogBox.ignoreLogs(['VirtualizedLists']);


export default function AppWrapper() {
  return (
    <Provider store={store}>
      <AppearanceProvider>
        <App />
      </AppearanceProvider>
    </Provider>
    
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
import { Platform } from 'react-native';

const Stack = createStackNavigator();

function App(props, {navigation}) {
  console.log('App Executed');
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';
  const listener = ({origin, data}) => {
    console.log(origin, data)
  }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
});
const [expoPushToken, setExpoPushToken] = useState('');
const [notification, setNotification] = useState(false);
const notificationListener = useRef();
const responseListener = useRef();
const navigationRef = useRef({});

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response)
      console.log(props)
      navigationRef?.current.navigate('Test')
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  })
  return (
    <NavigationContainer>
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
            <Stack.Screen name="Report" options={{
                    // headerLeft: () => null,
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Make a Report', 
                    headerBackTitle: 'Back', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
                }} component={MakeReport}></Stack.Screen>
            <Stack.Screen name="Edit Gobble Request" options={{
                    // headerLeft: () => null,
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Edit Gobble', 
                    headerBackTitle: 'Back', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
                }} component={GobbleSelect}></Stack.Screen>
            <Stack.Screen name="Edit Location" options={{headerShown: false}}  component={DestinationSearch}></Stack.Screen>
            <Stack.Screen name="Confirm Request" options={{headerShown: false}} component={GobbleSelect2}></Stack.Screen>
            <Stack.Screen name="Test" options={{headerShown: false, gestureEnabled: true}} component={Test}></Stack.Screen>
            <Stack.Screen name="User History" options={{
                    // headerLeft: () => null,
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Make a Report', 
                    headerBackTitle: 'Back', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
                }} component={ComplaintHistory}></Stack.Screen>
            <Stack.Screen name="Complaint Details" options={{gestureEnabled: true}} component={ReportDetails}></Stack.Screen>
            <Stack.Screen name="Restaurants" options={{
              headerShown:true,
              headerTitle: 'Restaurants!',
              headerBackTitle:'Back',
              headerStyle:{
                  backgroundColor: themes.oppositeTheme(!isLight),
              },
              headerTintColor:themes.oppositeTheme(isLight)
            }} component={Restaurants}></Stack.Screen>
          </Stack.Navigator>
    </NavigationContainer>
  );
}