import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import {pickerStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'

import firebaseSvc from '../reducers/FirebaseSvc';
import ImageEditor from '@react-native-community/image-editor';
import * as ImageManipulator from 'expo-image-manipulator';


export default function RegisterPage2(props) {
    const initialState = props.navigation.state.params;
    const user = initialState.user;
    const [avatar, setAvatar] = useState('');
    const [hasAvatar, setHasAvatar] = useState(false);

    
    //Handlers for Action Failure:
    const onFailure = (level) => (err) => Alert.alert(level + ' error ' + err.message);
    const onSuccess = (level) => () => console.log(level + ' successfully done');

    const creationSuccess = (userCredential) => {
        const cUser = userCredential.user;
        cUser
        .updateProfile({ displayName: user.name, name: user.name })
        .then(onSuccess('Updating Name'))
        .catch(onFailure('Name Update'));
        if (hasAvatar) {
            cUser
            .updateProfile({ 
                photoURL: avatar,
                avatar: avatar })
            .then(onSuccess('Updating Avatar'))
            .catch(onFailure('Avatar Update'));
        }
    };

    const addUser = (avatar, user) => firebaseSvc.createUser(user, avatar, creationSuccess, onFailure('createUserWithEmailAndPassword'));

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
                    // (uri) => resolve(uri),
                    // () => reject(),
                ])
                .then(resized => {
                    const resizedUri = resized.uri;
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
        .catch(onFailure);
      };

    return (
    <SafeAreaView>
        <Text style={pickerStyles.text}>{user.name}, pick out a nice picture of yourself!</Text>
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
                                        addUser(avatar, user);
                                        console.log('Register Page 2 done!');
                                        props.navigation.navigate('FinalStep');

                                }
                            }>
                <Text style={buttonStyles.loginButtonText}>Continue</Text>
            </TouchableOpacity>
        </View>
            <TouchableOpacity style={buttonStyles.loginButton} onPress={() => props.navigation.navigate('Login')}>
                <Text style={buttonStyles.loginButtonText}>Back to Login</Text>
            </TouchableOpacity>
    </SafeAreaView>
    )};