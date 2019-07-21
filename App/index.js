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
import * as consts from './config'

firebase.initializeApp(consts.config);

import {
  createRouter,
  NavigationProvider,
  StackNavigation,
} from '@exponent/ex-navigation';
import { createStackNavigator} from 'react-navigation';

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

export default createStackNavigator({
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