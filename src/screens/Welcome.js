import React, {useEffect, useState} from 'react'
import {Text, SafeAreaView, View, Image, TouchableOpacity, Button, StyleSheet} from 'react-native'
import { useColorScheme } from 'react-native-appearance'
import {imageStyles, inputStyles, containerStyles, profileStyles, buttonStyles} from '../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../redux/actions/actions'
import * as Haptics from 'expo-haptics';

const light = '#ffe';
const dark = '#242C40';

/**
 * Welcome page for new Users
 * 
 * @param {*} props The props from previous screen
 * @returns The Welcome Screen Render function
 */
export function Welcome(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const containerTheme = isLight ? styles.lightContainer : styles.darkContainer;
    const captionTheme = isLight ? styles.darkCaption : styles.lightCaption;
    return (
        <SafeAreaView style={[styles.container, containerTheme]}>
            <Image style={styles.image} source = {require('../images/gobble.png')}/>
            <Text style={[styles.caption, captionTheme]}>Connecting People Over Food.</Text>
            {/* <View style={styles.buttonRow}> */}
                <Button
                    title={'Sign Up'}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        props.navigation.navigate('RegisterNavigator');
                    }}
                    color={isLight? dark : light}
                    touchSoundDisabled={true}
                />
                <Button
                    title={'Already have an Account?'}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        props.navigation.navigate('Login');
                    }}
                    color={isLight? dark : light}
                    touchSoundDisabled={true}
                />
            {/* </View> */}
        </SafeAreaView>
        );
};

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin,
})

const styles = StyleSheet.create({
    image: {
        width: '70%',
        height: '40%',
        marginTop: '0%'
    },
    caption: {
        fontSize: 38,
        fontWeight: 'bold',
        marginBottom: '0%',
        textAlign: 'left'
    },
    darkCaption: {
        color: dark
    },
    lightCaption: {
        color: light
    },
    lightContainer: {
        backgroundColor: light
    },
    darkContainer: {
        backgroundColor: dark
    },
    container: {
        flex: 1,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    buttonRow:{
        flexDirection:'row',
        justifyContent:'space-between'//TODO: Put Space Between Buttons
    },
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Welcome);