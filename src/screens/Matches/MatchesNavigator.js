import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { View, Text, SafeAreaView } from 'react-native';
import { containerStyles } from '../../styles/LoginStyles';
import Matches from './Matches';
import MatchesHistory from './MatchesHistory';

const Tab = createMaterialTopTabNavigator();

export default function MatchesNavigator() {
  return (
        <Tab.Navigator initialRouteName="Ongoing" style={{paddingTop:'8%', backgroundColor:'white'}}>
            <Tab.Screen name="Pending" component={Matches} />
            <Tab.Screen name="Matched" component={MatchesHistory} />
        </Tab.Navigator>
  );
}