import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import GobbleSelect from './GobbleSelect'
import GobbleSelect2 from './GobbleSelect2'
import {GobbleConfirm} from './GobbleConfirm'

const Stack = createStackNavigator();

/**
 * Navigate between GobbleSelect, GobbleSelect2, and GobbleConfirm
 * 
 * @returns Stack Navigator
 */
export function GobbleNavigator() {
    return (
        <Stack.Navigator initialRouteName="GobbleSelect">
            <Stack.Screen name="GobbleSelect" options={{headerShown:false}} component={GobbleSelect}></Stack.Screen>
            <Stack.Screen name="GobbleSelect2" options={{headerShown:false}} component={GobbleSelect2}></Stack.Screen>
            <Stack.Screen name="GobbleConfirm" options={{headerShown:false}} component={GobbleConfirm}></Stack.Screen>
        </Stack.Navigator>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(GobbleNavigator);
