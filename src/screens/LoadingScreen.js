import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native'
import themes from '../styles/Themes';
import { useColorScheme } from 'react-native-appearance';
import Loader from 'react-native-three-dots-loader';

/**
 * Page Shown when Loading
 * 
 * @returns LoadingScreen Render Method 
 */
export default function LoadingScreen () {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    
    return (
    <SafeAreaView style={[{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}, themes.containerTheme(isLight)]}>
        <Loader background={themes.editTheme(isLight)} activeBackground={themes.oppositeTheme(isLight)}/>
    </SafeAreaView>
    )
};