import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData } from '../../actions/index'
import {createStackNavigator} from '@react-navigation/stack'
import {GobbleSelect} from './GobbleSelect'
import {GobbleConfirm} from './GobbleConfirm'


const Stack = createStackNavigator();

export function GobbleNavigator() {
    return (
        <Stack.Navigator initialRouteName="GobbleSelect">
            <Stack.Screen name="GobbleSelect" component={GobbleSelect}></Stack.Screen>
            <Stack.Screen name="GobbleConfirm" component={GobbleConfirm}></Stack.Screen>
        </Stack.Navigator>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(GobbleNavigator);