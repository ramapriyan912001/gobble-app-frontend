import React, {useState} from 'react'
import {Text, View, TextInput, Image, StyleSheet, TouchableOpacity, ToastAndroid,
    Platform, Alert} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import {createStackNavigator} from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'
import {API} from '../api'

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function verifyLogin() {
        API.post('login', {
            method: 'POST',
            body: {
                email: email,
                password: password
            }
        }).then(res => {
            console.log('POSTING STUFF')
            if (res.statusCode === 200) {
                console.log("success")
                return true

                /* BRING THE PERSON TO THE PROFILE PAGE
                NAVIGATION.NAVIGATE(PROFILE.JS WITH PROPS STATING EMAIL AND
                PW, USE A COMPONENTDIDMOUNT() METHOD TO SEND GET REQUEST TO API
                AND LOAD THE PROFILE PAGE ACCORDINGLY)*/


            } else {
                Alert.alert("No account with this email and password exists!")
                return false
            }
        }).catch(err => console.log(err))
    }
    return(
        <View style={containerStyles.container}>
            <Image style={imageStyles.gobbleImage}source = {require('../images/gobble.png')}/>
            <StatusBar style="auto"/>
            <View style={inputStyles.inputView}>
                <TextInput
                    style={inputStyles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
                
            <View style={inputStyles.inputView}>
                <TextInput
                    style={inputStyles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <TouchableOpacity>
            <Text style={buttonStyles.forgotButton}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={
                () => {
                    if (verifyLogin()) {
                        props.navigation.navigate('LoginConfirmation')
                    }
                }
            }>
            <Text style={buttonStyles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton}
            onPress={()=> props.navigation.navigate('Register')}>
            <Text style={buttonStyles.loginText}>GO TO SIGN UP</Text>
            </TouchableOpacity>
        </View>
    )
}


