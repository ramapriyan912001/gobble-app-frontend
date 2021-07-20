import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, StyleSheet, Platform, Alert, View, Button, ScrollView} from 'react-native'
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
import { BLOCK_SUCCESS } from '../constants/results'
import { blockOrUnblockAlert } from '../constants/alerts'
import { BLOCK_CONFIRM } from '../constants/results'
import { SafeAreaView } from 'react-navigation'


/*
Trying to decide whether to have two screens or one screen in OtherProfile
Depending on that, we can have a tab nav in OtherProfile, or just move the stuff from this component to the OtherProfile Component
To be decided tomorrow
*/
function AboutPerson(props, { navigation }) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const [otherUser, setOtherUser] = useState(props.route.params.otherUser);

    const buttonMargins = Platform.OS === 'ios' ? '7.5%' : '10%';

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            props.fetchUserData();
        })
        return unsubscribe
    }, [navigation])
    const blockAlert = (text) =>
        Alert.alert(
            text, 'Your chat history will be lost forever.',
        [
            {
            text: "No",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
            },
            { text: "Yes", onPress: async() => {
                let res = await firebaseSvc.blockUser(otherUser.id, {name: otherUser.name, id: otherUser.id, avatar: otherUser.avatar})
                if(res == BLOCK_SUCCESS) {
                    props.navigation.navigate('ChatRoom')
                } else {
                    Alert.alert("Sorry, user could not be blocked.", "Try again later.")
                }
            }
            }
        ]
        )

    return (
        <SafeAreaView>
        <View style={[profileStylesAddition.container, themes.containerTheme(isLight)]}>
            <View style={{...profileStylesAddition.item}}>
            <Input label='Name' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={otherUser.name} editable={false}></Input>
            <Input label='Cuisine' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={otherUser.cuisine} editable={false}></Input>
            </View>
            <View style={profileStylesAddition.item}>
            <Input label='Industry' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={INDUSTRY_CODES[otherUser.industry]} editable={false}></Input>
            <Input label='Diet' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={otherUser.diet} editable={false}></Input>
            </View>
        </View>
            <View style={[themes.containerTheme(isLight)]}>
                <TouchableOpacity
                    style={[styles.longButton, themes.buttonTheme(isLight)]}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        let text = `Are you sure you wish to block ${otherUser.name}?`;
                        blockAlert(text);
                    }}>
                    <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Block User</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                            props.navigation.navigate('Report', {otherUser: otherUser})
                        }}>
                    <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Report User</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}


const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(AboutPerson);
