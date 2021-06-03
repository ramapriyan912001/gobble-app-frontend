import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Welcome from './src/screens/Welcome';
import RegisterPage2 from './src/screens/RegisterPage2'
import RegisterPage3 from './src/screens/RegisterPage3'
import RegisterPage4 from './src/screens/RegisterPage4'
import FinalStep from './src/screens/FinalStep';
import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import ForgotPassword from './src/screens/ForgotPassword'

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
  }, {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      headerShown: false
    }
  });

  export const AppContainer = createAppContainer(AppNavigator)