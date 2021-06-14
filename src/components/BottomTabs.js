import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {ProfileNavigator} from '../screens/Profile/ProfileNavigator'
import {GobbleNavigator} from '../screens/Gobble/GobbleNavigator'
import {Matches} from '../screens/Matches'
import {ChatRoom} from '../screens/ChatRoom'
import Ionicons from '@expo/vector-icons'

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
        initialRouteName="Profile"
        order={['Profile', 'Gobble', 'Matches', 'ChatRoom']}
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
            <Tab.Screen name="ProfileNavigator" navigationOptions={{
                headerLeft: () => null,
                headerShown: false
            }} component={ProfileNavigator}></Tab.Screen>
            <Tab.Screen name="GobbleNavigator" component={GobbleNavigator}></Tab.Screen>
            <Tab.Screen name="Matches" component={Matches}></Tab.Screen>
            <Tab.Screen name="Chats" component={ChatRoom}></Tab.Screen>
        </Tab.Navigator>
    )
}