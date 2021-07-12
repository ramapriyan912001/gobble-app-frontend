import React, {useEffect, useState} from 'react'
import { Text, View, SafeAreaView, Alert, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import { buttonStyles } from '../styles/LoginStyles'
import { REASONS } from '../constants/objects'
import firebaseSvc from '../firebase/FirebaseSvc'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import themes from '../styles/Themes';
import {styles} from '../styles/ProfileStyles';

export default function ReportDetails(props) {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    const [defendant, setDefendant] = useState(props.route.params.defendant);
    const [text, setText] = useState(props.route.params.complaint.description)
    const [reason, setReason] = useState(REASONS[props.route.params.complaint.reason])
    const [buttons, setButtons] = useState(props.route.params.buttons)

    useEffect(() => {
        setButtons(props.route.params.buttons)
    }, [])

    const dateStringMaker = (date) => {
        return date.slice(4, 15)
    }

    return (
        <SafeAreaView styles={themes.containerTheme(isLight)}>
            <View style={Platform.OS == 'ios' ? {marginTop: '3%',} : {marginTop: '1%'}}>
                <Text style={[specificStyles.headerText, themes.textTheme(isLight)]}>Why do you wish to report the user?</Text>
                <TextInput
                style={[specificStyles.input, themes.textTheme(isLight)]}
                textAlignVertical='top'
                autoCapitalize='sentences'
                multiline
                editable={false}
                placeholder='Give a short description of why you believe the user should be reported.'
                placeholderTextColor={themes.oppositeTheme(isLight)}
                style={{alignSelf: 'center', height: '20%', width: '90%', borderColor: themes.editTheme(!isLight), borderWidth: 1 }}
                value={reason}
                />
            </View>
            <View style={Platform.OS == 'ios' ? {marginTop: '-8%', marginLeft:'0%', marginRight: '1%'} : {marginTop: '-8%', paddingRight: '5%'}}>
                <Text style={[specificStyles.headerText, themes.textTheme(isLight)]}>Please describe why you wish to report this user.</Text>
                <TextInput
                style={[specificStyles.input, themes.textTheme(isLight)]}
                textAlignVertical='top'
                autoCapitalize='sentences'
                multiline
                editable={false}
                placeholderTextColor={themes.oppositeTheme(isLight)}
                placeholder='Give a short description of why you believe the user should be reported.'
                style={{alignSelf: 'center', height: '45%', width: '90%', borderColor: themes.editTheme(!isLight), borderWidth: 1 }}
                value={text}
                />
            </View>
            {buttons &&
                <View style={{marginTop: '-20%'}}>
                    <Text style={{...specificStyles.headerText,marginLeft:'3%',  fontSize:20, marginTop: '-10%'}}>
                        {`This user has had ${props.route.params.complaintCount} complaints against them since joining in ${dateStringMaker(props.route.params.datetime)}`}</Text>
                </View>
            }
            {buttons &&
            <View>
            <TouchableOpacity 
                style={[{...styles.longButton, marginTop: '0%'}, themes.buttonTheme(isLight)]} 
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                    Alert.alert(`Are you sure you wish to delete the user's account?`, 'This action is irreversible.', [
                    {
                    text: "No",
                    onPress: () => console.log('cancel pressed'),
                    style: "cancel"
                    },
                    { text: "Yes", onPress: async() => {
                        // TODO VISHNU
                            if (await firebaseSvc.adminDeleteAnotherUser(defendant)) {
                                await firebaseSvc.deleteReport(props.route.params.id);
                                await Alert.alert('Report Deleted.', 'No action taken.');
                                props.navigation.navigate('Reports');
                            } else {
                                await Alert.alert('Failed to Delete', 'Check Logs');
                            }
                        }
                    }
                ])
            }}>
                <Text style={themes.textTheme(!isLight)}>Delete User Account</Text>
            </TouchableOpacity>
            </View>
            }
            {buttons &&
            <View>
            <TouchableOpacity 
                style={[{...styles.longButton, marginTop: '3%'}, themes.buttonTheme(isLight)]} 
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
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
                    ]);
            }}>
                <Text style={themes.textTheme(!isLight)}>No Action</Text>
            </TouchableOpacity>
            </View>
            }
            {buttons &&
            <View>
            <TouchableOpacity 
                style={[{...styles.longButton, marginTop: '3%'}, themes.buttonTheme(isLight)]} 
                onPress={() => {
                    props.navigation.navigate('User History', {defendant: props.route.params.defendant})
                }}
            >
                <Text style={themes.textTheme(!isLight)}>History</Text>
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

  