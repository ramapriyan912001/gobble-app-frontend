import React, {useEffect, useState, useRef} from 'react'
import {Text, SafeAreaView, View, Image, TouchableOpacity, Platform, Animated, StyleSheet} from 'react-native'
import { useColorScheme } from 'react-native-appearance'
import {imageStyles, inputStyles, containerStyles, profileStyles, buttonStyles} from '../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../redux/actions/actions'
import * as Haptics from 'expo-haptics';
import themes from '.././styles/Themes';
import { styles } from '.././styles/RegisterStyles';

/**
 * Welcome page for new Users
 * 
 * @param {*} props The props from previous screen
 * @returns The Welcome Screen Render function
 */
export function Welcome(props) {
    
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';

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

    const captionMargin = Platform.OS === 'ios' ? '1%' : '5%';

    return (
        <SafeAreaView style={[{...styles.container, justifyContent: 'space-evenly',}, themes.containerTheme(isLight)]}>
            <Image style={styles.image} source = {require('../images/gobble.png')} accessibilityLabel={'GobbleImage'}/>
            <Animated.View
                style={[
                styles.fadingContainer,
                {
                    opacity: fadeAnim, // Bind opacity to animated value
                },
                ]}>
                <Text style={[{...styles.caption, marginLeft:captionMargin}, themes.textTheme(isLight)]}>Connecting People Over Food.</Text>
            </Animated.View>
            {/* <View style={styles.buttonRow}> */}
            <Animated.View
                style={[
                    styles.fadingContainer,
                    {
                        opacity: fadeAnimText
                    }
                ]}>
                <TouchableOpacity
                    style={{
                        marginVertical:'6%',
                    }}
                    onPress={
                        () => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        props.navigation.navigate('RegisterNavigator');
                        }
                    }
                    touchSoundDisabled={true}
                    accessibilityLabel={'ToRegisterButton'}
                >
                    <Text style={[{fontSize: 20, fontWeight:'bold'},themes.textTheme(isLight)]}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        props.navigation.navigate('Login');
                    }}
                    touchSoundDisabled={true}
                    accessibilityLabel={'ToLoginButton'}
                >
                    <Text style={[{fontSize: 20, fontWeight:'bold'},themes.textTheme(isLight)]}>Already have an Account?</Text>
                </TouchableOpacity>
                {/* <Button
                    title={'Sign Up'}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        props.navigation.navigate('RegisterNavigator');
                    }}
                    color={themes.oppositeTheme(isLight)}
                    touchSoundDisabled={true}
                />
                <Button
                    title={'Already have an Account?'}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                        props.navigation.navigate('Login');
                    }}
                    color={themes.oppositeTheme(isLight)}
                    touchSoundDisabled={true}
                /> */}
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

const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Welcome);