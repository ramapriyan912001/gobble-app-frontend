import React from 'react'
import { TouchableOpacity } from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import Profile from './Profile'
import UpdateProfile from './UpdateProfile'
import RegisterPage2 from '../Register/RegisterPage2'
import RegisterPage3 from '../Register/RegisterPage3'
import RegisterPage4 from '../Register/RegisterPage4'
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';


const Stack = createStackNavigator();

/**
 * Navigate between Profile and Update Profile Screens
 * 
 * @returns The Stack Navigator for the Profile Pages
 */
export function ProfileNavigator() {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const drawerButton = (navigation) => () => (
        <TouchableOpacity
            onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer)}}>
            <Ionicons name="menu-outline" style={{alignSelf: 'flex-start', color:themes.oppositeTheme(isLight)}} size={30}></Ionicons>
        </TouchableOpacity>);

    return (
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen name="Profile" options={({ navigation, route }) => 
                ({
                    headerLeft:drawerButton(navigation),
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Profile', 
                    headerBackTitle: 'Profile', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
                })
            } component={Profile}></Stack.Screen>
            <Stack.Screen name="RegisterPage2" component={RegisterPage2}></Stack.Screen>
        </Stack.Navigator>
    )
}