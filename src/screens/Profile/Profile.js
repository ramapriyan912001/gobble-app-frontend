
import React, {useEffect, useState, useRef} from 'react'
import {Text, Image, TouchableOpacity, TouchableHighlight, SafeAreaView, Alert, View, Platform, ScrollView} from 'react-native'
import {StatusBar} from 'expo-status-bar'
import {inputStyles, buttonStyles, profileStyles, containerStyles} from '../../styles/LoginStyles'
import { getError, onSuccess, onFailure } from '../../services/RegistrationHandlers'
import firebaseSvc from '../../firebase/FirebaseSvc'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../../redux/actions/actions'
import { INDUSTRY_CODES } from '../../constants/objects'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PersonalDetails from '../PersonalDetails'
import { Avatar } from 'react-native-elements'
import MealPreferences from '../MealPreferences'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Header } from 'react-native-elements'
import { DrawerActions } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

// props.navigation.dispatch(DrawerActions.closeDrawer());


const Tab = createMaterialTopTabNavigator();
import themes from '../../styles/Themes';
import { styles } from '../../styles/ProfileStyles'
import * as Haptics from 'expo-haptics';
import { useColorScheme } from 'react-native-appearance';
import { AntDesign } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

/**
 * User Profile Page
 * 
 * @param {*} props Props from previous screen
 * @returns Profile Render Method
 */
function Profile(props, {navigation}) {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
    });
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const [userInfo, setUserInfo] = useState({});
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(true);

    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    
    function getAge(dateString) {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    /**
     * Asynchronous FUnction to load Profile Data
     */
    async function loadDataAsync () {
        try {
            await props.fetchUserData();
            setLoading(false);
            setUserInfo(props.currentUserData);
            if (userInfo === null) {
                props.navigation.goBack();
            }
        } catch (err) {
            console.log('Profile Fetch User Error:', err.message);
        }
    }

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
                .then(async(resized) => {
                    const resizedUri = resized.uri;
                    await firebaseSvc
                    .changeAvatar(resizedUri)
                    setChange(!change);
                })
                .catch((err) => {
                    onFailure('Image Picking')
                })
            })
            .catch(onFailure('Permissions'))
          } else {
              Alert.alert('We need permission to go further!');
          }
        })
        .catch(onFailure('Permission Retrieval Error'));
      };

      async function registerForPushNotificationsAsync() {
        let token;
        if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
        } else {
          alert('Must use physical device for Push Notifications');
        }
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        return token;
      }
    useEffect(() => {
        loadDataAsync();
        registerForPushNotificationsAsync().then(token => {
            setExpoPushToken(token)
            firebaseSvc.addPushToken(token);
            console.log("after adding push token")
        });
      
          // This listener is fired whenever a notification is received while the app is foregrounded
          notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
          });
      
          // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
          responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
          });
      
          return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
          };
    },[change, navigation]);

    const drawerMargin = Platform.OS === 'ios' ? '2%' : '10%';
if (loading) {
    return (
        <SafeAreaView style={[styles.container, themes.containerTheme(isLight)]}>
            <Text style={[themes.textTheme(isLight), {fontWeight:'bold', fontSize:25}]}>Hang on a sec</Text>
        </SafeAreaView>
    );
} else {
        return(
        <SafeAreaView style={[styles.container, themes.containerTheme(isLight)]}>
            <ScrollView contentContainerStyle={{paddingBottom:'5%'}}>
            <StatusBar style="auto"/>
            <TouchableOpacity style={{marginTop: drawerMargin}} onPress={() => {
                props.navigation.dispatch(DrawerActions.openDrawer)}}>
                <Ionicons name="menu-outline" style={{alignSelf: 'flex-start', marginLeft: '5%', color:themes.oppositeTheme(isLight)}} size={30}></Ionicons>
            </TouchableOpacity>
            <View style={{marginTop:'-6%'}}>
                <Image style={{...profileStyles.profilePic, width: 120, height: 125, marginTop: '10%', marginBottom: '0%', borderRadius: 60}}  source={{uri: props.currentUserData.avatar}}/>
                <TouchableOpacity onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Small)
                    updateImage();
                }}
                    style={{alignSelf: 'center', marginLeft: '23%',
                    marginRight:'1.8%',
                    marginBottom: '1.5%',
                    marginTop: '-6.5%'}}>
                <AntDesign name='pluscircle' style={{marginLeft:'4%'}} size={20} color={themes.oppositeTheme(isLight)}></AntDesign>
                </TouchableOpacity>
            </View>
            <Text style={[{...inputStyles.headerText, fontWeight:'400', marginBottom: '0%',fontSize: 26}, themes.textTheme(isLight)]}>{`${props.currentUserData.name}, ${getAge(props.currentUserData.dob)}`}</Text>
            <Text style={[{...inputStyles.headerText, fontWeight: '300', marginBottom: '2%',fontSize: 16}, themes.textTheme(isLight)]}>{`${INDUSTRY_CODES[props.currentUserData.industry]}`}</Text>
            <Tab.Navigator 
                initialRouteName="Ongoing" 
                style={{marginTop: '0%',paddingTop:'0%', backgroundColor:themes.oppositeTheme(!isLight)}}
                tabBarOptions={{
                    activeTintColor:themes.oppositeTheme(isLight),
                    inactiveTintColor:themes.editTheme(!isLight),
                    style: {
                        backgroundColor:'transparent',
                        borderColor: 'transparent'
                    }
                }}
            >
            <Tab.Screen name="Personal Details" component={PersonalDetails}  />
            <Tab.Screen name="Meal Preferences" component={MealPreferences} />
            </Tab.Navigator>
            </ScrollView>
        </SafeAreaView>
    );  }
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Profile);
