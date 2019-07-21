import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Image,
    Dimensions
} from 'react-native';
import candles from '../images/candles2.png'
import TextField from '../Components/TextField';

import firebase from 'react-native-firebase'

const {width} = Dimensions.get('window')

export default class ForgetPassword extends Component {
    constructor(props){
        super(props);
        this.state={
            email: '',
            errorMessage: null
        }
        this.mainColor = '#E06143'
    }

    static navigationOptions = {
        title: 'Forgot Password',
        headerTitleStyle: {
            color: 'lightgrey', 
        },
        headerStyle: {
            backgroundColor: '#222'
        },
        headerTintColor: '#E06143'
    };

    sendResetEmail = (email) => {
        firebase.auth().sendPasswordResetEmail(email)
            .then(function() {
                // Email sent.
                Alert.alert(
                    'Success',
                    'Reset Password Email Sent'
                  )
            }).catch((error) => {
                // Handle Errors here.
                var errorMessage = error.message;
                this.setState({
                    errorMessage
                })
            });
    }

    renderErrorMessage = () => {
        if(this.state.errorMessage)
            return <Text style={styles.error}>{this.state.errorMessage}</Text>
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{flex: 0.2, marginBottom: 20, justifyContent: 'space-around', alignItems: 'center'}}>
                    <TextField 
                        style={{marginLeft: 20}}
                        placeholder="E-Mail"
                        onChangeText={email => this.setState({ email }) }
                        />
                    <TouchableOpacity
                        style={[styles.button, {backgroundColor: this.mainColor, paddingTop: 3}]}
                        onPress={() => {this.sendResetEmail(this.state.email)}}
                        >
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>
                    {this.renderErrorMessage()}
                </View>
                
                <View style={{flex: 0.6}}>
                </View>
                <Image source={candles} style={{flex: 0.25, alignItems: 'flex-end', resizeMode: 'contain'}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        width: 250,
        justifyContent: 'center',
        borderRadius: 2,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 20,
        padding: 3,
        fontFamily: 'helvetica',
        color: 'white'
    },
    error: {
        marginTop: 5,
        color: 'red',
        textAlign: 'center'
    }
})