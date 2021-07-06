import React, {useState, useEffect} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity, Alert, Image, ScrollView, StyleSheet} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import {pickerStyles, buttonStyles, containerStyles, inputStyles, imageStyles} from '../../styles/LoginStyles'
import {styles} from '../../styles/RegisterStyles';
import themes from '../../styles/Themes';
import firebaseSvc from '../../firebase/FirebaseSvc';
import {onSuccess, onFailure, cancelRegistration, getError} from '../../services/RegistrationHandlers';
import ImageEditor from '@react-native-community/image-editor';
import * as ImageManipulator from 'expo-image-manipulator';
import { AntDesign } from '@expo/vector-icons';
import { EMPTY_AVATAR } from '../../constants/objects';
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';

/**
 * Second Page of Registration
 * 
 * @param {*} props Props from previous screen
 * @returns RegisterPage2 Render Method
 */
export default function RegisterPage2(props, {navigation}) {
    let user = props.route.params.user;
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    // const user = initialState.user; User accessed from firebaseSvc
    const [avatar, setAvatar] = useState(EMPTY_AVATAR);
    const [hasAvatar, setHasAvatar] = useState(false);
    const [confirmation, setConfirmation] = useState(false);

    useEffect(() => {
        if(!hasAvatar) {
            setAvatar(EMPTY_AVATAR)
        } 
    }, [navigation, avatar, hasAvatar])

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
                props.navigation.navigate('RegisterPage3', {...user, avatar: EMPTY_AVATAR});
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
                        setAvatar(resizedUri);
                        setHasAvatar(true);
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
    <SafeAreaView style={[styles.container, themes.containerTheme(isLight)]}>
        <Text style={[inputStyles.headerText, themes.textTheme(isLight)]}>Complete your Profile!</Text> 
        {!hasAvatar && <Text numberOfLines={2} style={[specificStyles.caption, themes.textTheme(isLight)]}>Select a profile picture, {user.name}!</Text>}
        {hasAvatar && <Text numberOfLines={2} style={[specificStyles.caption, themes.textTheme(isLight)]}>Looking good, {user.name}!</Text>}
        {hasAvatar && <Text numberOfLines={2} style={[specificStyles.loading, themes.textTheme(isLight)]}>{'(Image might take a few seconds to load)'}</Text>}
        <View style={{marginBottom: '0%', marginTop: '13%'}}>
            {(<Image style={{...specificStyles.profilePic, borderRadius: 120}} source={{uri:avatar}}/>)}
            <TouchableOpacity onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                if(!hasAvatar) {
                    setHasAvatar(true)
                    updateImage()
                } else {
                    setHasAvatar(false)
                }
                }}
                style={specificStyles.icon}>
            <AntDesign name={hasAvatar ? 'closecircle' : 'pluscircle'} size={36} color={themes.oppositeTheme(isLight)}></AntDesign>
            </TouchableOpacity>
        </View>
        <TouchableOpacity style={[{...styles.longButton, marginTop: '15%'}, themes.buttonTheme(isLight)]} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                updateImage()
                setHasAvatar(true)
                }}>
            <Text style={[buttonStyles.loginButtonText, themes.oppositeTextTheme(isLight)]}>{hasAvatar ? 'Change Picture' : 'Select Picture'}</Text>
        </TouchableOpacity>
        <View style={containerStyles.buttonRow}>
            <TouchableOpacity style={[styles.tinyButton, themes.buttonTheme(isLight)]} onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                props.navigation.goBack();
                }}>
                <Text style={[buttonStyles.loginButtonText, themes.oppositeTextTheme(isLight)]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tinyButton, themes.buttonTheme(isLight)]} 
                            onPress={
                                () => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small);
                                    console.log('Register Page 2 done!');
                                    updateAvatar(avatar);
                                }
                            }>
                <Text style={[buttonStyles.loginButtonText, themes.oppositeTextTheme(isLight)]}>Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    )};

    const specificStyles = StyleSheet.create({
        profilePic: {
            width: 250,
            height: 250,
            alignSelf: 'center',
        },
        caption: {
            fontSize: 18,
            fontWeight: 'bold',
            alignSelf: 'center',
        },

        loading: {
            alignSelf: 'center',
            marginBottom:'-6%'
        },

        icon: {
            alignSelf: 'center',
            marginLeft: '45%',
            marginRight:'2%',
            marginBottom: '7%',
            marginTop: '-11%'
        },
    })