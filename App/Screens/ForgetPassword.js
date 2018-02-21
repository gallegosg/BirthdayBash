import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Alert
} from 'react-native';

import TextField from '../Components/TextField';
import {Button} from 'react-native-elements';
import Separator from '../Components/Separator';

const firebase = require("firebase");

export default class ForgetPassword extends Component {
    constructor(props){
        super(props);
        this.state={
            email: '',
            errorMessage: null
        }
    }

    static navigationOptions = {
        title: 'Forget Password',
        headerTitleStyle: {
            color: 'lightblue', 
        },
        headerStyle: {
            backgroundColor: '#222'
        },
        headerTintColor: 'lightblue'
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
                <TextField 
                    style={{marginLeft: 20}}
                    placeholder="E-Mail"
                    onChangeText={email => this.setState({ email }) }
                    />
                <Text style={{flex: 0.02}} />

                <Button 
                    title="Reset Password"
                    buttonStyle={styles.button}
                    onPress={() => {this.sendResetEmail(this.state.email)}}
                />
                {this.renderErrorMessage()}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#333',
        flex: 1,
        alignItems: 'center',
        paddingTop: 20
    },
    button: {
        width: 300,
        justifyContent: 'center',
        borderRadius: 5,
        backgroundColor: 'lightblue'
    },
    error: {
        marginTop: 5,
        color: 'red',
        textAlign: 'center'
    }
})