import React, {Component} from 'react';
import { 
    View,
    Text,
    StyleSheet
} from 'react-native';
const firebase = require("firebase");
import Spinner from 'react-native-loading-spinner-overlay';

//import { Colors, Styles } from '../Shared'
import DatePick from '../Components/DatePick';
import TextField from '../Components/TextField';
import Separator from '../Components/Separator';
import {Button} from 'react-native-elements'

export default class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            birthday: '',
            errorMessage: null
        }

        firebase.auth().onAuthStateChanged((this.onAuthChanged));
        navigation = this.props.navigation
    }

    onAuthChanged = (user) => {
            if (user) {
                firebase.database().ref('AllUsers/' + user.uid).set({
                    email: user.email,
                    uid: user.uid,
                    name: this.state.name,
                    birthday: this.state.birthday
                  });
                this.setState({
                    loading: false
                })

                firebase.database().ref('UsersByDate/' + this.state.birthday + '/' + user.uid).set({
                    email: user.email,
                    uid: user.uid,
                    name: this.state.name,
                    birthday: this.state.birthday
                  });
                this.setState({
                    loading: false
                })
            }
        }

    goToChat = (day) => {
        this.setState({
            loading: false
        })
        //navigation.goBack()
    }
    getRef() {
        return firebase.database().ref().child('AllUsers');
    }

   static navigationOptions = {
        title: 'Sign Up',
        headerTitleStyle: {
            color: 'lightblue', 
        },
        headerStyle: {
            backgroundColor: '#222'
        },
        headerTintColor: 'lightblue'
    };
    signup = () => {
        this.setState({
            errorMessage: null,
            loading: true 
        })
        const {email, password} = this.state;
        firebase.auth()
            .createUserWithEmailAndPassword(email, password)
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

    render() {
        return (
            <View style={styles.container}>
                <TextField placeholder="First Name" 
                    style={styles.textField}
                    value={this.state.name}
                    onChangeText={name => this.setState({ name }) } />
                <TextField placeholder="E-mail" 
                    style={styles.textField}
                    value={this.state.email}
                    onChangeText={email => this.setState({ email }) } />
                <DatePick 
                    onDateChange={(birthday) => this.setState({birthday})} />
                {/* <TextField placeholder="Birthday" 
                    value={this.state.birthday}
                    onChangeText={birthday => this.setState({ birthday }) } /> */}
                <TextField placeholder="Password" secureTextEntry 
                    style={styles.textField}
                    value={this.state.password}
                    onChangeText={password => this.setState({ password }) } />
                
                <Text style={{flex: 0.03}} />

                <Button 
                        onPress={()=>this.signup()}
                        title="Sign Up"
                        buttonStyle={[styles.button, {backgroundColor: 'white'}]}
                        textStyle={{color: 'lightblue'}}
                    />
                {this.renderErrorMessage()}
                <Text style={{flex: 0.03}} />

                <Button 
                    onPress={() => {this.props.navigation.goBack();}}
                    title="Login"
                    textStyle={{color: 'white'}}
                    buttonStyle={[styles.button, {backgroundColor: 'lightblue'}]} />
                {/* <Button secondary onPress={() => {
                    this.props.navigation.navigate('ForgetPassword');
                }}>Forget Password</Button> */}

                <Spinner visible={this.state.loading} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#333'
    },
    button: {
        width: 300,
        justifyContent: 'center',
        borderRadius: 5
    },
    textField: {
        //marginLeft: 20, 
        width:300
    },
    error: {
        marginTop: 5,
        marginBottom: 5,
        color: 'red',
        textAlign: 'center'
    }
})