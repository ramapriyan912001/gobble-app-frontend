import React, {useState} from 'react'
import {Text, View, TextInput, Image, StyleSheet, TouchableOpacity} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'

export default function Login(props) {
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
            <TouchableOpacity style={styles.loginBtn}>
            <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginBtn}
            onPress={()=> props.navigation.navigate('Register')}>
            <Text style={styles.loginText}>Sign Up</Text>
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
        marginBottom: '6%',
    },

    loginBtn: {
        width:330,
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: '5%',
        backgroundColor:"#0aa859",
    }
});