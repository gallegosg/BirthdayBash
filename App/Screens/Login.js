import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image
} from 'react-native';
const firebase = require("firebase");
import Spinner from 'react-native-loading-spinner-overlay';

import { Colors, Styles } from '../Shared'

import TextField from '../Components/TextField';
import {Button, Text} from 'react-native-elements';
import Separator from '../Components/Separator';
import hat from '../images/hat2.png'

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errorMessage: null
        }

        navigation = this.props.navigation;

        //if user is logged in, get bday and send to chat
        firebase.auth().onAuthStateChanged((user) => {
            console.log('on auth state changed')
            if (user) {
                firebase.database().ref().child('AllUsers').child(user.uid).once('value')
                    .then((snap) => this.goToChat(snap.val().birthday, snap.val().name)) 
            }
    });

    this.mainBlue = '#96ccdf';
}

    static navigationOptions = {
        title: 'Login',
        header: null,      
    };

    //send user to chat after sign in 
    goToChat = (day, name) => {
        if(this.refs.mainView){
        this.setState({
            loading: false
        })
    }
        navigation.navigate('Chat', {bday: day, firstName: name})
    }

    login = () => {
        if(this.refs.mainView){
            this.setState({
                errorMessage: null,
                loading: true 
            })
        }
        const {email, password} = this.state;
        firebase.auth()
            .signInWithEmailAndPassword(email, password)
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                this.setState({
                    errorMessage,
                    loading: false
                })
            });
    }

    renderErrorMessage = () => {
        if(this.state.errorMessage)
            return <Text style={styles.error}>{this.state.errorMessage}</Text>
    }

    componentWillUnmount() {
        console.log('login did unmount')
    }

    render() {
        return (
            <View ref="mainView" style={styles.container}>
                <Text style={{flex: 0.4}} />
                <View style={{alignItems: 'center'}}>
                    <Image source={hat} style={{width: 100, height: 100}}/>
                    <Text h1 style={{color: 'lightgrey', fontWeight: 'bold'}}>Birthday</Text>
                    <Text h1 style={{color: 'lightgrey', fontWeight: 'bold'}}>Bash</Text>
                </View>
                <Text style={{flex: 0.3}} />
                <View>
                    <TextField placeholder="E-Mail"
                        value={this.state.email}
                        onChangeText={email => this.setState({ email }) }
                        style={{width:300}} />
                    <TextField placeholder="Password" secureTextEntry
                        value={this.state.password}
                        onChangeText={password => this.setState({ password }) }
                        style={{width:300}} />
                </View>
                <Text style={{flex: 0.2}} />

                <View style={{flex: 1, alignItems: 'center'}}> 
                    <Button 
                        onPress={this.login}
                        title="Login"
                        textStyle={{color: 'white'}}
                        buttonStyle={[styles.button, {backgroundColor: this.mainBlue}]} />
                        
                    {this.renderErrorMessage()}
                    <Text style={{flex: 0.2}} />
                
                    <Button 
                        onPress={() => {navigation.navigate('SignUp')} }
                        title="Sign Up"
                        buttonStyle={[styles.button, {backgroundColor: 'white'}]}
                        textStyle={{color: this.mainBlue}}
                    />

                    <Button 
                        onPress={() => {navigation.navigate('ForgetPassword')} }
                        title="Forgot Password"
                        buttonStyle={[styles.button, {backgroundColor: 'transparent'}]}
                        textStyle={{color: this.mainBlue}}
                    />
                </View>
                <Text style={{flex: 0.1}} />
                <Spinner visible={this.state.loading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 50,
        backgroundColor: '#333',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    error: {
        margin: 5,
        marginBottom: 5,
        color: 'red',
        textAlign: 'center'
    },
    button: {
        width: 300,
        justifyContent: 'center',
        borderRadius: 5
    }
})