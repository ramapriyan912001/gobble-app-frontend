import React, {useState} from 'react'
import {Text, View, TextInput, Alert, Image, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebaseSvc from '../reducers/FirebaseSvc';

export default function register(props) {
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    //Handlers

    const validateInput = (user) => {
        const shortMessage = (infoString, len) => infoString + " has to be more than " + `${len} characters!`;
        const longMessage = (infoString, len) => infoString + " has to be less than " + `${len} characters!`;
        const emailRegex = /@gmail.com|@yahoo.com|@icloud.com|@u.nus.edu|@hotmail.com|@live.com|@yahoo.co.uk|@nus.edu.sg/;
        
        function checkInfo(infoString, info, minLength, maxLength) {
            if (info.length < minLength) {
                return {
                    message: shortMessage(infoString, minLength),
                    valid: false
                };
            } else if (info.length > maxLength) {
                return {
                    message: longMessage(infoString, maxLength),
                    valid: false
                };
            } else {
                return {
                    message: '',
                    valid: true
                }
            }
        }
        if (!checkInfo('Username', user.name, 5, 20).valid) {Alert.alert(checkInfo('Username', user.name, 5, 20).message);}
        else if (!checkInfo('Password', user.password, 5, 30).valid) {Alert.alert(checkInfo('Password', user.password, 5, 30).message);}
        else if (!emailRegex.test(user.email)) {Alert.alert('Invalid Email!');}
        else {props.navigation.navigate('RegisterPage2', {user: user});}
    }

    const passAlongInfo = (email, name, password) => {
        let user = {
            email: email,
            name: name,
            password: password
        };
        validateInput(user);
    };
    
    return(
            <KeyboardAwareScrollView contentContainerStyle = {containerStyles.container}>
                    <Image style={imageStyles.gobbleImage}source = {require('../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <Text style={inputStyles.headerText}>Introduce Yourself!</Text>
                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            textContentType="username"
                            autoCompleteType="username"
                            style={inputStyles.TextInput}
                            placeholder="Name"
                            placeholderTextColor="#003f5c"
                            onChangeText={(username) => setName(username)}
                        />
                    </View>
                        
                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            textContentType="emailAddress"
                            autoCompleteType="email"
                            style={inputStyles.TextInput}
                            placeholder="Email"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={false}
                            onChangeText={(email) => setEmail(email)}
                        />
                    </View>

                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            passwordRules="minlength: 8; required: lower; required: upper; required: digit; required: [-];"
                            textContentType="password"
                            style={inputStyles.TextInput}
                            placeholder="Password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry={true}
                            onChangeText={(password) => setPassword(password)}
                        />
                    </View>
                    
                    <TouchableOpacity style={buttonStyles.loginButton} 
                        onPress={() => passAlongInfo(email, name, password)}
                    >
                        <Text style={buttonStyles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
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
                        onChangeText={(password) => setPasswordword(password)}
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
// import React, {useState} from 'react'
// import {Text, View, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar} from 'react-native'
// import AnimatedMultistep from "react-native-animated-multistep";

// import Step1 from "./step1";
// import Step2 from "./step2";
// import Step3 from './step3';
// import FinalStep from "./finalstep";

// const allSteps = [
//     { name: "step 1", component: Step1 },
//     { name: "step 2", component: Step2 },
//     { name: "step 3", component: Step3 },
//     { name: "final step", component: FinalStep}
// ];

// export default function signUp(props) {
//     const onNext = () => console.log("Next");

//     const onBack = () => console.log("Back");

//     const finish = finalState => console.log(finalState);

//     return (
//     <View style={{ flex: 1}}>
//         <AnimatedMultistep
//             steps={allSteps}
//             onFinish={finish}
//             onBack={onBack}
//             onNext={onNext}
//             comeInOnNext="bounceInUp"
//             OutOnNext="bounceOutDown"
//             comeInOnBack="bounceInDown"
//             OutOnBack="bounceOutUp"
//         />
//     </View>);    
// }
                    