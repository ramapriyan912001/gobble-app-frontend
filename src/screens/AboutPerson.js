import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Alert, View, Button, ScrollView} from 'react-native'
import {Input} from 'react-native-elements'
import {StatusBar} from 'expo-status-bar'
import {inputStyles, buttonStyles, profileStyles, containerStyles} from '../styles/LoginStyles'
import { getError, onSuccess, onFailure } from '../services/RegistrationHandlers'
import firebaseSvc from '../firebase/FirebaseSvc'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
import { INDUSTRY_CODES } from '../constants/objects'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Avatar } from 'react-native-elements'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import {styles, profileStylesAddition} from '.././styles/ProfileStyles';

/*
Trying to decide whether to have two screens or one screen in otherProfile
Depending on that, we can have a tab nav in otherProfile, or just move the stuff from this component to the otherProfile Component
To be decided tomorrow
*/
export default function AboutPerson(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const [otherUser, setOtherUser] = useState(props.route.params.otherUser);

    return (
        <View style={[profileStylesAddition.container, themes.containerTheme(isLight)]}>
            <View style={{...profileStylesAddition.item}}>
            <Input label='Name' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={otherUser.name} editable={false}></Input>
            <Input label='Cuisine' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={otherUser.cuisine} editable={false}></Input>
            </View>
            <View style={profileStylesAddition.item}>
            <Input label='Industry' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={INDUSTRY_CODES[otherUser.industry]} editable={false}></Input>
            <Input label='Diet' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={otherUser.diet} editable={false}></Input>
            </View>
            <View style={{marginLeft: '7.5%'}}>
                    <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        // TODO: Need to make blockUser functionality
                        // blockUser();
                        // props.navigation.navigate('Chatroom')
                        }}>
                        <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Block User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        // TODO: Need to make reportUser functionality
                        // reportUser();
                        // props.navigation.navigate('ChatRoom')
                    }}>
                        <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Report User</Text>
                    </TouchableOpacity>
            </View>
        </View>
    )
}