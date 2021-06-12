import React from 'react'
import {View, Text, Image} from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Profile from '../../screens/Profile'
import Chatroom from '../../screens/ChatRoom'
import Gobble from '../../screens/Gobble'
import Matches from '../../screens/Matches'
const Tab = createBottomTabNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Profile"
            tabBarOptions={{
                activeTintColor: "#0aa859"
            }}>
            <Tab.Screen name="Profile" component={Profile}></Tab.Screen>
            <Tab.Screen name="Gobble" component={Gobble}></Tab.Screen>
            <Tab.Screen name="Matches" component={Matches}></Tab.Screen>
            <Tab.Screen name="Chats" component={Chatroom}></Tab.Screen>
        </Tab.Navigator>
    )
}