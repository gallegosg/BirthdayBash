/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar
} from 'react-native';
const firebase = require("firebase");

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCYRB8C7zEU7w5qAe3GRKJVC3yBXjYJHvM",
    authDomain: "chatapp-5a53a.firebaseapp.com",
    databaseURL: "https://chatapp-5a53a.firebaseio.com",
    projectId: "chatapp-5a53a",
    storageBucket: "chatapp-5a53a.appspot.com",
    messagingSenderId: "1046978845325"

};
firebase.initializeApp(config);

import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import {StackNavigator} from 'react-navigation';

import Login from './Screens/Login'
import Signup from './Screens/Signup'
import ForgetPassword from './Screens/ForgetPassword'
import FriendsList from './Screens/FriendsList'
import Chat from './Screens/Chat'

/**
  * This is where we map route names to route components. Any React
  * component can be a route, it only needs to have a static `route`
  * property defined on it, as in HomeScreen below
  */
const Router = createRouter(() => ({
  login: () => Login,
  signup: () => Signup,
  forgetPassword: () => ForgetPassword,
  chat: () => Chat
}));

export default StackNavigator({
  Login: { 
    screen: Login 
  },
  SignUp: { 
    screen: Signup 
  },
  forgetPassword: { 
    screen: ForgetPassword 
  },
  Chat: { 
    screen: Chat 
  },
}, {
  initialRouteName: 'Login',
})

// export default class Firechat extends Component {
//   render() {
//     return (
//       <View style={{ flex: 1 }}>
//         <StatusBar barStyle="light-content"/>
//         <NavigationProvider router={Router}>
//           <StackNavigation initialRoute={Router.getRoute('login') } />
//         </NavigationProvider>
//       </View>
//     );
//   }
// }

