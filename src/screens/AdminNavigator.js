import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Reports from './Reports'
import ReportDetails from './ReportDetails'


const Stack = createStackNavigator();

/**
 * Navigate between Profile and Update Profile Screens
 * 
 * @returns The Stack Navigator for the Profile Pages
 */
export default function AdminNavigator(props) {
    return (
        <Stack.Navigator initialRouteName="Reports">
            <Stack.Screen options={{
              headerLeft: () => null
            }} name="Reports" component={Reports}></Stack.Screen>
            <Stack.Screen name="ReportDetails" component={ReportDetails}></Stack.Screen>
        </Stack.Navigator>
    )
}