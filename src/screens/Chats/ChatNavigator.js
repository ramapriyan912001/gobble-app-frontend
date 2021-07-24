import React from 'react'
import {View, Text, TouchableOpacity} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import ChatRoom from './ChatRoom'
import OtherProfile from '../OtherProfile'
import { Conversation } from './Conversation'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';

const Stack = createStackNavigator();

/**
 * Navigate between ChatRoom and Conversation Page
 * 
 * @returns Stack Navigator
 */
export function ChatNavigator() {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const drawerButton = (navigation) => () => (
        <TouchableOpacity
            onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer)}}>
            <Ionicons name="menu-outline" style={{alignSelf: 'flex-start', color:themes.oppositeTheme(isLight)}} size={30}></Ionicons>
        </TouchableOpacity>);
    return (
        <Stack.Navigator initialRouteName="ChatRoom">
            <Stack.Screen name="ChatRoom" options={({ navigation, route }) => 
            ({
                    headerLeft: () => null,
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Chats', 
                    headerBackTitle: 'Chats', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
            })} component={ChatRoom}></Stack.Screen>
            <Stack.Screen name="Conversation" options={({ navigation, route }) => 
            ({  title: route.params.metadata.name,
                headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                headerRightContainerStyle:{
                    marginRight:'2%'
                },
                headerTintColor:themes.oppositeTheme(isLight),
                headerRight: () => (<TouchableOpacity
                                        onPress= {() => navigation.navigate('OtherProfile', {otherUserID: route.params.metadata.otherUserId, name: route.params.metadata.name})}
                                        
                                    >
                                        <Text style={[themes.textTheme(isLight), {fontSize:17}]}>Details</Text>
                                    </TouchableOpacity>),
                headerBackTitle:'Back'
            })} component={Conversation}></Stack.Screen>
            <Stack.Screen name="OtherProfile" options={({ route }) => ({headerShown:true, headerTitle: route.params.name,
                headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
            })} component={OtherProfile}></Stack.Screen>

        </Stack.Navigator>
    )
}