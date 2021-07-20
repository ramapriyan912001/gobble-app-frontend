import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack'
import React from 'react'
import { View, Text, SafeAreaView } from 'react-native';
import { containerStyles } from '../../styles/LoginStyles';
import Awaiting from './Awaiting';
import MatchesHistory from './MatchesHistory';
import Pending from './Pending'
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import {styles} from '../../styles/RegisterStyles';

const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

/**
 * Navigate between Matches and MatchesHistory
 * 
 * @returns The Tab Navigator between Pending and Previous Matches
 */
export default function MatchesNavigator() {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === 'light';
  return (
        <Tab.Navigator 
          initialRouteName="Awaiting" 
          style={{paddingTop:'8%', backgroundColor:themes.oppositeTheme(!isLight)}}
          tabBarOptions={{
            activeTintColor:themes.oppositeTheme(isLight),
            inactiveTintColor:themes.editTheme(!isLight),
            style:{
              backgroundColor:'transparent',
              borderColor: 'transparent',
            },
          }}
        >
            <Tab.Screen name="Awaiting" component={Awaiting} />
            <Tab.Screen name="Pending" component={Pending} />
            <Tab.Screen name="Matched" component={MatchesHistory} />
        </Tab.Navigator>
  );
}