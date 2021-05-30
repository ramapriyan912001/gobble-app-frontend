import React, {useState} from 'react'
import {Text, View, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar, Alert, ToastAndroid} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../styles/LoginStyles'
import axios from 'axios'
import API from '../api'



export default function signUp(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const TOO_LONG = " is too long!"
    const TOO_SHORT = " is too short!"

    async function checkInfo(infoString, info, minLength, maxLength) {
        const shortMessage = infoString + TOO_SHORT
        const longMessage = infoString + TOO_LONG
        if (info.length < minLength) {
            Alert.alert(shortMessage)
            return false;
        } else if (info.length > maxLength) {
            Alert.alert(longMessage)
            return false;
        } else {
            return true;
        }
    }

    return(
        <View style={containerStyles.container}>
            <Image style={imageStyles.gobbleImage}source = {require('../images/gobble.png')}/>
            <StatusBar style="auto"/>
            <View style={inputStyles.inputView}>
                <TextInput
                    textContentType="username"
                    autoCompleteType="username"
                    style={inputStyles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    onChangeText={(username) => setUsername(username)}
                />
            </View>
                
            <View style={inputStyles.inputView}>
                <TextInput
                    textContentType="emailAddress"
                    autoCompleteType="email"
                    style={inputStyles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            <View style={inputStyles.inputView}>
                <TextInput
                    passwordRules="minlength: 10; required: lower; required: upper; required: digit; required: [-];"
                    textContentType="password"
                    style={inputStyles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            
            <TouchableOpacity style={buttonStyles.loginButton} onPress={
                () => {
                    if (checkInfo('Username', password, 10, 20)
                    && checkInfo('Password', username, 5, 20)) {
                        /*API.post('register', {
                            body: {
                                name: username,
                                password: password,
                                email: email,
                                crossIndustry: true,
                                lastSeen: '',
                                dob: '',
                                diet: '',
                                cuisine: '',
                                image: '',
                            },
                            method: 'POST',
                        });*/
                    }
                }
            }>
            <Text style={buttonStyles.signUpText}>SIGN UP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={
                () => props.navigation.goBack()
            }>
            <Text style={buttonStyles.signUpText}>BACK TO LOGIN</Text>
            </TouchableOpacity>
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
  
      inputView: {
          backgroundColor: "#b5fbd7",
          borderRadius: 30,
          width: "60%",
          height: 45,
          marginBottom: 20,
          shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        },
        
      TextInput: {
          height: 50,
          flex: 1,
          width: 200,
          paddingLeft: "6%"
      },
  
      gobbleImage: {
          width: '50%',
          height: '30%',
          marginBottom: '10%',
          marginLeft: '2%',
          marginTop: '-20%'
      },

    forgot_button: {
        height: 30,
        marginBottom: 30,
    },

    loginButton: {
        width:330,
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: '5%',
        backgroundColor:"#0aa859",
        shadowColor: "#000",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 9,
        elevation: 5,
    }
});