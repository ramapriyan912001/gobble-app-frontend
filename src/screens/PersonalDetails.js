import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import {Input} from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
import {inputStyles, buttonStyles} from '../styles/LoginStyles'
import {INDUSTRY_CODES} from '../constants/objects'
import firebaseSvc from '../firebase/FirebaseSvc'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import {styles, profileStylesAddition} from '.././styles/ProfileStyles';

/**
 * Tab for User's Personal Details
 * 
 * @param {*} props Props from previous screen
 * @returns PersonalDetails Render Method
 */
function PersonalDetails(props) {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [dob, setDob] = useState('')
    const [dateJoined, setDateJoined] = useState('')
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

    useEffect(() => {
        setName(props.currentUserData.name)
        setEmail(props.currentUserData.email)
        setDob(props.currentUserData.dob)
        setDateJoined(props.currentUserData.dateJoined)
    })

    const signOutSuccess = () => {
        console.log('Signed Out');
        props.navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
        });
    }

    const signOutFailure = (err) => {
        console.log('Sign Out Error: ' + err.message);
        Alert.alert('Sign Out Error. Try Again Later');
    }
    
    const signOutUser = () => firebaseSvc.signOut(signOutSuccess, signOutFailure);
    return (
        <View style={[profileStylesAddition.container, themes.containerTheme(isLight)]}>
            <View style={{...profileStylesAddition.item}}>
            <Input label='Name' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={name} editable={false}></Input>
            <Input label='Email' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={email} editable={false}></Input>
            </View>
            <View style={profileStylesAddition.item}>
            <Input label='Date of Birth' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={dob} editable={false}></Input>
            <Input label='Date Joined' labelStyle={[profileStylesAddition.labelStyle, {color:themes.oppositeTheme(isLight), borderBottomColor: themes.oppositeTheme(isLight),}]} style={[profileStylesAddition.inputStyle, {backgroundColor: themes.oppositeTheme(!isLight), color: themes.oppositeTheme(isLight)}]} value={dateJoined} editable={false}></Input>
            </View>
            <View style={{marginLeft: '7.5%'}}>
                    <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        props.navigation.navigate('ForgotPassword')}}>
                        <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Reset Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.longButton, themes.buttonTheme(isLight)]} onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        signOutUser();
                        props.navigation.navigate('Login')}}>
                        <Text style={[buttonStyles.loginButtonText, themes.textTheme(!isLight)]}>Sign Out</Text>
                    </TouchableOpacity>
            </View>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(PersonalDetails);