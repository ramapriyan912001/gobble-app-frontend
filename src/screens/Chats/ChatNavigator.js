import React from 'react'
import {View, Text, Button} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import ChatRoom from './ChatRoom'
import otherProfile from '../otherProfile'
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
            <Stack.Screen name="Conversation" options={({ navigation, route }) => 
            ({  title: route.params.metadata.name,
                headerRight: () => (<Button
                                        onPress= {() => navigation.navigate('otherProfile', {otherUserID: route.params.metadata.otherUserId, name: route.params.metadata.name})}
                                        title= 'Details' 
                                    />),
                headerBackTitle:'Back'
            })} component={Conversation}></Stack.Screen>
            <Stack.Screen name="otherProfile" options={({ route }) => ({headerShown:true, headerTitle: route.params.name})} component={otherProfile}></Stack.Screen>
        </Stack.Navigator>
    )
}