import React, {useState} from 'react'
import {Text, View, SafeAreaView, TouchableOpacity, Alert} from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import {pickerStyles, buttonStyles, containerStyles} from '../styles/LoginStyles'
import firebaseSvc from '../reducers/FirebaseSvc';
import ImageEditor from '@react-native-community/image-editor';


export default function RegisterPage2(props) {
    const initialState = props.navigation.state.params;
    const user = initialState.user;
    const name = user.name;
    const [avatar, setAvatar] = useState('');
    
    //Handlers for Action Failure:
    const onFailure = (level) => (err) => Alert.alert(level + 'error' + err.message);

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
                console.log(
                'ready to upload... pickerResult json:' + JSON.stringify(pickerResult)
                );
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
                new Promise((resolve, reject) => {
                ImageEditor.cropImage(
                    pickerResult.uri,
                    {
                        offset: { x: 0, y: 0 },
                        size: { width: pickerResult.width, height: pickerResult.height },
                        displaySize: { width: wantedWidth, height: wantedHeight },
                        resizeMode: 'contain',
                    },
                    (uri) => resolve(uri),
                    () => reject(),
                );
                })
                .then(resizedUri => {
                    firebaseSvc
                    .uploadImage(resizedUri)
                    .then(uploadURL => {
                        setAvatar(uploadURL);
                        firebaseSvc
                        .updateAvatar(uploadUrl)
                        .then(() => console.log('Avatar Updated'))
                        .catch(onFailure('Upload Image'))
                    })
                    .catch(onFailure('URI Resizing'))
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
        <Text style={pickerStyles.text}>{name}, pick out a nice picture of yourself!</Text>
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
                                        props.navigation.navigate('ChatRoom', {state: initialState});
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