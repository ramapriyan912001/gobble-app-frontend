import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData } from '../../redux/actions/actions'


export function Matches() {
    return (
        <View style={containerStyles.container}>
            <Text>Ongoing</Text>        
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(Matches);

const styles = StyleSheet.create({
    ongoingText: {
        
    },
    historyText: {

    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        flexBasis: 'row',
    }
})