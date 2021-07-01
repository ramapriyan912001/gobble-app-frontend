import React, {useState, useEffect} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity, Alert, Image, ScrollView, StyleSheet} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import {pickerStyles, buttonStyles, containerStyles, inputStyles, imageStyles} from '../../styles/LoginStyles'
import firebaseSvc from '../../firebase/FirebaseSvc';
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';
import ImageEditor from '@react-native-community/image-editor';
import * as ImageManipulator from 'expo-image-manipulator';
import Ionicons from '@expo/vector-icons/Ionicons'

/**
 * Second Page of Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage2 Render Method
 */
export default function RegisterPage2(props) {
    const name = props.route.params.name;
    const emptyAvatar = 'https://firebasestorage.googleapis.com/v0/b/gobble-b3dfa.appspot.com/o/avatar%2Fempty_avatar.png?alt=media&token=c36c29b3-d90b-481f-a9d9-24bc73619ddc';
    // const user = initialState.user; User accessed from firebaseSvc
    const [avatar, setAvatar] = useState(emptyAvatar);
    const [hasAvatar, setHasAvatar] = useState(false);
    const [confirmation, setConfirmation] = useState(false);

    useEffect(() => {
        
    }, [avatar])

    /**
     * Updates the given avatar (if any)
     * 
     * @param {*} avatar The URL to the avatar
     */
    const updateAvatar = (avatar) => {
        if (hasAvatar) {
            firebaseSvc
            .getCurrentUserCollection(
                (snapshot) => snapshot.val(),
                getError(props))
            .then(userProfile => {
                userProfile['avatar'] = avatar;
                firebaseSvc.updateCurrentUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
                firebaseSvc.updateAvatar(avatar);
            })
            .catch(getError(props));
            props.navigation.navigate('RegisterPage3');
        } else {
            //No Avatar selected
            //First we confirm choice
            if (!confirmation) {
                Alert.alert('Proceeding with no avatar!', 'If so, tap ok and click next again. Otherwise please retry selecting an avatar');
                setConfirmation(true);
            } else {
                firebaseSvc
                .getCurrentUserCollection(
                    (snapshot) => snapshot.val(),
                    getError(props))
                .then(userProfile => {
                    userProfile['avatar'] = emptyAvatar;
                    firebaseSvc.updateCurrentUserCollection(userProfile, onSuccess('User Collection Update'), onFailure('User Collection Update'));
                    firebaseSvc.updateAvatar(emptyAvatar);
                })
                .catch(getError(props));
                props.navigation.navigate('RegisterPage3');
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
                        setAvatar(uploadURL);
                        setHasAvatar(true);
                        // firebaseSvc
                        // .updateAvatar(uploadURL)
                        // .then(() => console.log('Avatar Updated'))
                        // .catch(onFailure('Upload Image'))
                    })
                    .catch(onFailure('URI Upload'))
                    })
                .catch(onFailure('Image Picking'))
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
        {!hasAvatar && <Text style={pickerStyles.text}>{name}, pick out a nice picture of yourself!</Text>}
        <Text style={styles.caption}>{whichText(hasAvatar)}</Text>
        {hasAvatar && (<Image style={{...styles.profilePic, borderRadius: 120}} source={{uri:avatar}}/>)}
        <TouchableOpacity style={{borderColor: '#000000'}}>
            <Ionicons name="close-circle-outline" size={48} color="#000000" style={{ marginTop: 6, marginLeft: 2 }}></Ionicons>
        </TouchableOpacity>
        <TouchableOpacity style={{borderColor: '#000000'}}>
            <Ionicons name="add-circle-outline" size={48} color="#000000" style={{ marginTop: 6, marginLeft: 2 }}></Ionicons>
        </TouchableOpacity>
        {/* <TouchableOpacity style={buttonStyles.loginButton} onPress={setAvatar(emptyAvatar)}> //-> Cuasing 'Too many re-renders'! Need to fix 
            <Text style={buttonStyles.loginButtonText}>Clear Picture</Text>
        </TouchableOpacity> */}
        <TouchableOpacity style={buttonStyles.loginButton} onPress={updateImage}>
            <Text style={buttonStyles.loginButtonText}>Select Picture</Text>
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
            width: '60%',
            height: '30%',
            marginBottom: '10%',
            marginLeft: '20%',
            marginTop: '-5%'
        },
        caption: {
            fontSize: 20,
            fontWeight: 'bold',
            alignSelf: 'center',
            margin: '5%',
            marginVertical: '10%'
        },

        cross: {
            backgroundColor: "#41444B",
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 60,
            height: 60,
            borderRadius: 30,
            alignItems: "center",
            justifyContent: "center"
        }
    })