import Login from '../screens/Login'
import Welcome from '../screens/Welcome';
import RegisterNavigator from '../screens/Register/RegisterNavigator'
import FinalStep from '../screens/FinalStep';
import ForgotPassword from '../screens/ForgotPassword'
import BottomTabs from '../components/BottomTabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import Reauthenticate from '../screens/Reauthenticate';
import UpdateProfile from '../screens/Profile/UpdateProfile'

//TODO: Split routes into diff. stacks
//E.g. Register Pages - Stack
//Login -> Main Screen - Stack
//Within MainScreen -> Navigate w/o Stack

const AppNavigator = createStackNavigator({
    Login: {
      screen: Login
    },
    RegisterNavigator: {
      screen: RegisterNavigator
    },
    FinalStep: {
      screen: FinalStep
    },
    ForgotPassword: {
      screen: ForgotPassword
    },
    Welcome:{
      screen: Welcome
    },
    BottomTabs: {
      screen: BottomTabs
    },
    Reauthenticate: {
      screen: Reauthenticate
    },
    UpdateProfile:{
      screen: UpdateProfile
    }
  }, {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      headerShown: false
    }
  });

  export const AppContainer = createAppContainer(AppNavigator);