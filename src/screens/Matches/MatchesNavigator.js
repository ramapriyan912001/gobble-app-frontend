import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react'
import { View, Text } from 'react-native';
import { Matches } from './Matches';
import {MatchesHistory} from './MatchesHistory';

const Tab = createMaterialTopTabNavigator();

function MatchesNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Ongoing" component={Matches} />
      <Tab.Screen name="History" component={MatchesHistory} />
    </Tab.Navigator>
  );
}