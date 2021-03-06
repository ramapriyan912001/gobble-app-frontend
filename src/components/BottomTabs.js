import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GobbleNavigator from '../screens/Gobble/GobbleNavigator'
import { ChatNavigator } from '../screens/Chats/ChatNavigator';
import Ionicons from '@expo/vector-icons/Ionicons'
import MatchesNavigator from '../screens/Matches/MatchesNavigator';
import { useColorScheme } from 'react-native-appearance';
import themes from '.././styles/Themes';
import { FontAwesome5 } from '@expo/vector-icons';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserData, giveAdminAccess, removeAdminAccess } from '../redux/actions/actions'
import AdminNavigator from '../screens/AdminNavigator';
import firebaseSvc from '../firebase/FirebaseSvc';
import ProfileDrawer from './ProfileDrawer';

const Tab = createBottomTabNavigator();

function BottomTabs(props, {navigation}) {
  const [change, setChange] = useState(false)

  async function loadDataAsync() {
    try{
      let isAdmin = await firebaseSvc.isAdmin();
      if(isAdmin) {
        props.giveAdminAccess();
      } else {
        props.removeAdminAccess();
      }
    } catch(err) {
      console.log(err)
    }
  }
  useEffect(() => {
    loadDataAsync();
  }, [navigation])


  const colorScheme = useColorScheme();
  const isLight = colorScheme == 'light';
    return (
        <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
  
              if (route.name === 'ProfileDrawer') {
                iconName = focused
                  ? 'person'
                  : 'person-outline';
              } else if (route.name === 'GobbleNavigator') {
                iconName = focused ? 'md-fast-food' : 'md-fast-food-outline';
              } else if (route.name === 'Chatroom') {
                  iconName = focused ? 'chatbubble-sharp' : 'chatbubble-outline'
              } else if (route.name == 'MatchesNavigator'){
                  iconName = focused ? 'clipboard-sharp' : 'clipboard-outline'
              } else {
                  iconName = 'user-secret'
                  return <FontAwesome5 name={iconName} size={size} color={color} />
              }
  
              // You can return any component that you like here!
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        initialRouteName="Profile"
        order={['Profile', 'Gobble', 'Matches', 'Chats']}
        backBehavior= "order"
        tabBarOptions= {{
          activeBackgroundColor: themes.editTheme(isLight),
          inactiveBackgroundColor: themes.oppositeTheme(!isLight),
          activeTintColor: themes.oppositeTheme(isLight),
          inactiveTintColor: themes.oppositeTheme(isLight),
          // labelPosition: 'below-icon',
          showLabel: false,
          adaptive: true,
          style: themes.containerTheme(isLight)
        }}>
            <Tab.Screen options={{
                title: "Profile"
            }} name="ProfileDrawer" component={ProfileDrawer}></Tab.Screen>
            <Tab.Screen options={{
                title: "Gobble"
                }} name="GobbleNavigator" component={GobbleNavigator}></Tab.Screen>
            <Tab.Screen name="MatchesNavigator" options={{
              title: "Matches"
            }} component={MatchesNavigator}></Tab.Screen>
            <Tab.Screen name="Chatroom" component={ChatNavigator}></Tab.Screen>
            {props.isAdmin && 
            <Tab.Screen name="Admin" component={AdminNavigator}></Tab.Screen>}
        </Tab.Navigator>
    )
}

const mapStateToProps = (store) => ({
  currentUserData: store.userState.currentUserData,
  loggedIn: store.userState.loggedIn,
  isAdmin: store.userState.isAdmin
})
const mapDispatchProps = (dispatch) => bindActionCreators({ giveAdminAccess, removeAdminAccess, fetchUserData }, dispatch);
export default connect(mapStateToProps, mapDispatchProps)(BottomTabs);