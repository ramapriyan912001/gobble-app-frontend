import React, {useState} from 'react'
import {Text, View, TextInput, Image, StyleSheet, TouchableOpacity, StatusBar} from 'react-native'

export default function signUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return(
        <View style={styles.container}>
            <Image style={styles.gobbleimg}source = {require('../images/gobble.png')}/>
            <StatusBar style="auto"/>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Email"
                    placeholderTextColor="#003f5c"
                    onChangeText={(email) => setEmail(email)}
                />
            </View>
                
            <View style={styles.inputView}>
                <TextInput
                    style={styles.TextInput}
                    placeholder="Password"
                    placeholderTextColor="#003f5c"
                    secureTextEntry={true}
                    onChangeText={(password) => setPassword(password)}
                />
            </View>
            <TouchableOpacity>
            <Text style={styles.forgot_button}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpBtn}>
            <Text style={styles.signUpText}>Sign Up</Text>
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

    image: {
        marginBottom: 40
    },

    inputView: {
        backgroundColor: "#FFC0CB",
        borderRadius: 30,
        width: "70%",
        height: 45,
        marginBottom: 20,
        alignItems: "center",
      },
      
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        alignContent: 'center',
        justifyContent: 'center',
        width: 200
    },

    gobbleimg: {
        width: 350,
        height: 350,
        marginBottom: 30,
        marginLeft: 20
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