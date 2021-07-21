import React, {useEffect, useState} from 'react'
import { Text, View, SafeAreaView, Platform, ScrollView, Alert, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
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
        <ScrollView scrollEnabled={true} style={themes.containerTheme(isLight)} contentContainerStyle={Platform.OS == 'android'? {flex:1}:{}}>
            <View style={Platform.OS == 'ios' ? {marginTop: '3%',} : {marginTop: '1%'}}>
                <Text style={[specificStyles.headerText, themes.textTheme(isLight)]}>Why do you wish to report the user?</Text>
                <TextInput
                style={[{...specificStyles.input, borderColor:themes.editTheme(!isLight)}, themes.textTheme(isLight)]}
                textAlignVertical='top'
                autoCapitalize='sentences'
                multiline
                editable={false}
                placeholder='Give a short description of why you believe the user should be reported.'
                placeholderTextColor={themes.oppositeTheme(isLight)}
                value={reason}
                />
            </View>
            <View style={Platform.OS == 'ios' ? {marginTop: '-8%', marginLeft:'0%', marginRight: '1%', marginBottom:'45%'} : {marginTop: '-18%', paddingRight: '5%'}}>
                <Text style={[specificStyles.headerText, themes.textTheme(isLight)]}>Please describe why you wish to report this user.</Text>
                <TextInput
                style={[{...specificStyles.input, borderColor:themes.editTheme(!isLight)}, themes.textTheme(isLight)]}
                textAlignVertical='top'
                autoCapitalize='sentences'
                multiline
                editable={false}
                placeholderTextColor={themes.oppositeTheme(isLight)}
                placeholder='Give a short description of why you believe the user should be reported.'
                value={text}
                />
            </View>
            {buttons &&
                <View style={Platform.OS == 'android'?{marginTop: '-10%'}:{marginTop:'-17%'}}>
                    <Text style={[{...specificStyles.headerText,marginLeft:'3%',  fontSize:20, marginTop: '-10%'}, themes.textTheme(isLight)]}>
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
                            const success = await firebaseSvc.adminDeleteAnotherUser(defendant);
                            if (success) {
                                await firebaseSvc.deleteReport(props.route.params.id);
                                await Alert.alert('Report Deleted.', 'User Deleted.');
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
        </ScrollView>
    )
}

const specificStyles = StyleSheet.create({
    input: {
        alignSelf: 'center', 
        height: '20%', 
        width: '90%',
        paddingLeft:'3%',
        borderWidth: 1 },
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

  