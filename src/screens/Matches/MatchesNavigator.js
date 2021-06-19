import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { View, Text, SafeAreaView } from 'react-native';
import { Matches } from './Matches';
import {MatchesHistory} from './MatchesHistory';

const Tab = createMaterialTopTabNavigator();

export default function MatchesNavigator() {
  return (
        <Tab.Navigator initialRouteName="Ongoing">
            <Tab.Screen name="Ongoing" component={Matches} />
            <Tab.Screen name="History" component={MatchesHistory} />
        </Tab.Navigator>
  );
}