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
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';

const Stack = createStackNavigator();

/**
 * Navigate between ChatRoom and Conversation Page
 * 
 * @returns Stack Navigator
 */
export function ChatNavigator() {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    return (
        <Stack.Navigator initialRouteName="ChatRoom">
            <Stack.Screen name="ChatRoom" options={
                {
                    headerLeft: () => null,
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Chats', 
                    headerBackTitle: 'Chats', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
            }} component={ChatRoom}></Stack.Screen>
            <Stack.Screen name="Conversation" options={({ navigation, route }) => 
            ({  title: route.params.metadata.name,
                headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                headerTintColor:themes.oppositeTheme(isLight),
                headerRight: () => (<Button
                                        onPress= {() => navigation.navigate('otherProfile', {otherUserID: route.params.metadata.otherUserId, name: route.params.metadata.name})}
                                        title= 'Details' 
                                    />),
                headerBackTitle:'Back'
            })} component={Conversation}></Stack.Screen>
            <Stack.Screen name="otherProfile" options={({ route }) => ({headerShown:true, headerTitle: route.params.name,
                headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
            })} component={otherProfile}></Stack.Screen>
        </Stack.Navigator>
    )
}