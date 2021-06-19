import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {ProfileNavigator} from '../screens/Profile/ProfileNavigator'
import {GobbleNavigator} from '../screens/Gobble/GobbleNavigator'
import {Matches} from '../screens/Matches/Matches'
import {ChatRoom} from '../screens/ChatRoom'
import Ionicons from '@expo/vector-icons/Ionicons'
import MatchesNavigator from '../screens/Matches/MatchesNavigator';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
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
              } else if (route.name === 'Chats') {
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
        headerMode={'none'}
        tabBarOptions= {{
          activeBackgroundColor: "#0aa859",
          inactiveBackgroundColor: "#b5fbd7",
          activeTintColor: "#000000",
          inactiveTintColor: "#000000",
          labelPosition: 'below-icon',
          adaptive: true,
        }}>
            <Tab.Screen options={{
                title: "Profile"
            }} name="ProfileNavigator" navigationOptions={{
                headerLeft: () => null,
                headerShown: false
            }} component={ProfileNavigator}></Tab.Screen>
            <Tab.Screen options={{
                title: "Gobble"
                }} name="GobbleNavigator" component={GobbleNavigator}></Tab.Screen>
            <Tab.Screen name="MatchesNavigator" navigationOptions={{
                headerLeft: () => null,
                headerShown: true
            }} options={{
              title: "Matches"
            }} component={MatchesNavigator}></Tab.Screen>
            <Tab.Screen name="Chats" component={ChatRoom}></Tab.Screen>
        </Tab.Navigator>
    )
}