import React, {useState, useEffect} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity, Alert, Image, ScrollView, StyleSheet} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import {pickerStyles, buttonStyles, containerStyles, inputStyles, imageStyles} from '../../styles/LoginStyles'
import firebaseSvc from '../../firebase/FirebaseSvc';
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';
import ImageEditor from '@react-native-community/image-editor';
import * as ImageManipulator from 'expo-image-manipulator';
import { AntDesign } from '@expo/vector-icons';
import { EMPTY_AVATAR } from '../../constants/objects';

/**
 * Second Page of Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage2 Render Method
 */
export default function RegisterPage2(props) {

    let user = props.route.params.user;
    const emptyAvatar = 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc';

    // const user = initialState.user; User accessed from firebaseSvc
    const [avatar, setAvatar] = useState(EMPTY_AVATAR);
    const [hasAvatar, setHasAvatar] = useState(false);
    const [confirmation, setConfirmation] = useState(false);

    useEffect(() => {
        if(!hasAvatar) {
            setAvatar(EMPTY_AVATAR)
        } 
    })

    /**
     * Updates the given avatar (if any)
     * 
     * @param {*} avatar The URL to the avatar
     */
    const updateAvatar = (avatar) => {
        if (hasAvatar) {
            props.navigation.navigate('RegisterPage3', {...user, avatar: avatar});
        } else {
            //No Avatar selected
            //First we confirm choice
            if (!confirmation) {
                Alert.alert('Proceeding with no avatar!', 'If so, tap ok and click next again. Otherwise please retry selecting an avatar');
                setConfirmation(true);
            } else {
                props.navigation.navigate('RegisterPage3', {...user, avatar: emptyAvatar});

            }
        }
    };

    /**
     * Gets permissions for accessing image, and uploads to the database
     */
    const updateImage = () => {
        ImagePicker
        .requestMediaLibraryPermissionsAsync()
        .then(cameraRollPerm => {
          // only if user allows permission to camera roll
          if (cameraRollPerm.granted) {
            ImagePicker
            .launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [4, 3],
            })
            .then(pickerResult => {
                // console.log(
                // 'ready to upload... pickerResult json:\n' + JSON.stringify(pickerResult)
                // );
                let wantedMaxSize = 150;
                let rawHeight = pickerResult.height;
                let rawWidth = pickerResult.width;
                let ratio = rawWidth / rawHeight;
                let wantedWidth = wantedMaxSize;
                let wantedHeight = wantedMaxSize/ratio;
                // check vertical or horizontal
                if(rawHeight > rawWidth){
                    wantedWidth = wantedMaxSize*ratio;
                    wantedHeight = wantedMaxSize;
                }
                ImageManipulator
                .manipulateAsync(
                    pickerResult.uri,
                    [{crop:{
                        originX: 0, 
                        originY: 0 ,
                        width: pickerResult.width,
                        height: pickerResult.height,
                    }}
                ])
                .then(resized => {
                    const resizedUri = resized.uri;
                    // setAvatar(resizedUri);
                    firebaseSvc
                    .uploadImage(resizedUri)
                    .then(uploadURL => {
                        console.log("Set pic")
                        setHasAvatar(true);
                        setAvatar(uploadURL);
                        // firebaseSvc
                        // .updateAvatar(uploadURL)
                        // .then(() => console.log('Avatar Updated'))
                        // .catch(onFailure('Upload Image'))
                    })
                    .catch(onFailure('URI Upload'))
                    })
                .catch((err) => {
                    onFailure('Image Picking')
                    setHasAvatar(false)
                })
            })
            .catch(onFailure('Permissions'))
          } else {
              Alert.alert('We need permission to go further!');
          }
        })
        .catch(onFailure('Permission Retrieval Error'));
      };
    
    const whichText = hasAvatar => hasAvatar ? 'Nice Avatar!' : 'No avatar picked (Re-try if you have done so already)';
      
    return (
    <SafeAreaView style={{flex: 1}}>
        <Text style={inputStyles.headerText}>Complete your Profile!</Text> 
        {!hasAvatar && <Text numberOfLines={2} style={styles.caption}>Select a profile picture, {user.name}!</Text>}
        {hasAvatar && <Text numberOfLines={2} style={styles.caption}>Looking good, {user.name}!</Text>}
        {hasAvatar && <Text numberOfLines={2} style={styles.loading}>{'(Image might take a few seconds to load)'}</Text>}
        <View style={{marginBottom: '10%', marginTop: '20%'}}>
            {(<Image style={{...styles.profilePic, borderRadius: 120}} source={{uri:avatar}}/>)}
            <TouchableOpacity style={{borderColor: '#000000'}} onPress={() => {
                if(!hasAvatar) {
                    setHasAvatar(true)
                    updateImage()
                } else {
                    setHasAvatar(false)

                }
                }}>
            <AntDesign name={hasAvatar ? 'closecircle' : 'pluscircle'} size={36} color="#000000" style={styles.icon}></AntDesign>
            </TouchableOpacity>
        </View>

        
        {/* <TouchableOpacity style={buttonStyles.loginButton} onPress={setAvatar(EMPTY_AVATAR)}> //-> Cuasing 'Too many re-renders'! Need to fix 
            <Text style={buttonStyles.loginButtonText}>Clear Picture</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={{...buttonStyles.loginButton, marginTop: '20%'}} onPress={() => {
                updateImage()
                setHasAvatar(true)
                }}>
            <Text style={buttonStyles.loginButtonText}>{hasAvatar ? 'Change Picture' : 'Select Picture'}</Text>
        </TouchableOpacity>
        <View style={containerStyles.buttonRow}>
            <TouchableOpacity style={buttonStyles.tinyButton} onPress={() => props.navigation.goBack()}>
                <Text style={buttonStyles.loginButtonText}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={buttonStyles.tinyButton} 
                            onPress={
                                () => {
                                    console.log('Register Page 2 done!');
                                    updateAvatar(avatar);
                                }
                            }>
                <Text style={buttonStyles.loginButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    )};

    const styles = StyleSheet.create({
        profilePic: {
            width: 250,
            height: 250,
            alignSelf: 'center',
        },
        caption: {
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center',
            margin: '0%',
            marginVertical: '0%',
            marginBottom: '5%'
        },

        loading: {
            alignSelf: 'center',
            margin: '0%',
            marginVertical: '0%',
        },

        icon: {
            color: '#0aa859', 
            alignSelf: 'center',
            marginLeft: '45%',
            marginBottom: '0%',
            marginTop: '-12%'
        }
    })