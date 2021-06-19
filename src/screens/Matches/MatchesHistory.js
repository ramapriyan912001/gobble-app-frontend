import React from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {containerStyles} from '../../styles/LoginStyles'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, clearData } from '../../redux/actions/actions'


export function MatchesHistory() {
    return (
        <View style={containerStyles.container}>
            <Text>MatchesHistory</Text>        
        </View>
    )
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    loggedIn: store.userState.loggedIn,
    isAdmin: store.userState.isAdmin
})
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUser }, dispatch);
export default connect(mapStateToProps, mapDispatchToProps)(MatchesHistory);

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