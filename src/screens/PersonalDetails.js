import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import {Input} from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
import {inputStyles, buttonStyles} from '../styles/LoginStyles'
import {INDUSTRY_CODES} from '../constants/objects'
import firebaseSvc from '../firebase/FirebaseSvc'

function PersonalDetails(props) {

    const [name, setName] = useState(props.currentUserData.name)
    const [email, setEmail] = useState(props.currentUserData.email)
    const [dob, setDob] = useState(props.currentUserData.dob)
    const [dateJoined, setDateJoined] = useState(props.currentUserData.dob)

    const signOutSuccess = () => {
        console.log('Signed Out');
        props.navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
        });
    }

    const signOutFailure = (err) => {
        console.log('Sign Out Error: ' + err.message);
        Alert.alert('Sign Out Error. Try Again Later');
    }
    
    const signOutUser = () => firebaseSvc.signOut(signOutSuccess, signOutFailure);
    return (
        <View style={styles.container}>
            <View style={{...styles.item}}>
            <Input label='Name' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderBottomColor: 'black', borderBottomWidth: 2}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={name} editable={false}></Input>
            <Input scrollEnabled={true} label='Email' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: 'black', borderBottomWidth: 2}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={email} editable={false}></Input>
            </View>
            <View style={styles.item}>
            <Input label='Date of Birth' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#DFD8C8", borderBottomWidth: 2}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={dob} editable={false}></Input>
            <Input label='Date Joined' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#DFD8C8", borderBottomWidth: 2}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={dateJoined} editable={false}></Input>
            </View>
            <View style={{marginLeft: '5%'}}>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                        signOutUser();
                        props.navigation.navigate('ForgotPassword')}}>
                        <Text style={buttonStyles.loginButtonText}>Reset Password</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                        signOutUser();
                        props.navigation.navigate('Login')}}>
                        <Text style={buttonStyles.loginButtonText}>Sign Out</Text>
                    </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
      width: '50%', // is 50% of container width
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '5%'
    }
})

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(PersonalDetails);