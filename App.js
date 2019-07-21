// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  */

// import React, {Component} from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text
// } from 'react-native';
// import firebase from 'react-native-firebase';


// class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isAuthenticated: false,
//       text: ''
//     };
//   }

//   componentDidMount = () => {
//     firebase.auth().signInAnonymously()
//     .then((res) => {
//       console.log(res)
//       this.setState({
//         isAuthenticated: true,
//       });
//     }).catch((err) => {
//       console.log(err)
//     });
//   }

//   render() {
//      // If the user has not authenticated
//     if (!this.state.isAuthenticated) {
//       return <Text>Nope</Text>;
//     }

//     return (
//       <SafeAreaView>
//         <Text>Welcome to my awesome app!</Text>
//         <Text>{this.state.text}</Text>
//       </SafeAreaView>
//     );
//   }
// }

// export default App;


import React, { Component } from 'react';
import store from './App/store'
import { Provider } from 'react-redux'
import Router from './App/Router'
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Class RCTCxxModule']);
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;