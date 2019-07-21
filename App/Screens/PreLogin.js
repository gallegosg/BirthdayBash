import React, { Component } from 'react';
import firebase from 'react-native-firebase'
import {saveUser} from '../actions/userActions'
import {View, ActivityIndicator, StatusBar, StyleSheet, Alert}  from 'react-native'
import Loading from './Loading'
import { connect } from 'react-redux';
import {createRootNavigator} from 'react-navigation'
import Login from './Login'
import Chat from './Chat'
import Router from '../Router'

class PreLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errorMessage: null
        }
    }

    static navigationOptions = {
        header: null,      
    };

  componentDidMount = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log(user)
        this.getUserData(user._user.uid)
      } else {
        this.props.navigation.navigate('Auth')
      }
    });
  }

  /**
     * use user id to get their data from the
     * database
     */
    getUserData = (uid) => {
      firebase.firestore().collection('users').doc(uid).get()
        .then((doc) => {
            if (doc.exists) {
              this.getUserDataSuccess(doc.data())
            } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
              firebase.auth().signOut();
            }
        }).catch((error) => {
          console.log(error)
          this.setState({
            errorMessage: error.message,
          })
        })
  }

  /**
   * retreive user data was a success
   */
  getUserDataSuccess = (data) => {
    this.props.saveUser(data)
    this.props.navigation.navigate('App')
  }

  renderErrorMessage = () => {
    renderErrorMessage = () => {
        if(this.state.errorMessage)
            return <Text style={styles.error}>{this.state.errorMessage}</Text>
    }
  }

  render() {
    return (
      <View styles={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator />
        {this.renderErrorMessage()}
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    error: {
        margin: 5,
        marginBottom: 5,
        color: 'red',
        textAlign: 'center'
    }
})

export default connect(null, {saveUser})(PreLogin);
