/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
import { YellowBox } from 'react-native';
import Login from './Screens/Login'
import Signup from './Screens/Signup'
import ForgetPassword from './Screens/ForgetPassword'
import Chat from './Screens/Chat'
import PreLogin from './Screens/PreLogin'
import {createStackNavigator, createSwitchNavigator, createAppContainer} from 'react-navigation';

//Ignore Ismounted is deprecated warning
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);

// Initialize Firebase
// var config = {
//   apiKey: "AIzaSyCYRB8C7zEU7w5qAe3GRKJVC3yBXjYJHvM",
//   authDomain: "chatapp-5a53a.firebaseapp.com",
//   databaseURL: "https://chatapp-5a53a.firebaseio.com",
//   projectId: "chatapp-5a53a",
//   storageBucket: "chatapp-5a53a.appspot.com",
//   messagingSenderId: "1046978845325"
// };

const AuthStack = createStackNavigator({
  Login: { 
    screen: Login 
  },
  SignUp: { 
    screen: Signup 
  },
  ForgetPassword: { 
    screen: ForgetPassword 
  },
})

const AppStack = createStackNavigator({
  Chat: { 
    screen: Chat 
  }
})

export default createAppContainer(createSwitchNavigator(
  {
    PreLogin: PreLogin,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'PreLogin',
  }
));