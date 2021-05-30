import React, {useState} from 'react'
import {Text, View, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../styles/LoginStyles'
export default function signUp(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
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
                    secureTextEntry={true}
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

            <View style={inputStyles.inputView}>
                <TextInput
                    maxLength={15}
                    autoCompleteType="password"
                    style={inputStyles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            
            <TouchableOpacity style={buttonStyles.logginButton}>
            <Text style={buttonStyles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.logginButton} onPress={
                () => props.navigation.goBack()
            }>
            <Text style={buttonStyles.signUpText}>Back to Login</Text>
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

    logginButton: {
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