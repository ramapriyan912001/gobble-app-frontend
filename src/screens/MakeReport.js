import React, {useState} from 'react'
import { View, Text,SafeAreaView, TextInput, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native'
import firebaseSvc from '../firebase/FirebaseSvc';
import {Picker} from '@react-native-picker/picker';
import { REASONS } from '../constants/objects';
import { buttonStyles } from '../styles/LoginStyles';
import { BLOCK_SUCCESS } from '../constants/results';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../styles/Themes';
import {styles} from '../styles/ProfileStyles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Loader from 'react-native-three-dots-loader'
export default function MakeReport(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const [reason, setReason] = useState(2);
    const [otherUser, setOtherUser] = useState(props.route.params.otherUser);
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState('')

    const confirmReport = () => {
        Alert.alert(`Are you sure you wish to report the user?`, 'The user will be blocked automatically.', [
            {
            text: "No",
            onPress: () => console.log('cancel pressed'),
            style: "cancel"
            },
            { text: "Yes", onPress: async() => {
                let date = new Date()
                setLoading(true);
                await firebaseSvc.makeReport(otherUser.id, {description: text, reason: reason}, date.toString())
                let res = await firebaseSvc.blockUser(otherUser.id, {name: otherUser.name, id: otherUser.id, avatar: otherUser.avatar});
                setLoading(false);
                console.log(res)
                if(res == BLOCK_SUCCESS) {
                    await Alert.alert('Gobble takes your complaint very seriously.', 'Our admins are reviewing your complaint and will take appropriate action.')
                    props.navigation.navigate('ChatRoom')
                } else {
                    Alert.alert("Sorry, user could not be reported.", "Try again later.")
                }
            }
            }
        ]);
    };

    const renderReasons = () => {
        let reasonID = 0;
        let reasonIDDuplicate = 0;
        return REASONS.map(reason => (<Picker.Item label={reason} value={reasonID++} color={themes.oppositeTheme(isLight)} key={reasonIDDuplicate++}/>))
    };
    if(loading) {
        return (
            <SafeAreaView style={[{flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}, themes.containerTheme(isLight)]}>
              <Loader background={themes.editTheme(isLight)} activeBackground={themes.oppositeTheme(isLight)}/>
            </SafeAreaView>
          );
    } else {
        return (
            <KeyboardAwareScrollView style={[themes.containerTheme(isLight)]} contentContainerStyle={Platform.OS == 'android'? {flex:1}: {}} scrollEnabled={false}>
                <View style={Platform.OS == 'ios' ? {marginTop: '8%'} : {marginTop: '2%'}}>
                    <Text style={[specificStyles.headerText, themes.textTheme(isLight)]}>Why do you wish to report the user?</Text>
                {!isPickerShow && <Picker
                style={Platform.OS == 'android' ? {marginLeft: '3%', color: themes.oppositeTheme(isLight)} : {color: themes.oppositeTheme(isLight)}}
                            selectedValue={reason}
                            onValueChange={(itemValue, itemIndex) => {
                                setReason(itemValue)}}>
                            {renderReasons()}
                    </Picker>}
                </View>
                <View style={Platform.OS == 'ios' ? {marginTop: '7%', marginLeft:'1%', marginRight: '1%'} : {marginTop: '2%', paddingRight: '5%'}}>
                    <Text style={[specificStyles.headerText, themes.textTheme(isLight)]}>Please describe why you wish to report this user.</Text>
                    <TextInput
                    style={[specificStyles.input, themes.textTheme(isLight)]}
                    textAlignVertical='top'
                    autoCapitalize='sentences'
                    multiline
                    placeholder='Give a short description of why you believe the user should be reported.'
                    placeholderTextColor={themes.oppositeTheme(isLight)}
                    onChangeText={text => setText(text)}
                    value={text}
                    returnKeyType = 'done'
                    onSubmitEditing={(event) => confirmReport()}
                    />
                </View>
                <View>
                <TouchableOpacity style={[Platform.OS == 'ios'? {...specificStyles.longButton, marginTop: '-5%'} : {...specificStyles.longButton, marginTop: '-10%'}, themes.buttonTheme(isLight)]} 
                    onPress={confirmReport}>
                    <Text style={themes.textTheme(!isLight)}>Confirm</Text>
                </TouchableOpacity>
                </View>
            </KeyboardAwareScrollView>
        );
    }
    
}

const specificStyles = StyleSheet.create({
    input: {
      alignSelf: 'center',
      height: '45%',
      width: '90%',
      borderColor: 'gray',
      borderWidth: 1,
      paddingLeft:'0%'
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        alignSelf:"flex-start",
        textAlign: 'left',
        marginLeft: '5%',
        marginBottom: '5%'
    },
    longButton:{
        width:'85%',
        borderRadius:25,
        height:50,
        alignSelf:'center',
        alignItems:"center",
        justifyContent:"center",
        shadowOffset: {
            width: 4,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 9,
        elevation: 5,
    },
    subHeader: {
        fontSize: 22,
        // alignSelf: 'center',
        margin: '5%',
    },
  });