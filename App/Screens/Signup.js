import React, {Component} from 'react';
import { 
    View,
    Text,
    StyleSheet,
    Alert,
    Image,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker'
import DatePick from '../Components/DatePick';
import TextField from '../Components/TextField';
import Separator from '../Components/Separator';
import {Button} from 'react-native-elements'
import {Avatar} from 'react-native-elements'
import {connect} from 'react-redux'
import {saveUser} from '../actions/userActions'
import {Colors} from '../Shared'
import candles from '../images/candles2.png'

import firebase from 'react-native-firebase'

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            birthday: '',
            errorMessage: null,
            userImage: '',
            imageData: ''
        }
                
          navigation = this.props.navigation
    }

    onAuthChanged = (user) => {
        if (user) {
            // firebase.database().ref('AllUsers/' + user.uid).set({
            //     email: user.email,
            //     uid: user.uid,
            //     name: this.state.name,
            //     birthday: this.state.birthday
            // });

            // firebase.database().ref('UsersByDate/' + this.state.birthday + '/' + user.uid).set({
            //     email: user.email,
            //     uid: user.uid,
            //     name: this.state.name,
            //     birthday: this.state.birthday
            //     });
            this.setState({
                loading: false
            })

            //uploadImageAsync(this.state.imageData.uri, user.uid)
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

    logout = () => {
        // firebase.auth().signOut().then(() => {
        //     navigation.dispatch({type: 'Navigation/RESET', 
        //         index: 0, 
        //         actions: [{ 
        //             type: 'Navigate', 
        //             routeName:'Login'
        //         }]
        //     });
        // }, function (error) {
        //     console.log(error)
        // });
        console.log(firebase.auth().currentUser)
    }

   static navigationOptions = {
        title: 'Sign Up',
        headerTitleStyle: {
            color: 'white', 
        },
        headerStyle: {
            backgroundColor: '#222'
        },
        headerTintColor: Colors.mainColor
    };

    saveAvatar = (uid) => {
        this.uploadImageAsync(this.state.userImage.uri, uid)
            .then((response) => {
                console.log('saved avatar')
                this.saveToFS(uid, response)
            }).catch((error) => {
                console.log(error)
            })
    }

    saveToFS = (uid) => {
        let val = {
            name: this.state.name,
            birthday: this.state.birthday,
            email: this.state.email,
            uid: uid,
            avatar: this.state.userImage ? this.state.userImage : 'https://api.adorable.io/avatars/150/' + this.state.name + '.png'
        }
        firebase.firestore().collection('users').doc(uid).set(val)
            .then(() => {
                this.fsSuccess(val)
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
    signup = () => {
        this.setState({
            errorMessage: null,
            loading: true 
        })
        const {email, password} = this.state;
        firebase.auth()
            .createUserAndRetrieveDataWithEmailAndPassword(email, password)
            .then((user) => {
                // this.state.userImage.uri ? 
                // this.saveAvatar(user.user._user.uid)
                // :
                this.saveToFS(user.user._user.uid)
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

    renderErrorMessage = () => {
        if(this.state.errorMessage)
            return <Text style={styles.error}>{this.state.errorMessage}</Text>
    }

    openCamera = () => {
        let options = {
            quality: 0.3,
            allowsEditing: true,
            noData: false
          };

        ImagePicker.showImagePicker(options, (response) => {            
            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                Alert.alert('Error selecting a photo', 'Please try again')
            }
            else {
            
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                this.setState({
                    userImage: 'data:image/png;base64,' + response.data,
                    imageUri: response.uri
                })
            }
        });
    }

    uploadImageAsync = async (uri, id) => {
        const ref = firebase
            .storage()
            .ref()
            .child('UserImages/' + id);
        
        const snapshot = await ref.put(uri);
    
        return snapshot;
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <View style={{flex: 0.2}}>
                   <Avatar
                    source={this.state.userImage ? {uri: this.state.userImage} : null}
                    icon={this.state.userImage ? null : {name: 'photo'}}
                    size='large'       
                    rounded     
                    avatarStyle={{backgroundColor: 'white'}}        
                    onPress={this.openCamera}
                    /> 
                </View>
                
                <View style={{flex: 0.4}}>
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
                    <TextField placeholder="Password" secureTextEntry 
                        style={styles.textField}
                        value={this.state.password}
                        returnKeyType="go"
                        onSubmitEditing={this.signup}
                        onChangeText={password => this.setState({ password }) } />
                </View>
                

                <View style={{flex: 0.3, justifyContent: 'space-around', alignItems: 'center'}}>
                    <Button 
                            onPress={this.signup}
                            title="Sign Up"
                            buttonStyle={[styles.button, {backgroundColor: 'white'}]}
                            titleStyle={{color: Colors.mainColor}}
                        />
                    {this.renderErrorMessage()}

                </View>

                <View style={{flex: 0.2}} />

                <Image source={candles} style={{flex: 0.3, alignItems: 'flex-end', resizeMode: 'contain'}}/>

                <Spinner visible={this.state.loading} />
            </View>
            </TouchableWithoutFeedback>
        );
    }
}

export default connect(null, {saveUser})(SignUp)

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.grayColor
    },
    button: {
        width: 250,
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
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