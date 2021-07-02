import React, {useEffect, useState, useCallback} from 'react'
import {Text, Image, TouchableOpacity, SafeAreaView, Alert, View, Button, ScrollView} from 'react-native'
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
import MealPreferences2 from './MealPreferences2'


/*
Trying to decide whether to have two screens or one screen in otherProfile
Depending on that, we can have a tab nav in otherProfile, or just move the stuff from this component to the otherProfile Component
To be decided tomorrow
*/
export default function AboutPerson(props) {
    
    let otherUser = props.initialParams.otherUser

    return (
        <View style={styles.container}>
            <View style={{...styles.item}}>
            <Input label='Name' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderBottomColor: 'black', borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={otherUser.name} editable={false}></Input>
            <Input label='Cuisine' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: 'black', borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={otherUser.cuisine} editable={false}></Input>
            </View>
            <View style={styles.item}>
            <Input label='Industry' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#000000", borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={INDUSTRY_CODES[otherUser.industry]} editable={false}></Input>
            <Input label='Diet' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#000000", borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={otherUser.diet} editable={false}></Input>
            </View>
            <View style={{marginLeft: '7.5%'}}>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                        // TODO: Need to make blockUser functionality
                        // blockUser();
                        // props.navigation.navigate('Chatroom')
                        }}>
                        <Text style={buttonStyles.loginButtonText}>Block User</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                        // TODO: Need to make reportUser functionality
                        // reportUser();
                        // props.navigation.navigate('ChatRoom')
                    }}>
                        <Text style={buttonStyles.loginButtonText}>Report User</Text>
                    </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
      width: '50%', // is 50% of container width
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '5%'
    }
})