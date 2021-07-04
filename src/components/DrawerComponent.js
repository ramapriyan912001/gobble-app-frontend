import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import {
    DrawerContentScrollView,
    DrawerItemList,
    DrawerItem
  } from '@react-navigation/drawer';
import { profileStyles, inputStyles } from '../styles/LoginStyles';
import { INDUSTRY_CODES } from '../constants/objects';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, fetchUserData } from '../redux/actions/actions'
import { Ionicons } from '@expo/vector-icons';
  
function DrawerComponent(props) {
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
    return (
      <DrawerContentScrollView {...props}>
        <View style={{marginBottom: '5%', marginTop: '0%', borderBottomWidth: 1, paddingBottom: 5, borderBottomColor: '#008a49'}}>
        <Image style={{...profileStyles.profilePic, width: 120, height: 125, marginTop: '10%', marginBottom: '0%', borderRadius: 60}}  source={{uri: props.currentUserData.avatar}}/>
        <Text style={{...inputStyles.headerText, fontWeight:'400', marginBottom: '0%',fontSize: 22}}>{`${props.currentUserData.name}, ${getAge(props.currentUserData.dob)}`}</Text>
        <Text style={{...inputStyles.headerText, fontWeight: '300', marginBottom: '2%',fontSize: 16}}>{`${INDUSTRY_CODES[props.currentUserData.industry]}`}</Text>
        </View>

        {/* All the navs defined earlier, goes within Bottom tabs effectively*/}
        <DrawerItemList {...props} />

        {/* Adding a nav to go outside of the bottom tabs*/}
        <DrawerItem
        icon= {({ focused, color, size }) => <Ionicons color={color} size={size} name={focused ? 'information-circle' : 'information-circle-outline'} />}
        label="Test"
        onPress={() => props.navigation.navigate('Test')}
        />
      </DrawerContentScrollView>
    );
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(DrawerComponent);
