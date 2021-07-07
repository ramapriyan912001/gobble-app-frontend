import React, {useState} from 'react'
import { View, Text,SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native'
import firebaseSvc from '../firebase/FirebaseSvc';
import {Picker} from '@react-native-picker/picker';
import { REASONS } from '../constants/objects';
import themes from '../styles/Themes';
import {styles} from '../styles/RegisterStyles';
import { buttonStyles } from '../styles/LoginStyles';


export default function MakeReport(props) {
    const [reason, setReason] = useState(0);
    const [otherUser, setOtherUser] = useState({});
    const [isPickerShow, setIsPickerShow] = useState(false)
    const [text, setText] = useState('')

    const renderReasons = () => {
        let reasonID = 0;
        return REASONS.map(reason => (<Picker.Item label={reason} value={reason} key={reasonID++}/>))
    };
    return (
        <SafeAreaView>
            <View style={Platform.OS == 'ios' ? {marginTop: '8%',} : {marginTop: '15%'}}>
                <Text style={specificStyles.headerText}>Why do you wish to report the user?</Text>
            {!isPickerShow && <Picker
            style={Platform.OS == 'android' ? {marginLeft: '3%'} : {}}
                        selectedValue={reason}
                        onValueChange={(itemValue, itemIndex) => setReason(itemValue)}>
                        {renderReasons()}
                </Picker>}
            </View>
            <View style={Platform.OS == 'ios' ? {marginTop: '7%', marginLeft:'1%', marginRight: '1%'} : {marginTop: '15%', paddingRight: '5%'}}>
                <Text style={specificStyles.headerText}>Please describe why you wish to report this user.</Text>
                <TextInput
                style={specificStyles.input}
                textAlignVertical='top'
                autoCapitalize
                multiline
                placeholder='Give a short description of why you believe the user should be reported.'
                style={{alignSelf: 'center', height: '45%', width: '90%', borderColor: 'gray', borderWidth: 1 }}
                onChangeText={text => setText(text)}
                value={text}
                />
            </View>
            <View>
            <TouchableOpacity style={{...buttonStyles.loginButton, marginTop: '-25%'}} onPress={() => {
                Alert.alert(`Are you sure you wish to report the user?`, 'The user will be blocked automatically.', [
                    {
                    text: "No",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                    },
                    { text: "Yes", onPress: async() => {
                        let res = await firebaseSvc.blockUser(otherUser.id, {name: otherUser.name, id: otherUser.id, avatar: otherUser.avatar})
                        if(res == BLOCK_SUCCESS) {
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