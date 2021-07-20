import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import Reports from './Reports'
import ReportDetails from './ReportDetails'
import { useColorScheme } from 'react-native-appearance'
import themes from '../styles/Themes'
import { Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerActions } from '@react-navigation/native';


const Stack = createStackNavigator();

/**
 * Navigate between Profile and Update Profile Screens
 * 
 * @returns The Stack Navigator for the Profile Pages
 */
export default function AdminNavigator(props) {

    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const drawerButton = (navigation) => () => (
        <TouchableOpacity
            onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer)}}>
            <Ionicons name="menu-outline" style={{alignSelf: 'flex-start', color:themes.oppositeTheme(isLight)}} size={30}></Ionicons>
        </TouchableOpacity>);
    return (
        <Stack.Navigator initialRouteName="Reports">
            <Stack.Screen options={({ navigation, route }) => 
                ({
                    headerLeft:() => null,
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Reports', 
                    headerBackTitle: 'Reports', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
                })} name="Reports" component={Reports}></Stack.Screen>
            <Stack.Screen name="Report Details" options={({navigation, route}) => ({
                headerRightContainerStyle:{
                    marginRight:'2%'
                },
                headerStyle:{
                    backgroundColor: themes.oppositeTheme(!isLight),
                },
                headerTintColor:themes.oppositeTheme(isLight),
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