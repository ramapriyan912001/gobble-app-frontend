import React, {useState} from 'react'
import {Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

let initialState = {
    name: '',
    dob: '',
    diet: '',
    cuisine:  [],
    crossIndustry: false,
    email: '',
    password: '',
};

export default function step1(props) {
    const [state, setState] = useState(initialState);
    const nextStep = () => {
        const { next, saveState } = props;
        // Save state for use in other steps
        saveState(state);
        // Go to next step
        next();
      };
    
    const goBack = () => {
        const { back } = props;
        // Go to previous step
        back();
      }
    return(
            <KeyboardAwareScrollView contentContainerStyle={containerStyles.container}>
                <Image style={imageStyles.gobbleImage}source = {require('../images/gobble.png')}/>
                <StatusBar style="auto"/>
                <View style={inputStyles.inputHeader}>
                    <Text style={inputStyles.headerText}>Introduce Yourself!</Text>
                </View>
                <View style={inputStyles.inputView}>
                    <TextInput
                        textContentType="username"
                        autoCompleteType="username"
                        style={inputStyles.TextInput}
                        placeholder="Username"
                        placeholderTextColor="#003f5c"
                        onChangeText={(username) => state.name = username}
                    />
                </View>
                    
                <View style={inputStyles.inputView}>
                    <TextInput
                        textContentType="emailAddress"
                        autoCompleteType="email"
                        style={inputStyles.TextInput}
                        placeholder="Email"
                        placeholderTextColor="#003f5c"
                        secureTextEntry={false}
                        onChangeText={(email) => state.email = email}
                    />
                </View>

                <View style={inputStyles.inputView}>
                    <TextInput
                        passwordRules="minlength: 8; required: lower; required: upper; required: digit; required: [-];"
                        textContentType="password"
                        style={inputStyles.TextInput}
                        placeholder="Password"
                        placeholderTextColor="#003f5c"
                        secureTextEntry={true}
                        onChangeText={(password) => state.password = password
                        }
                    />
                </View>
                
                <TouchableOpacity style={buttonStyles.loginButton} onPress={nextStep}>
                <Text style={buttonStyles.loginButtonText}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={buttonStyles.loginButton} onPress={goBack()}>
                <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
    )
}

/*
<KeyboardAwareScrollView contentContainerStyle={containerStyles.container}>
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
                
                <TouchableOpacity style={buttonStyles.loginButton}>
                <Text style={buttonStyles.loginButtonText}>Continue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={buttonStyles.loginButton} onPress={
                    () => props.navigation.goBack()
                }>
                <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
    ) */