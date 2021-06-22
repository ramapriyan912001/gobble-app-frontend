import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../redux/actions/actions'

function Matches() {
    return (
        <View style={containerStyles.container}>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Matches);
