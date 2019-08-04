import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
    Keyboard
} from 'react-native';
import firebase from 'react-native-firebase'
import { connect } from 'react-redux';
import { Text} from 'react-native-elements';
import hat from '../images/hat_orange.png'
import candles from '../images/candles2.png'
import {saveUser} from '../actions/userActions'
import {Colors} from '../Shared'
import DatePick from '../Components/DatePick';
import { TextInput } from 'react-native-gesture-handler';
import PopinButton from '../Components/PopinButton';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'One@test.com',
            password: 'password1',
            birthday: '',
            errorMessage: null,
            loading: false,
            name: '',
            keyboardUp: false
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
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    
    _keyboardDidShow = () => {
        this.setState({keyboardUp: true})
    }
    
    _keyboardDidHide = () => {
        this.setState({keyboardUp: false})
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
                    this.getUserDataSuccess(doc.data())
                } else {
                    // doc.data() will be undefined in this case
                    firebase.auth().signOut();
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
                errorMessage: 'Missing Birthday'
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
                const {uid} = res.user._user
                //create user here
                this.saveToFS(uid)
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

    saveToFS = (uid) => {
        let user = {
            uid,
            name: this.state.name,
            birthday: this.state.birthday,
            avatar: 'https://api.adorable.io/avatars/50/' + uid + '.png',
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
        const { loading, keyboardUp } = this.state;
        return (
            <View ref="mainView" style={styles.container}>
                <View style={{alignItems: 'center', flex: 0.5, justifyContent: 'center', marginBottom: 25}}>
                    <Image source={hat} style={{width: 80, height: 80, resizeMode: 'contain'}}/>
                    <Text h1 style={{color: Colors.secondaryColor, fontWeight: 'bold'}}>Birthday</Text>
                    <Text h1 style={{color: Colors.secondaryColor, fontWeight: 'bold'}}>Bash</Text>
                </View>
                <View style={{flex: 0.2, width: '100%', alignItems: 'center'}}>
                    <TextInput 
                        placeholder="Name"
                        value={this.state.name}
                        maxLength={15}
                        placeholderTextColor="grey"
                        onChangeText={name => this.setState({ name }) }
                        style={styles.textField} />
                    <View style={styles.divider} />
                    <DatePick 
                        onDateChange={(birthday) => this.setState({birthday})} />
                </View>

                <View style={{flex: 0.2, alignItems: 'center'}}> 
                    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <PopinButton
                            style={[styles.button, {backgroundColor: this.mainOrange, width: 250}]}
                            onPress={this.login}
                            disabled={loading}
                            >
                            {loading ? 
                            <ActivityIndicator size="large" color="#fff" />
                            :
                            <Text style={[styles.buttonText, {color: 'white'}]}>Enter</Text>
                            }
                        </PopinButton>
                            
                        {this.renderErrorMessage()}
                    </View>
                </View>
                {keyboardUp || <Image source={candles} style={{flex: 0.22, alignItems: 'flex-end', resizeMode: 'contain'}}/>}
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
        height: '50%',
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
        fontSize: 22,
        height: 40,
        paddingVertical: 2,
        width: 300,
        color: 'white',
        textAlign: 'center'
    },
    divider: {
        height: 10,
        width: '50%',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    }
})