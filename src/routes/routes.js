import Login from '../screens/Login';
import Register from '../screens/Register';
import Welcome from '../screens/Welcome';
import RegisterPage2 from '../screens/RegisterPage2'
import RegisterPage3 from '../screens/RegisterPage3'
import RegisterPage4 from '../screens/RegisterPage4'
import FinalStep from '../screens/FinalStep';
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import ForgotPassword from '../screens/ForgotPassword'
import ChatRoom from '../screens/ChatRoom';
import Profile from '../screens/Profile';

//TODO: Split routes into diff. stacks
//E.g. Register Pages - Stack
//Login -> Main Screen - Stack
//Within MainScreen -> Navigate w/o Stack

const AppNavigator = createStackNavigator({
    Login: {
      screen: Login
    },
    Register: {
      screen: Register
    },
    RegisterPage2: {
      screen: RegisterPage2
    },
    RegisterPage3: {
      screen: RegisterPage3
    },
    RegisterPage4: {
      screen: RegisterPage4
    },
    FinalStep: {
      screen: FinalStep
    },
    Welcome:{
      screen: Welcome
    },
    ForgotPassword: {
      screen: ForgotPassword
    },
    ChatRoom: {
      screen: ChatRoom
    },
    Profile: {
      screen: Profile
    },
  }, {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      headerShown: false
    }
  });

  export const AppContainer = createAppContainer(AppNavigator)