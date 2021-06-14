import React from 'react'
import {View, Text} from 'react-native'
import {containerStyles} from '../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData } from '../redux/actions/index'

export function Matches() {
    return (
        <View style={containerStyles.container}>
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(Matches);