import React, {useState} from 'react'
import { Text, View, SafeAreaView, Alert, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { buttonStyles } from '../styles/LoginStyles'
import { REASONS } from '../constants/objects'
import firebaseSvc from '../firebase/FirebaseSvc'



export default function ReportDetails(props) {

    const [text, setText] = useState(props.route.params.complaint.description)
    const [reason, setReason] = useState(REASONS[props.route.params.complaint.reason])
    const [flip, setFlip] = useState(false)

    const dateStringMaker = (date) => {
        return date.slice(4, 15)
    }

    return (
        <SafeAreaView>
            {!flip&&
            <View style={Platform.OS == 'ios' ? {marginTop: '3%',} : {marginTop: '1%'}}>
                <Text style={specificStyles.headerText}>Why do you wish to report the user?</Text>
                <TextInput
                style={specificStyles.input}
                textAlignVertical='top'
                autoCapitalize='sentences'
                multiline
                editable={false}
                placeholder='Give a short description of why you believe the user should be reported.'
                style={{alignSelf: 'center', height: '20%', width: '90%', borderColor: 'gray', borderWidth: 1 }}
                value={reason}
                />
            </View>
            }
            {!flip&&
            <View style={Platform.OS == 'ios' ? {marginTop: '-8%', marginLeft:'0%', marginRight: '1%'} : {marginTop: '-8%', paddingRight: '5%'}}>
                <Text style={specificStyles.headerText}>Please describe why you wish to report this user.</Text>
                <TextInput
                style={specificStyles.input}
                textAlignVertical='top'
                autoCapitalize='sentences'
                multiline
                editable={false}
                placeholder='Give a short description of why you believe the user should be reported.'
                style={{alignSelf: 'center', height: '45%', width: '90%', borderColor: 'gray', borderWidth: 1 }}
                value={text}
                />
            </View>
            }
            {
                !flip&&
                <View style={{marginTop: '-20%'}}>
                    <Text style={{...specificStyles.headerText,marginLeft:'3%',  fontSize:20, marginTop: '-10%'}}>
                        {`This user has had ${props.route.params.complaintCount} complaints against them since joining Gobble in ${dateStringMaker(props.route.params.datetime)}`}</Text>
                </View>
            }
            {!flip&&
            <View>
            <TouchableOpacity style={{...buttonStyles.loginButton, marginTop: '0%'}} onPress={() => {
                Alert.alert(`Are you sure you wish to delete the user's account?`, 'This action is irreversible.', [
                    {
                    text: "No",
                    onPress: () => console.log('cancel pressed'),
                    style: "cancel"
                    },
                    { text: "Yes", onPress: async() => {
                        // TODO VISHNU
                        // firebaseSvc.deleteAnotherUser()
                    }
                    }
                ])
            }}>
                <Text>Delete User Account</Text>
            </TouchableOpacity>
            </View>
            }
            {!flip&&
            <View>
            <TouchableOpacity style={{...buttonStyles.loginButton, marginTop: '3%'}} onPress={() => {
                Alert.alert(`Are you sure you wish to report the user?`, 'The user will be blocked automatically.', [
                    {
                    text: "No",
                    onPress: () => console.log('cancel pressed'),
                    style: "cancel"
                    },
                    { text: "Yes", onPress: async() => {
                        console.log("No action taken")
                        // Not tested yet
                        await firebaseSvc.deleteReport(props.route.params.id);
                        await Alert.alert('Report Deleted.', 'No action taken.');
                        props.navigation.navigate('Reports')
                    }
                    }
                ])
            }}>
                <Text>No Action</Text>
            </TouchableOpacity>
            </View>
            }
        </SafeAreaView>
    )
}

const specificStyles = StyleSheet.create({
    input: {
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