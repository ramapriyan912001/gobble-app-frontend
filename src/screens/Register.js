import React, {useState} from 'react'
import {Text, View, TextInput, Alert, Image, SafeAreaView, ScrollView,  TouchableOpacity, StatusBar, Dimensions} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles, pickerStyles} from '../styles/LoginStyles'
import {Picker} from '@react-native-picker/picker'
import DateTimePicker from '@react-native-community/datetimepicker'
const { height } = Dimensions.get('window')

let initialState = {
    name: '',
    dob: '',
    diet: '',
    cuisine:  '',
    crossIndustry: false,
    email: '',
    password: '',
};

export const createState = (name, dob, diet, cuisine, crossIndustry, email, pw) => ({
    name: name,
    dob: dob,
    diet: diet,
    cuisine: cuisine,
    crossIndustry: crossIndustry,
    email: email,
    password: pw
});

export default function register(props) {
    const [state, setState] = useState({screenHeight: 0,});
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [diet, setDietPreference] = useState('');
    const [cuisine, setCuisinePreference] = useState('');
    const [cross, setCrossIndustryPreference] = useState(false);
    const [date, setDate] = useState(new Date());
    const onContentSizeChange = (width, height) => {
        setState({screenHeight: height})
    }
    const TOO_LONG = " has to be less than "
    const TOO_SHORT = " has to be more than "

    async function checkInfo(infoString, info, minLength, maxLength) {
        const shortMessage = infoString + TOO_SHORT + `${minLength} characters!`
        const longMessage = infoString + TOO_LONG + `${maxLength} characters!`
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
            <SafeAreaView style={containerStyles.container}>
                <ScrollView 
                style={{
                    flex: 1,}}
                contentContainerStyle={containerStyles.container}
                onContentSizeChange = {onContentSizeChange}
                >
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
                            onChangeText={(username) => {setName(username);initialState.name = username;}}
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
                            onChangeText={(email) => {setEmail(email);initialState.email = email;}}
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
                            onChangeText={(password) => {setPassword(password);initialState.password = password;}}
                        />
                    </View>
                    
                    <TouchableOpacity style={buttonStyles.loginButton} 
                        onPress={
                            () => {
                                if (checkInfo('Username', name, 5, 20)
                                && checkInfo('Password', password, 5, 20)) {
                                    console.log('API CALL FOR REGISTER')
                                    props.navigation.navigate('RegisterPage2', {state: initialState})
                                }
                            }
                        }>
                    <Text style={buttonStyles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
                    <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
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
                    