import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchAuthUser, clearData } from '../../redux/actions/actions'
import {createStackNavigator} from '@react-navigation/stack'
import GobbleSelect from './GobbleSelect'
import {GobbleConfirm} from './GobbleConfirm'
import GobbleSelect2 from './GobbleSelect2'
import { useColorScheme } from 'react-native-appearance';
import themes from '../../styles/Themes';
import DestinationSearch from '../../components/DestinationSearch'

const Stack = createStackNavigator();

/**
 * Navigate between GobbleSelect, and GobbleConfirm
 * 
 * @returns Stack Navigator
 */
export function GobbleNavigator() {
    const colorScheme = useColorScheme();
    const isLight = colorScheme === 'light';
    return (
        <Stack.Navigator initialRouteName="GobbleSelect">
            <Stack.Screen name="GobbleSelect"
                options={
                {
                    headerLeft: () => null,
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Find a Match!', 
                    headerBackTitle: 'Back', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
                }} component={GobbleSelect}></Stack.Screen>
            <Stack.Screen name="GobbleConfirm" options={{
                    headerLeft: () => null,
                    headerShown:true,
                    headerBackTitleVisible: false, 
                    headerTitle: 'Find a Match!', 
                    headerBackTitle: 'Back', 
                    headerStyle:{
                        backgroundColor: themes.oppositeTheme(!isLight),
                    },
                    headerTintColor:themes.oppositeTheme(isLight)
                }} component={GobbleConfirm}></Stack.Screen>
        </Stack.Navigator>
    )
}

const mapStateToProps = (store) => ({
    currentUserData: store.userState.currentUserData
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchAuthUser, clearData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(GobbleNavigator);
