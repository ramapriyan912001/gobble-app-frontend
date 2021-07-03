import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import ChatRoom from './ChatRoom'
import { Conversation } from './Conversation'

const Stack = createStackNavigator();

/**
 * Navigate between ChatRoom and Conversation Page
 * 
 * @returns Stack Navigator
 */
export function ChatNavigator() {
    return (
        <Stack.Navigator initialRouteName="ChatRoom">
            <Stack.Screen name="ChatRoom" options={{headerShown:true, headerTitle: 'Chats', headerBackTitle: 'Chats'}} component={ChatRoom}></Stack.Screen>
            <Stack.Screen name="Conversation" options={({ route }) => ({ title: route.params.metadata.name})} component={Conversation}></Stack.Screen>
        </Stack.Navigator>
    )
}