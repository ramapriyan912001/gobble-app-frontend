import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {ProfileNavigator} from '../screens/Profile/ProfileNavigator'
import {GobbleNavigator} from '../screens/Gobble/GobbleNavigator'
import Awaiting from '../screens/Matches/Awaiting'
import { ChatNavigator } from '../screens/Chats/ChatNavigator';
import Ionicons from '@expo/vector-icons/Ionicons'
import MatchesNavigator from '../screens/Matches/MatchesNavigator';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import {styles, profileStylesAddition} from '.././styles/ProfileStyles';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme == 'light';
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'ProfileNavigator') {
                iconName = focused
                  ? 'person'
                  : 'person-outline';
              } else if (route.name === 'GobbleNavigator') {
                iconName = focused ? 'md-fast-food' : 'md-fast-food-outline';
              } else if (route.name === 'Chatroom') {
                  iconName = focused ? 'chatbubble-sharp' : 'chatbubble-outline'
              } else {
                  iconName = focused ? 'clipboard-sharp' : 'clipboard-outline'
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        initialRouteName="Profile"
        order={['Profile', 'Gobble', 'Matches', 'Chats']}
        backBehavior= "order"
        tabBarOptions= {{
          activeBackgroundColor: themes.editTheme(isLight),
          inactiveBackgroundColor: themes.oppositeTheme(!isLight),
          activeTintColor: themes.oppositeTheme(isLight),
          inactiveTintColor: themes.oppositeTheme(isLight),
          // labelPosition: 'below-icon',
          showLabel: false,
          adaptive: true,
          style: themes.containerTheme(isLight)
        }}>
            <Tab.Screen options={{
                title: "Profile"
            }} name="ProfileNavigator" component={ProfileNavigator}></Tab.Screen>
            <Tab.Screen options={{
                title: "Gobble"
                }} name="GobbleNavigator" component={GobbleNavigator}></Tab.Screen>
            <Tab.Screen name="MatchesNavigator" options={{
              title: "Matches"
            }} component={MatchesNavigator}></Tab.Screen>
            <Tab.Screen name="Chatroom" component={ChatNavigator}></Tab.Screen>
        </Tab.Navigator>
    )
}