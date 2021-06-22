import React, {useEffect, useState } from 'react'
import {Text, View, TextInput, Alert, Image, TouchableOpacity, StatusBar} from 'react-native'
import {imageStyles, containerStyles, buttonStyles, inputStyles} from '../../styles/LoginStyles'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {onSuccess, onFailure, cancelRegistration, createUserProfile, getError} from '../../services/RegistrationHandlers';
import firebaseSvc from '../../firebase/FirebaseSvc';
import {fetchAuthUser, updateUserDetails, clearData} from '../../redux/actions/actions'
import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
export function UpdateProfile(props) {
    const [name, setName] = useState(props.route.params.name);
    const [email, setEmail] = useState(props.route.params.email);
    const [nameChanged, setNameChange] = useState(false);
    const [emailChanged, setEmailChange] = useState(false);
    
    //Handlers for Action Failure:

    const updateUser = async (user) => {
        const userProfile = await firebaseSvc
                                    .getCurrentUserCollection(
                                        (snapshot) => snapshot.val(),
                                        getError(props))
                                    .then(x => x)
                                    .catch(getError(props));

        if (nameChanged) {
            firebaseSvc.updateUserProfile(user, onSuccess('Name Update'), onFailure('Name Update'));
            userProfile['name'] = name;
        }
        if (emailChanged) {
            firebaseSvc.updateEmail(user.email, onSuccess('Email Update'), onFailure('Email Update'));
            userProfile['email'] = email;
        }
        firebaseSvc.updateCurrentUserCollection(userProfile, onSuccess('Collection Update'), onFailure('Collection Update'));
        props.navigation.navigate('RegisterPage2', {name: name});
    };

    return(
            <KeyboardAwareScrollView contentContainerStyle = {containerStyles.container}>
                    <Image style={imageStyles.gobbleImage}source = {require('../../images/gobble.png')}/>
                    <StatusBar style="auto"/>
                    <Text style={inputStyles.headerText}>Update Particulars</Text>
                    <Text style={inputStyles.subText}>Press Continue if you don't need to update these particulars</Text>
                    <View style={inputStyles.inputView}>
                        <TextInput
                            autoCapitalize="none"
                            textContentType="username"
                            autoCompleteType="username"
                            style={inputStyles.TextInput}
                            placeholder="Name"
                            placeholderTextColor="#003f5c"
                            onChangeText={(username) => {setName(username);setNameChange(true);}}
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
                            onChangeText={(email) => {setEmail(email);setEmailChange(true);}}
                        />
                    </View>
                    <TouchableOpacity style={buttonStyles.loginButton} 
                        onPress={() => props.navigation.navigate('ForgotPassword')}
                    >
                        <Text style={inputStyles.subText}>Reset Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} 
                        onPress={() => updateUser({name: name, email: email})}
                    >
                        <Text style={buttonStyles.loginButtonText}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.goBack()}>
                        <Text style={buttonStyles.loginButtonText}>Back</Text>
                    </TouchableOpacity>
            </KeyboardAwareScrollView>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, clearData, updateUserDetails }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(UpdateProfile);
