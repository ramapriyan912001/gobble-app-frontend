import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import GobbleSelect from './GobbleSelect'
import GobbleSelect2 from './GobbleSelect2'
import {GobbleConfirm} from './GobbleConfirm'


const Stack = createStackNavigator();

export function GobbleNavigator() {
    return (
        <Stack.Navigator initialRouteName="GobbleSelect"
        headerMode={'none'}>
            <Stack.Screen name="GobbleSelect" component={GobbleSelect}></Stack.Screen>
            <Stack.Screen name="GobbleSelect2" component={GobbleSelect2}></Stack.Screen>
            <Stack.Screen name="GobbleConfirm" component={GobbleConfirm}></Stack.Screen>
        </Stack.Navigator>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(GobbleNavigator);
