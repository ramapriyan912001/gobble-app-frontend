import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import {Input} from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { onSuccess, onFailure } from '../services/RegistrationHandlers'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
import {inputStyles, buttonStyles} from '../styles/LoginStyles'
import {INDUSTRY_CODES, CUISINES, DIETS} from '../constants/objects'
import firebaseSvc from '../firebase/FirebaseSvc'
import PickerModal from 'react-native-picker-modal-view';

/**
 * The Tab to show the user's Meal Preferences
 * 
 * @param {*} props Props from previous screen
 * @returns MealPreferences Render Method
 */
function MealPreferences(props) {

    const [cuisinePreference, setCuisinePreference] = useState('')
    const [diet, setDiet] = useState('')
    const [industryPreference, setIndustryPreference] = useState('')
    const [industry, setIndustry] = useState('')
    const [edit, setEdit] = useState(false);
    let editState = {
        cuisine: props.currentUserData.cuisine,
        diet: props.currentUserData.diet,
        industryPreference: props.currentUserData.crossIndustrial,
        industry: props.currentUserData.industry
    };

    useEffect(() => {
        setCuisinePreference(props.currentUserData.cuisine)
        setDiet(props.currentUserData.diet)
        setIndustryPreference(props.currentUserData.crossIndustrial ? 'Any' : INDUSTRY_CODES[props.currentUserData.industry])
        setIndustry(INDUSTRY_CODES[props.currentUserData.industry])
    })

    const signOutSuccess = () => {
        console.log('Signed Out');
        props.navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
        });
    }

    const cuisineLabels = (() => {
        let i = 0;
        return CUISINES.map(cuisine => {
            return {Id: i++, Name: cuisine, Value: cuisine};
        });
    })();

    const dietLabels = (() => {
        let i = 0;
        return DIETS.map(diet => {
            return {Id: i++, Name: diet, Value: diet};
        });
    })();

    const industryLabels = (() => {
        let industries = [];
        for (let [key, value] in Object.entries(INDUSTRY_CODES)) {
            industries.push({
                Id: key,
                Name: INDUSTRY_CODES[key],
                Value: key
            });
        }
        return industries;
    })();

    const updatePreferences = async () => {
        await firebaseSvc.getCurrentUserCollection(
            user => user.val(),
            err => console.log('EditProfile GetUser Error:', err.message)
        )
        .then(user => {
            user['cuisine'] = editState.cuisine;
            user['diet'] = editState.diet;
            user['industry'] = editState.industry;
            user['crossIndustrial'] = editState.industryPreference;
            firebaseSvc.updateCurrentUserCollection(user, onSuccess('User Collection Update'), onFailure('User Collection Update'));
            setEdit(false);
        })
        .catch(err => console.log('EditProfile UpdateUser Error:', err.message))
    };

    const signOutFailure = (err) => {
        console.log('Sign Out Error: ' + err.message);
        Alert.alert('Sign Out Error. Try Again Later');
    }
    
    const signOutUser = () => firebaseSvc.signOut(signOutSuccess, signOutFailure);
    if (edit) {
        return (
            <View style={styles.container}>
                {/* <Text style={inputStyles.subText}>Click on any button to edit</Text> */}
                <View style={styles.item}>
                <PickerModal
                    renderSelectView={(disabled, selected, showCuisineModal) => 
                        (<TouchableOpacity disabled={disabled} onPress={showCuisineModal} style={styles.smallButton}>
                            <Text>{editState.cuisine}</Text>
                        </TouchableOpacity>)
                    }
                    onSelected={(selected) => {
                        if (Object.keys(selected).length > 0) {
                            // let newState = editState;
                            editState['cuisine'] = selected.Value;
                            setCuisinePreference(selected.Value);
                            // setEditState(newState);
                        }
                        return selected;
                    }}
                    items={cuisineLabels}
                />
                <PickerModal
                    renderSelectView={(disabled, selected, showDietModal) => 
                        <TouchableOpacity disabled={disabled} onPress={showDietModal} style={styles.smallButton}>
                            <Text>{diet}</Text>
                        </TouchableOpacity>
                    }
                    onSelected={(selected) => {
                        if (Object.keys(selected).length > 0) {
                            // let newState = editState;
                            editState['diet'] = selected.Value;
                            // setEditState(newState);
                        }
                        return selected;
                    }}
                    items={dietLabels}
                />
                </View>
                <View style={styles.item}>
                <PickerModal
                    renderSelectView={(disabled, selected, showCrossModal) => 
                        <TouchableOpacity disabled={disabled} onPress={showCrossModal} style={styles.smallButton}>
                            <Text>{industryPreference}</Text>
                        </TouchableOpacity>
                    }
                    onSelected={(selected) => {
                        if (Object.keys(selected).length > 0) {
                            // let newState = editState;
                            editState['industryPreference'] = selected.Value;
                            setDiet()
                            // setEditState(newState);
                        }
                        return selected;
                    }}
                    items={[
                        {
                            Id: 0,
                            Name: 'Match with any Industry',
                            Value: true
                        },
                        {
                            Id: 1,
                            Name: 'Match only within my Industry',
                            Value: false
                        }
                    ]}
                />
                <PickerModal
                    renderSelectView={(disabled, selected, showIndustryModal) => 
                        <TouchableOpacity disabled={disabled} onPress={showIndustryModal} style={styles.smallButton}>
                            <Text>{industry}</Text>
                        </TouchableOpacity>
                    }
                    onSelected={(selected) => {
                        if (Object.keys(selected).length > 0) {
                            // let newState = editState;
                            editState['industry'] = selected.Value;
                            // setEditState(newState);
                        }
                        return selected;
                    }}
                    items={industryLabels}
                />
                </View>
                <View style={{marginLeft: '7.5%'}}>
                        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                            console.log("Changing Preferences");
                            updatePreferences();
                            setEdit(false);
                            // props.navigation.navigate('UpdateProfile')
                        }}>
                            <Text style={buttonStyles.loginButtonText}>Confirm</Text>
                        </TouchableOpacity>
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <View style={{...styles.item}}>
                <Input label='Cuisine' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderBottomColor: '#000000', borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={cuisinePreference} editable={false}></Input>
                <Input scrollEnabled={true} label='Diet' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: '#000000', borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={diet} editable={false}></Input>
                </View>
                <View style={styles.item}>
                <Input label='Industry Preference' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#000000", borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={industryPreference} editable={false}></Input>
                <Input label='Industry' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#000000", borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={industry} editable={false}></Input>
                </View>
                <View style={{marginLeft: '7.5%'}}>
                        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                            console.log("Editing Preferences")
                            setEdit(true);
                            // props.navigation.navigate('UpdateProfile')
                        }}>
                            <Text style={buttonStyles.loginButtonText}>Edit Preferences</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                            signOutUser();
                            props.navigation.navigate('Login')}}>
                            <Text style={buttonStyles.loginButtonText}>Sign Out</Text>
                        </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start' // if you want to fill rows left to right
    },
    item: {
      width: '50%', // is 50% of container width
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '5%'
    },
    smallButton: {
        width:165,
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop: '5%',
        backgroundColor:"#0aa859",
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 9,
        elevation: 5,
    },
})

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(MealPreferences);
