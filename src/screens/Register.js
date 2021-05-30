import React, {useState} from 'react'
import {Text, View, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar} from 'react-native'

export default function signUp(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    return(
        <View style={styles.container}>
            <Image style={styles.gobbleimg}source = {require('../images/gobble.png')}/>
            <StatusBar style="auto"/>
            <View style={styles.inputView}>
                <TextInput
                    textContentType="username"
                    autoCompleteType="username"
                    style={styles.TextInput}
                    placeholder="Username"
                    placeholderTextColor="#003f5c"
                    onChangeText={(username) => setUsername(username)}
                />
            </View>
                
            <View style={styles.inputView}>
                <TextInput
                    textContentType="emailAddress"
                    autoCompleteType="email"
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(email) => setEmail(email)}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    passwordRules="minlength: 10; required: lower; required: upper; required: digit; required: [-];"
                    textContentType="password"
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>

            <View style={styles.inputView}>
                <TextInput
                    maxLength={15}
                    autoCompleteType="password"
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            
            <TouchableOpacity style={styles.signUpBtn}>
            <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpBtn} onPress={
                () => props.navigation.goBack()
            }>
            <Text style={styles.signUpText}>Back to Login</Text>
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
          backgroundColor: "#FFC0CB",
          borderRadius: 30,
          width: "60%",
          height: 45,
          marginBottom: 20,
        },
        
      TextInput: {
          height: 50,
          flex: 1,
          width: 200,
          paddingLeft: "6%"
      },
  
      gobbleimg: {
          width: '50%',
          height: '30%',
          marginBottom: '10%',
          marginLeft: '2%',
      },

    forgot_button: {
        height: 30,
        marginBottom: 30,
    },

    signUpBtn: {
        width:300,
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        backgroundColor:"#FF1493",
    }
});