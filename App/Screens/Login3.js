import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Button,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase'
import { connect } from 'react-redux';
import { Text} from 'react-native-elements';
import hat from '../images/hat_orange.png'
import candles from '../images/candles2.png'
import {saveUser} from '../actions/userActions'
import {Colors} from '../Shared'

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'One@test.com',
            password: 'password1',
            errorMessage: null
        }

        navigation = this.props.navigation;

    //     //if user is logged in, get bday and send to chat
    //     firebase.auth().onAuthStateChanged((user) => {
    //         console.log('on auth state changed')
    //         if (user) {
    //             console.log(user)
    //             firebase.database().ref().child('AllUsers').child(user.uid).once('value')
    //                 .then((snap) => {
    //                     console.log(snap.val())
    //                     this.props.saveUser(snap.val())
    //                     this.goToChat()}
    //                 ).catch((error) => {
    //                     this.setState({
    //                         errorMessage: error.message,
    //                         loading: false 
    //                     })
    //                 })
    //         }
    // });

    this.mainBlue = '#96ccdf';
    this.mainOrange = '#E06143'
}

    static navigationOptions = {
        title: 'Login',
        header: null,      
    };

    componentDidMount = () => {
        console.log(this.props.navigation)
    }
    //send user to chat after sign in 
    goToChat = () => {
        if(this.refs.mainView){
        this.setState({
            loading: false
        })
    }
        navigation.navigate('Chat')
    }

    /**
     * use user id to get their data from the
     * database
     */
    getUserData = (uid) => {
        firebase.firestore().collection('users').doc(uid).get()
            .then((doc) => {
                if (doc.exists) {
                    console.log(doc.data())
                    this.getUserDataSuccess(doc.data())
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                this.setState({
                    errorMessage: error.message,
                    loading: false
                })
            })
    }

    /**
     * retreive user data was a success
     */
    getUserDataSuccess = (data) => {
        this.props.saveUser(data)

        this.goToChat()
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
            .signInAnonymously()
            .then((res) => {
                console.log(res)
                const {uid} = res._user
                // let uid = firebase.auth().currentUser._user.uid
                this.getUserData(uid)
            })
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

    logout = () => {
        firebase.auth().signOut().then(() => {
            console.log('signed out')
        }, function (error) {
            console.log(error)
        });
    }

    renderErrorMessage = () => {
        if(this.state.errorMessage)
            return <Text style={styles.error}>{this.state.errorMessage}</Text>
    }


    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View ref="mainView" style={styles.container}>
                <View style={{alignItems: 'center', flex: 0.5, justifyContent: 'center'}}>
                    <Image source={hat} style={{width: 80, height: 80, resizeMode: 'contain'}}/>
                    <Text h1 style={{color: Colors.secondaryColor, fontWeight: 'bold'}}>Birthday</Text>
                    <Text h1 style={{color: Colors.secondaryColor, fontWeight: 'bold'}}>Bash</Text>
                </View>
                <View>
                    <TextInput placeholder="E-Mail"
                        value={this.state.email}
                        onSubmitEditing={() => { this.secondTextInput.focus(); }}
                        blurOnSubmit={false}
                        onChangeText={email => this.setState({ email }) }
                        style={styles.textField} />
                    <TextInput placeholder="Password" 
                        secureTextEntry
                        ref={(input) => { this.secondTextInput = input; }}
                        value={this.state.password}
                        onChangeText={password => this.setState({ password }) }
                        onSubmitEditing={this.login}
                        returnKeyType="go"
                        style={styles.textField} />
                </View>

                <View style={{flex: 0.3, alignItems: 'center'}}> 
                     <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-around', marginTop: 20, marginBottom: 20}}>
                        <TouchableOpacity
                            style={[styles.button, {backgroundColor: this.mainOrange, width: 250}]}
                            onPress={this.login}
                            >
                            <Text style={[styles.buttonText, {color: 'white'}]}>Login</Text>
                        </TouchableOpacity>
                            
                        {this.renderErrorMessage()}

                        <TouchableOpacity
                            style={[styles.button, {backgroundColor: 'white', width: 250}]}
                            onPress={() => {navigation.navigate('SignUp')}}
                            >
                            <Text style={[styles.buttonText, {color: this.mainOrange}]}>Sign Up</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, {backgroundColor: 'transparent', paddingTop: 3}]}
                            onPress={() => {navigation.navigate('ForgetPassword')}}
                            >
                            <Text style={[styles.buttonText, {color: 'lightgrey', fontSize: 17}]}>Forget Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Image source={candles} style={{flex: 0.22, alignItems: 'flex-end', resizeMode: 'contain'}}/>
                <Spinner visible={this.state.loading} />
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default connect(null, {saveUser})(Login);

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },
    buttonText: {
        fontSize: 18,
        padding: 3,
        fontFamily: 'helvetica',
    },
    textField: {
        width: 300,
        fontSize: 18,
        height: 35,
        width: 300,
        color: 'white'
        }
})