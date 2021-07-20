import React from 'react'
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native'
import { SafeAreaView } from 'react-navigation'
import firebaseSvc from '../firebase/FirebaseSvc'
import { inputStyles, buttonStyles } from '../styles/LoginStyles'
import { Ionicons } from '@expo/vector-icons'
import themes from '../styles/Themes';
import { DrawerActions } from '@react-navigation/native'
import { useColorScheme } from 'react-native-appearance'
import { StatusBar } from 'expo-status-bar'
import * as Haptics from 'expo-haptics';

export default function DeleteAccount(props) {
    const drawerMargin = Platform.OS === 'ios' ? '8%' : '10%';
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    return (
        <SafeAreaView style={[{flex: 1}, themes.containerTheme(isLight)]}>
            <StatusBar style="auto"/>
            <TouchableOpacity style={{marginTop: drawerMargin}} onPress={() => props.navigation.dispatch(DrawerActions.openDrawer)}>
                <Ionicons name="menu-outline" style={{alignSelf: 'flex-start', marginLeft: '5%', color:themes.oppositeTheme(isLight)}} size={30}></Ionicons>
            </TouchableOpacity>
            <View style={{marginTop: '20%'}}>
                <Text style={[inputStyles.headerText, themes.textTheme(isLight)]}>
                    {`This is an irreversible action.`}
                </Text>
                <View style={{flexDirection: 'row'}}>
                    <Text style={[{...inputStyles.subHeader, marginRight: '4%', alignSelf: 'flex-start'}, themes.textTheme(isLight)]}>
                        {`\u2022`}
                    </Text>
                    <Text style={[{...inputStyles.subHeader, paddingLeft: '0%', textAlign: 'left', marginLeft: '0%'}, themes.textTheme(isLight)]}>
                        {`Your data will be deleted from Gobble's servers.`}
                    </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                <Text style={[{...inputStyles.subHeader, marginRight: '4%', alignSelf: 'flex-start'}, themes.textTheme(isLight)]}>
                    {`\u2022`}
                </Text>
                <Text style={[{...inputStyles.subHeader, paddingLeft: '0%', textAlign: 'left', marginLeft: '0%'}, themes.textTheme(isLight)]}>
                    {`You will not be able to retrieve your data.`}
                </Text>
                </View>
            
                <TouchableOpacity style={[buttonStyles.loginButton, themes.buttonTheme(isLight)]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        //TODO: Verify if the below function is functional
                        firebaseSvc.deleteUser();
                        Alert.alert('Your account has been deleted', 'You will be logged out of the app now.')
                        props.navigation.navigate('Welcome')
                    }}>
                    <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>
                        Delete Account
                    </Text>
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    )
}

