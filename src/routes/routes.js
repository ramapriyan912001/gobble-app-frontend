import Login from '../screens/Login';
import Register from '../screens/Register';
import Welcome from '../screens/Welcome';
import RegisterPage2 from '../screens/RegisterPage2'
import RegisterPage3 from '../screens/RegisterPage3'
import RegisterPage4 from '../screens/RegisterPage4'
import FinalStep from '../screens/finalstep';
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import ForgotPassword from '../screens/ForgotPassword'
import ChatRoom from '../screens/ChatRoom';
import Gobble from '../screens/Gobble'
import Matches from '../screens/Matches'
import Profile from '../screens/Profile';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import Ionicons from '@expo/vector-icons'



//TODO: Split routes into diff. stacks
//E.g. Register Pages - Stack
//Login -> Main Screen - Stack
//Within MainScreen -> Navigate w/o Stack

const AuthNavigator = createStackNavigator({
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
    ForgotPassword: {
      screen: ForgotPassword
    },
    Welcome:{
      screen: Welcome
    },
  }, {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      headerShown: false
    }
  });

const MainNavigator = createBottomTabNavigator({
    ChatRoom: {
      screen: ChatRoom,
      title: "Something"
    },
    Profile: {
      screen: Profile
    },
    Gobble: {
      screen: Gobble
    },
    Matches: {
      screen: Matches
    }
  }, {
    initialRouteName: "Profile",
    screenOptions: ({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Profile') {
          console.log("Profile tabbaricon reached")
          iconName = focused
            ? 'ios-information-circle'
            : 'ios-information-circle-outline';
        } else if (route.name === 'Gobble') {
          iconName = focused ? 'ios-list-box' : 'ios-list';
        }
        // You can return any component that you like here!
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    }),
    order: ['Profile', 'Gobble', 'Matches', 'ChatRoom'],
    backBehavior: "order",
    tabBarOptions: {
      activeBackgroundColor: "#0aa859",
      inactiveBackgroundColor: "#b5fbd7",
      activeTintColor: "#000000",
      inactiveTintColor: "#000000",
      labelPosition: 'below-icon',
      adaptive: true,
    }
  })
  const SwitchNavigator = createSwitchNavigator({
    Login: AuthNavigator,
    Main: MainNavigator,
  }, {
    initialRouteName: 'Login'
  })

  export const AppContainer = createAppContainer(SwitchNavigator);