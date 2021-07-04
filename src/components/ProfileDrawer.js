import {createAppContainer } from 'react-navigation'
import { DrawerItems } from 'react-navigation-drawer';
import {createDrawerNavigator} from '@react-navigation/drawer'
import { Image, View, SafeAreaView, ScrollView, Text, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import Profile from '../screens/Profile/Profile';
import MatchesHistory from '../screens/Matches/MatchesHistory';
import React from 'react'
import { ProfileNavigator } from '../screens/Profile/ProfileNavigator';
import Test from './Test'
import DrawerComponent from './DrawerComponent';
import { Entypo } from '@expo/vector-icons';
import BlockedUsers from '../screens/BlockedUsers';

const {width} = Dimensions.get("window")
const Drawer = createDrawerNavigator();

//#008a49
export default function ProfileDrawer(props) {
    return (
    <Drawer.Navigator
    initialRouteName="Profile"
    drawerType="slide"
    drawerStyle={{width: 2*width/3}}
    drawerContent={(props) => <DrawerComponent {...props}></DrawerComponent>}
    drawerContentOptions={{
        activeTintColor: '#008a49',
        itemStyle: { marginVertical: 6,},
      }}
    >
        <Drawer.Screen options={{
            title: "Profile",
            drawerIcon: ({focused, size}) => {
                return (
                <Ionicons name="md-home-outline" size={size} color={focused ? '#008a49' : "#000"}/>)}}}
                name="Profile" component={ProfileNavigator}></Drawer.Screen>
        <Drawer.Screen
        options={{
            title: "Blocked Users",
            drawerIcon: ({focused, size}) => {
                return (
                <Entypo name="block" size={size} color={focused ? '#008a49' : "#000"}/>)}}} name="Blocked Users" component={BlockedUsers}></Drawer.Screen>
        <Drawer.Screen
        options={{
            title: "Settings",
            drawerIcon: ({focused, size}) => {
                return (
                <Ionicons name="settings" size={size} color={focused ? '#008a49' : "#000"}/>)}}} name="Settings" component={Test}></Drawer.Screen>
    </Drawer.Navigator>
    )
}
