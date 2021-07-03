import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { View, Text, SafeAreaView } from 'react-native';
import { containerStyles } from '../../styles/LoginStyles';
import Awaiting from './Awaiting';
import MatchesHistory from './MatchesHistory';
import Pending from './Pending'

const Tab = createMaterialTopTabNavigator();

/**
 * Navigate between Matches and MatchesHistory
 * 
 * @returns The Tab Navigator between Pending and Previous Matches
 */
export default function MatchesNavigator() {
  return (
        <Tab.Navigator initialRouteName="Ongoing" style={{paddingTop:'8%', backgroundColor:'white'}}>
            <Tab.Screen name="Awaiting" component={Awaiting} />
            <Tab.Screen name="Pending" component={Pending} />
            <Tab.Screen name="Matched" component={MatchesHistory} />
        </Tab.Navigator>
  );
}