import React, {useEffect, useState, useRef} from 'react'
import {Text, SafeAreaView, View, Image, TouchableOpacity, Button, Animated, StyleSheet} from 'react-native'
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
     // fadeAnim will be used as the value for opacity. Initial Value: 0
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeAnimText = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
        }).start();
    };

    useEffect(() => {
        Animated.sequence([
            Animated.timing(
                fadeAnim,
                {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }
            ),
            Animated.timing(
                fadeAnimText,
                {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true
                }
            ),
        ])
        .start();
    }, [fadeAnim]);

    return (
        <SafeAreaView style={[styles.container, containerTheme]}>
            <Image style={styles.image} source = {require('../images/gobble.png')}/>
            <Animated.View
                style={[
                styles.fadingContainer,
                {
                    opacity: fadeAnim, // Bind opacity to animated value
                },
                ]}>
                <Text style={[styles.caption, captionTheme]}>Connecting People Over Food.</Text>
            </Animated.View>
            {/* <View style={styles.buttonRow}> */}
            <Animated.View
                style={[
                    styles.fadingContainer,
                    {
                        opacity: fadeAnimText
                    }
                ]}>
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
            </Animated.View>
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
    fadingContainer: {
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
})

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Welcome);