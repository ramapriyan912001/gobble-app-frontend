import React from 'react'
import {View, Text, Image} from 'react-native'
import BottomTabs from '../molecules/BottomTabs'
import NavigationContainer from '@react-navigation/native'

export default function BottomTabsBar() {
    return (
        <NavigationContainer>
            <BottomTabs/>
        </NavigationContainer>
    )
}