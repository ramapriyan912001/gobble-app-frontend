import React, {useState} from 'react'
import { View, Text,SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native'
import firebaseSvc from '../firebase/FirebaseSvc';
import {Picker} from '@react-native-picker/picker';
import { REASONS } from '../constants/objects';
import themes from '../styles/Themes';
import {styles} from '../styles/RegisterStyles';
import { buttonStyles } from '../styles/LoginStyles';
import { BLOCK_SUCCESS } from '../constants/results';


export default function MakeReport(props) {
    const [reason, setReason] = useState(2);
    const [otherUser, setOtherUser] = useState(props.route.params.otherUser);
    const [isPickerShow, setIsPickerShow] = useState(false)
    const [text, setText] = useState('')

    const renderReasons = () => {
        let reasonID = 0;
        let reasonIDDuplicate = 0;
        return REASONS.map(reason => (<Picker.Item label={reason} value={reasonID++} key={reasonIDDuplicate++}/>))
    };
    return (
        <SafeAreaView>
            <View style={Platform.OS == 'ios' ? {marginTop: '8%',} : {marginTop: '15%'}}>
                <Text style={specificStyles.headerText}>Why do you wish to report the user?</Text>
            {!isPickerShow && <Picker
            style={Platform.OS == 'android' ? {marginLeft: '3%'} : {}}
                        selectedValue={reason}
                        onValueChange={(itemValue, itemIndex) => {
                            console.log(itemValue)
                            setReason(itemValue)}}>
                        {renderReasons()}
                </Picker>}
            </View>
            <View style={Platform.OS == 'ios' ? {marginTop: '7%', marginLeft:'1%', marginRight: '1%'} : {marginTop: '15%', paddingRight: '5%'}}>
                <Text style={specificStyles.headerText}>Please describe why you wish to report this user.</Text>
                <TextInput
                style={specificStyles.input}
                textAlignVertical='top'
                autoCapitalize='sentences'
                multiline
                placeholder='Give a short description of why you believe the user should be reported.'
                style={{alignSelf: 'center', height: '45%', width: '90%', borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setText(text)}
                value={text}
                />
            </View>
            <View>
            <TouchableOpacity style={Platform.OS == 'ios'? {...buttonStyles.loginButton, marginTop: '-25%'} : {...buttonStyles.loginButton, marginTop: '-10%'}} onPress={() => {
                Alert.alert(`Are you sure you wish to report the user?`, 'The user will be blocked automatically.', [
                    {
                    text: "No",
                    onPress: () => console.log('cancel pressed'),
                    style: "cancel"
                    },
                    { text: "Yes", onPress: async() => {
                        let date = new Date()
                        await firebaseSvc.makeReport(otherUser.id, {description: text, reason: reason}, date.toString())
                        let res = await firebaseSvc.blockUser(otherUser.id, {name: otherUser.name, id: otherUser.id, avatar: otherUser.avatar})
                        if(res == BLOCK_SUCCESS) {
                            await Alert.alert('Gobble takes your complaint very seriously.', 'Our admins are reviewing your complaint and will take appropriate action.')
                            props.navigation.navigate('ChatRoom')
                        } else {
                            Alert.alert("Sorry, user could not be reported.", "Try again later.")
                        }
                    }
                    }
                ])
            }}>
                <Text>Confirm</Text>
            </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const specificStyles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf:"flex-start",
        textAlign: 'left',
        marginLeft: '5%',
        marginBottom: '5%'
    },

    subHeader: {
        fontSize: 22,
        // alignSelf: 'center',
        margin: '5%',
    },
  });