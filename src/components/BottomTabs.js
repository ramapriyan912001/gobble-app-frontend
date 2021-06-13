import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {Profile} from '../screens/Profile'
import {GobbleNavigator} from '../screens/Gobble/GobbleNavigator'
import {Matches} from '../screens/Matches'
import ChatRoom from '../screens/ChatRoom'
import Ionicons from '@expo/vector-icons'

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
        initialRouteName="Profile"
        order={['Profile', 'Gobble', 'Matches', 'ChatRoom']}
        backBehavior= "order"
        defaultNavigationOptions={{
            headerShown: false
        }}
        tabBarOptions= {{
          activeBackgroundColor: "#0aa859",
          inactiveBackgroundColor: "#b5fbd7",
          activeTintColor: "#000000",
          inactiveTintColor: "#000000",
          labelPosition: 'below-icon',
          adaptive: true,
        }}>
            <Tab.Screen name="Profile" navigationOptions={{
                headerLeft: () => null,
            }} component={Profile}></Tab.Screen>
            <Tab.Screen name="Gobble" component={GobbleNavigator}></Tab.Screen>
            <Tab.Screen name="Matches" component={Matches}></Tab.Screen>
            <Tab.Screen name="Chats" component={ChatRoom}></Tab.Screen>
        </Tab.Navigator>
    )
}