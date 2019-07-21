import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    Button,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard,
    Platform
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase'
import { connect } from 'react-redux';
import { Text} from 'react-native-elements';
import hat from '../images/hat_orange.png'
import candles from '../images/candles2.png'
import {saveUser} from '../actions/userActions'
import {Colors} from '../Shared'
import DatePick from '../Components/DatePick';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'One@test.com',
            password: 'password1',
            birthday: '',
            errorMessage: null
        }

    navigation = this.props.navigation;

    this.mainBlue = '#96ccdf';
    this.mainOrange = '#E06143'
}

    static navigationOptions = {
        title: 'Login',
        header: null,      
    };

    componentDidMount = () => {
        // console.log(this.props.navigation)
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
        if(!this.state.birthday){
            return this.setState({
                errorMessage: 'missing birthday'
            })
        }
        if(this.refs.mainView){
            this.setState({
                errorMessage: null,
                loading: true 
            })
        }

        firebase.auth()
            .signInAnonymously()
            .then((res) => {
                console.log(res)
                const {uid} = res.user._user
                //create user here
                this.saveToFS(uid)
            })
            .catch((error) => {
                // Handle Errors here.
                console.log(error)
                var errorCode = error.code;
                var errorMessage = error.message;
                this.setState({
                    errorMessage,
                    loading: false
                })
            });
    }

    saveToFS = (uid) => {
        console.log(uid)
        let user = {
            uid,
            birthday: this.state.birthday,
            avatar: 'https://api.adorable.io/avatars/150/' + uid + '.png',
            platform: Platform.OS
        }
        firebase.firestore().collection('users').doc(uid).set(user)
            .then(() => {
                this.fsSuccess(user)
            }).catch((error) => {
                // Handle Errors here.
                var errorMessage = error.message;
                this.setState({
                    errorMessage,
                    loading: false
                })
            })
    }

    fsSuccess = (val) => {
        console.log("Document successfully written!");
        this.props.saveUser(val)
        navigation.navigate('App')
        this.setState({
            loading: false
        })
    }

    renderErrorMessage = () => {
        if(this.state.errorMessage)
            return <Text style={styles.error}>{this.state.errorMessage}</Text>
    }

    render() {
        return (
            <View ref="mainView" style={styles.container}>
                <View style={{alignItems: 'center', flex: 0.5, justifyContent: 'center'}}>
                    <Image source={hat} style={{width: 80, height: 80, resizeMode: 'contain'}}/>
                    <Text h1 style={{color: Colors.secondaryColor, fontWeight: 'bold'}}>Birthday</Text>
                    <Text h1 style={{color: Colors.secondaryColor, fontWeight: 'bold'}}>Bash</Text>
                </View>
                <View>
                <DatePick 
                    onDateChange={(birthday) => this.setState({birthday})} />
                </View>

                <View style={{flex: 0.3, alignItems: 'center'}}> 
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                        <TouchableOpacity
                            style={[styles.button, {backgroundColor: this.mainOrange, width: 250}]}
                            onPress={this.login}
                            >
                            <Text style={[styles.buttonText, {color: 'white'}]}>Enter</Text>
                        </TouchableOpacity>
                            
                        {this.renderErrorMessage()}
                    </View>
                </View>
                <Image source={candles} style={{flex: 0.22, alignItems: 'flex-end', resizeMode: 'contain'}}/>
            </View>
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
        color: '#fff',
        textAlign: 'center',
        fontSize: 16
    },
    button: {
        height: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginBottom: 5
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