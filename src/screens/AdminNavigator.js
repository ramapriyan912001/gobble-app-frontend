import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Reports from './Reports'
import ReportDetails from './ReportDetails'
import { useColorScheme } from 'react-native-appearance'
import themes from '../styles/Themes'
import { Text, TouchableOpacity } from 'react-native'


const Stack = createStackNavigator();

/**
 * Navigate between Profile and Update Profile Screens
 * 
 * @returns The Stack Navigator for the Profile Pages
 */
export default function AdminNavigator(props) {

    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    return (
        <Stack.Navigator initialRouteName="Reports">
            <Stack.Screen options={{
              headerLeft: () => null
            }} name="Reports" component={Reports}></Stack.Screen>
            <Stack.Screen name="Report Details" options={({navigation, route}) => ({
                headerRightContainerStyle:{
                    marginRight:'2%'
                },
                headerRight: () => (<TouchableOpacity
                                        onPress= {() => props.navigation.navigate('User History', {defendant: route.params.defendant})}
                                    >
                                        <Text style={[themes.textTheme(isLight), {fontSize:17}]}>User History</Text>
                                    </TouchableOpacity>),
                            })
            }  component={ReportDetails}></Stack.Screen>
        </Stack.Navigator>
    )
}