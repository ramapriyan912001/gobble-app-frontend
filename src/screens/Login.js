import React, {useState} from 'react'
import {Text, View, TextInput, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {imageStyles, inputStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import {createStackNavigator} from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            <TouchableOpacity style={buttonStyles.logginButton}>
            <Text style={buttonStyles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.logginButton}
            onPress={()=> props.navigation.navigate('Register')}>
            <Text style={buttonStyles.loginText}>SIGN UP</Text>
            </TouchableOpacity>
        </View>
    )
}


