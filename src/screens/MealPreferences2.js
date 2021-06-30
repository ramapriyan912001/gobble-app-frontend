import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import {Input} from 'react-native-elements'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { onSuccess, onFailure } from '../services/RegistrationHandlers'
import { fetchAuthUser, fetchUserData, updateCurrentUserCollection } from '../redux/actions/actions'
import {inputStyles, buttonStyles} from '../styles/LoginStyles'
import {INDUSTRY_CODES, CUISINES, DIETS} from '../constants/objects'
import firebaseSvc from '../firebase/FirebaseSvc'
import PickerModal from 'react-native-picker-modal-view';
import { set } from 'react-native-reanimated'
/**
 * The Tab to show the user's Meal Preferences
 * 
 * @param {*} props Props from previous screen
 * @returns MealPreferences Render Method
 */
function MealPreferences2(props) {

    const [cuisine, setCuisine] = useState('')
    const [diet, setDiet] = useState('')
    const [industry, setIndustry] = useState(50)
    const [crossIndustrial, setCrossIndustrial] = useState(false)
    const [industryPreference, setIndustryPreference] = useState('')
    const [edit, setEdit] = useState(false);

    const setState = () => {
        setCuisine(props.currentUserData.cuisine)
        setDiet(props.currentUserData.diet)
        setIndustry(props.currentUserData.industry)
        setCrossIndustrial(props.currentUserData.crossIndustrial)
        setIndustryPreference(props.currentUserData.crossIndustrial ? 'Any' : INDUSTRY_CODES[props.currentUserData.industry])
    }

    useEffect(() => {
        if(!edit) {
            setCuisine(props.currentUserData.cuisine)
            setDiet(props.currentUserData.diet)
            setIndustry(props.currentUserData.industry)
            setCrossIndustrial(props.currentUserData.crossIndustrial)
            setIndustryPreference(props.currentUserData.crossIndustrial ? 'Any' : INDUSTRY_CODES[props.currentUserData.industry])
        }
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
                        <TouchableOpacity onPress={showCuisineModal} style={{width: '100%'}}>
                            <Input label='Cuisine' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderBottomColor: '#000000', borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={cuisine} editable={false}></Input>
                        </TouchableOpacity>
                    }
                    onSelected={(selected) => {
                        if (Object.keys(selected).length > 0) {
                            setCuisine(selected.Value)
                        }
                        return selected;
                    }}
                    items={cuisineLabels}
                />
                <PickerModal
                    renderSelectView={(disabled, selected, showDietModal) => 
                        <TouchableOpacity onPress={showDietModal} style={{width: '100%'}}>
                            <Input scrollEnabled={true} label='Diet' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: '#000000', borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={diet} editable={false}></Input>
                        </TouchableOpacity>
                    }
                    onSelected={(selected) => {
                        if (Object.keys(selected).length > 0) {
                            setDiet(selected.Value)
                        }
                        return selected;
                    }}
                    items={dietLabels}
                />
                </View>
                <View style={styles.item}>
                <PickerModal
                    renderSelectView={(disabled, selected, showCrossModal) => 
                        <TouchableOpacity onPress={showCrossModal} style={{width: '100%'}}>
                            <Input label='Industry Preference' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#000000", borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={industryPreference} editable={false}></Input>
                        </TouchableOpacity>
                    }
                    onSelected={(selected) => {
                        if (Object.keys(selected).length > 0) {
                            setCrossIndustrial(selected.Value)
                            if(selected.Value) {
                                setIndustryPreference('Any')
                            } else {
                                setIndustryPreference(industry)
                            }
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
                        <TouchableOpacity onPress={showIndustryModal} style={{width: '100%'}}>
                        <Input label='Industry' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#000000", borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={INDUSTRY_CODES[industry]} editable={false}></Input>
                        </TouchableOpacity>
                        }
                    onSelected={(selected) => {
                        if (Object.keys(selected).length > 0) {
                            setIndustry(selected.Value)
                            if(crossIndustrial) {
                                setIndustryPreference('Any')
                            } else {
                                setIndustryPreference(INDUSTRY_CODES[selected.Value])
                            }
            
                        }
                        return selected;
                    }}
                    items={industryLabels}
                />
                </View>
                <View style={{marginLeft: '7.5%', marginTop: '5%'}}>
                        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                            console.log("Changing Preferences");
                            props.updateCurrentUserCollection({...props.currentUserData, cuisine: cuisine, diet: diet, industry: industry, crossIndustrial: crossIndustrial})
                            setEdit(false);
                        }}>
                            <Text style={buttonStyles.loginButtonText}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={buttonStyles.loginButton} onPress={() => {
                           setEdit(false);
                           setState();
                        }}>
                            <Text style={buttonStyles.loginButtonText}>Discard Changes</Text>
                        </TouchableOpacity>
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <View style={{...styles.item}}>
                <Input label='Cuisine' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderBottomColor: '#000000', borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={cuisine} editable={false}></Input>
                <Input scrollEnabled={true} label='Diet' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: '#000000', borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={diet} editable={false}></Input>
                </View>
                <View style={styles.item}>
                <Input label='Industry Preference' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#000000", borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={industryPreference} editable={false}></Input>
                <Input label='Industry' labelStyle={{justifyContent: 'center', color:'#000000', alignSelf: 'center', borderColor: "#000000", borderBottomWidth: 1}} style={{width: 5, margin:0, padding:0, textAlign:'center'}} value={INDUSTRY_CODES[industry]} editable={false}></Input>
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
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData, updateCurrentUserCollection }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(MealPreferences2);