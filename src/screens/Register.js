import React, {useState} from 'react'
import {Text, View, TextInput, Image, SafeAreaView, ScrollView,  TouchableOpacity, StatusBar, Switch, Dimensions, StyleSheet} from 'react-native'
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
    const [pass, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [diet, setDietPreference] = useState('');
    const [cuisine, setCuisinePreference] = useState('');
    const [cross, setCrossIndustryPreference] = useState(false);
    const [date, setDate] = useState(new Date());
    const onContentSizeChange = (width, height) => {
        setState({screenHeight: height})
    }
    return(
            <SafeAreaView style={containerStyles.container}>
                <ScrollView 
                style={{
                    flex: 1,}}
                contentContainerStyle={containerStyles.scroller}
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

                    <Text style={pickerStyles.switchText}>What are your dietary restrictions?</Text>
                    <Picker
                        selectedValue={diet}
                        onValueChange={(newDiet, itemIndex) => {setDietPreference(newDiet);initialState.diet = newDiet;}}
                        style={pickerStyles.picker}
                        enabled= {true}
                        >
                        <Picker.Item label="Halal" value="halal" />
                        <Picker.Item label="Vegetarian" value="vegetarian" />
                        <Picker.Item label="Vegan/Strictly Vegetarian" value="vegan" />
                        <Picker.Item label="No Restrictions" value='nonhalal' />
                    </Picker>
                    <Text style={pickerStyles.switchText}>What is your preferred cuisine?</Text>
                    <Picker
                        selectedValue={cuisine}
                        onValueChange={(newCuisineItem, itemIndex) => {setCuisinePreference(newCuisineItem);initialState.cuisine = newCuisineItem;}}
                        style={pickerStyles.picker}
                        >
                        <Picker.Item label="Indian" value="indian" />
                        <Picker.Item label="Asian" value="asian" />
                        <Picker.Item label="Malaysian" value="malay" />
                        <Picker.Item label="Western" value='western' />
                        <Picker.Item label="Others" value='others' />
                    </Picker>
                    <Text style={pickerStyles.switchText}>Would you like to be matched with other Industrial Backgrounds?</Text>
                    <Switch 
                        value={cross} 
                        onValueChange={() => {setCrossIndustryPreference(!cross);initialState.crossIndustry = !initialState.crossIndustry;}} 
                        style={pickerStyles.switch}
                    />
                    <Text style={inputStyles.headerText}>Tell us your Birthday!</Text>
                        <DateTimePicker
                            value={date}
                            is24Hour={true}
                            onChange={(event, selectedDate) => {setDate(selectedDate);initialState.dob = selectedDate;}}
                            style={pickerStyles.datePicker}
                            />
                    
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('FinalStep')}>
                    <Text style={buttonStyles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
                    <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
    )
}

//Additions for later
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