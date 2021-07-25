import {createDrawerNavigator} from '@react-navigation/drawer'
import { Dimensions, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { ProfileNavigator } from '../screens/Profile/ProfileNavigator';
import Test from './Test'
import DrawerComponent from './DrawerComponent';
import { Entypo } from '@expo/vector-icons';
import BlockedUsers from '../screens/BlockedUsers';
import themes from '../styles/Themes';
import { useColorScheme } from 'react-native-appearance';
import { AntDesign } from '@expo/vector-icons';
import DeleteAccount from '../screens/DeleteAccount'
import { DrawerActions } from '@react-navigation/native';
import FAQs from '../screens/FAQs';

const {width} = Dimensions.get("window")
const Drawer = createDrawerNavigator();

//#008a49
export default function ProfileDrawer(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const drawerButton = (navigation) => () => (
        <TouchableOpacity
            onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer)}}
            style={{marginLeft: 14}}>
            <Ionicons name="menu-outline" style={{alignSelf: 'flex-start', color:themes.oppositeTheme(isLight)}} size={28}></Ionicons>
        </TouchableOpacity>);

    return (
    <Drawer.Navigator
    initialRouteName="Profile"
    drawerType="slide"
    screenOptions={({navigation, route}) => ({
        headerLeft:drawerButton(navigation),
        headerShown:true,
        headerBackTitleVisible: false, 
        headerStyle:{
            backgroundColor: themes.oppositeTheme(!isLight),
        },
        headerTintColor:themes.oppositeTheme(isLight)
    })}
    drawerStyle={{width: 2*width/3, backgroundColor:themes.oppositeTheme(!isLight)}}
    drawerContent={(props) => <DrawerComponent {...props}></DrawerComponent>}
    drawerContentOptions={{
        activeTintColor: '#008a49',
        itemStyle: { marginVertical: 6,},
        labelStyle: {
            color:themes.oppositeTheme(isLight)
        }
      }}
    >
        <Drawer.Screen options={{
            title: "Profile",
            drawerIcon: ({focused, size}) => {
                return (
                <Ionicons name="md-home-outline" size={size} color={focused ? themes.editTheme(!isLight) : themes.oppositeTheme(isLight)}/>)}}}
                name="Profile" component={ProfileNavigator}></Drawer.Screen>
        <Drawer.Screen
        options={{
            title: "Blocked Users",
            drawerIcon: ({focused, size}) => {
                return (
                <Entypo name="block" size={size} color={focused ? themes.editTheme(!isLight) : themes.oppositeTheme(isLight)}/>)}}} name="Blocked Users" component={BlockedUsers}></Drawer.Screen>
        {/* <Drawer.Screen
        options={{
            title: "Settings",
            drawerIcon: ({focused, size}) => {
                return (
                <Ionicons name="settings" size={size} color={focused ? themes.editTheme(!isLight) : themes.oppositeTheme(isLight)}/>)}}} name="Settings" component={Test}></Drawer.Screen> */}
        <Drawer.Screen
        options={{
            title: "FAQs",
            drawerIcon: ({focused, size}) => {
                return (
                <AntDesign name="question" size={size} color={focused ? themes.editTheme(!isLight) : themes.oppositeTheme(isLight)}/>)}}} name="FAQs" component={FAQs}></Drawer.Screen>
        <Drawer.Screen
        options={{
            title: "Delete Account",
            drawerIcon: ({focused, size}) => {
                return (
                <AntDesign name="deleteuser" size={size} color={focused ? themes.editTheme(!isLight) : themes.oppositeTheme(isLight)}/>)}}} name="Delete Account" component={DeleteAccount}></Drawer.Screen>
    </Drawer.Navigator>
    )
}
