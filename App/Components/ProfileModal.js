import React, {Component} from 'react';
import {Modal, Text, TouchableOpacity, View, StyleSheet, TextInput, Image, Switch, SafeAreaView} from 'react-native';
import {Avatar} from 'react-native-elements'
import {connect} from 'react-redux'
import Seperator from '../Components/Separator'
import {removeUser, newAvatar, updateName, updateEmail} from '../actions/userActions'
import firebase from 'react-native-firebase'
import ImagePicker from 'react-native-image-picker'
import {NavigationOptions} from 'react-navigation'
import {Colors} from '../Shared'
import {saveBubbleColor} from '../actions/settingsActions'
class ProfileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            nameChanged: false,
            emailChanged: false,
            name: this.props.name,
            email: this.props.email,
            notifications: false
        };
    }

    setModalVisible(visible) {
        if(this.state.modalVisible){
            this.setState({
                name: this.props.name,
                email: this.props.email,
                nameChanged: false,
                emailChanged: false,
            })
        }
        this.setState({modalVisible: visible});
    }

    logout = () => {
        firebase.auth().signOut().then(() => {
            this.props.removeUser()

            this.props.navigation.dispatch({type: 'Navigation/RESET', 
                index: 0, 
                key: null,
                actions: [
                    NavigationOptions.navigate({routeName: 'Auth'})
                ]
            }).catch;

        }).catch((error) => {
            // An error happened.
            console.log(error)
        });
    }

    /**
     * open image picker to select new avatar
     */
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
                    userImage: 'data:image/png;base64,' + response.data
                })
                console.log(response)
                this.uploadImageAsync(response.uri)
                .then((downloadURL) => {
                    console.log('image uploaded to storage')
                    this.imageSaveToFS(downloadURL)
                }).catch((err) => console.log(err))
            }
        });
    }

    /**
     * upload new user image to firebase storage
     */
    uploadImageAsync = async (uri) => {
        const ref = firebase
            .storage()
            .ref()
            .child('UserImages/' + this.props.uid);

        const snapshot = await ref.put(uri);
        return snapshot.downloadURL;
    }

    /**
     * save image to firestore
     * NOT using storage
     */
    // saveToFS = () => {
    //     firebase.firestore().collection('users').doc(this.props.uid).update({avatar: this.state.userImage})
    //         .then(() => {
    //             this.props.newAvatar(this.state.userImage)
    //             this.updateMessages()
    //         }).catch((error) => {
    //             // Handle Errors here.
    //             var errorMessage = error.message;
    //             this.setState({
    //                 errorMessage,
    //                 loading: false
    //             })
    //         })
    // }

    /**
     * save image to firestore
     * Using storage
     */
    imageSaveToFS = (downloadURL) => {
        firebase.firestore().collection('users').doc(this.props.uid).update({avatar: downloadURL})
            .then(() => {
                this.props.newAvatar(this.state.userImage)
                this.getUserMessages(downloadURL)
            }).catch((error) => {
                // Handle Errors here.
                var errorMessage = error.message;
                this.setState({
                    errorMessage,
                    loading: false
                })
            })
    }

    /**
     * get users messages for changing avatar image
     */
    getUserMessages = (downloadURL) => {
        firebase.firestore().collection('chat').doc(this.props.bday).collection('messages').where("uid", "==", this.props.uid).get()
        .then((querySnapshot) => {
            console.log('messages  retreived')
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                this.updateMessages(doc.id, downloadURL)
            });
        }).catch((error) => {
            console.log('messages retreive failed', error)
        })
    }


    /**
     * When user changes profile picture, change the url in the messages theyve sent
     */
    updateMessages = (id, downloadURL) => {
        firebase.firestore().collection('chat').doc(this.props.bday).collection('messages').doc(id).update({
            avatar: downloadURL
        })
        .then(() => {
            console.log('messages avatar saved')
            // querySnapshot.forEach((doc) => {
            //     // doc.data() is never undefined for query doc snapshots
            //     console.log(doc.id, " => ", doc.data());
            // });
        }).catch((error) => {
            console.log('messages avatar failed', error)
        })
    }

    /**
     * save image to firestore
     * Using storage
     */
    detailsSaveToFS = () => {
        //data to update
        let update = {};

        if(this.state.nameChanged){update.name = this.state.name}
        if(this.state.emailChanged){update.email = this.state.email}


        firebase.firestore().collection('users').doc(this.props.uid).update(update)
            .then(() => {
                if(this.state.nameChanged){this.props.updateName(this.state.name)}
                if(this.state.emailChanged){this.props.updateEmail(this.state.email)}

                this.setState({nameChanged: false, emailChanged: false})
            }).catch((error) => {
                // Handle Errors here.
                var errorMessage = error.message;
                this.setState({
                    errorMessage,
                    loading: false
                })
            })
    }

    /**
     * update users email address
     */
    updateEmail = () => {
        firebase.auth().currentUser.updateEmail(this.state.email).then(() => {
            // Update successful.
          }).catch((error) => {
            // An error happened.
            console.log(error)
          });
    }

    /**
     * when user presses the save button after changing info
     */
    handleSavePress = () => {
        if(this.state.emailChanged){
            this.updateEmail()
        }

        if(this.state.nameChanged){
            this.getUserMessagesForData()
        }

        this.detailsSaveToFS()
    }

    /**
     * get users messages for changing name or email
     */
    getUserMessagesForData = () => {
        firebase.firestore().collection('chat').doc(this.props.bday).collection('messages').where("uid", "==", this.props.uid).get()
        .then((querySnapshot) => {
            console.log('messages  retreived')
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                this.updateMessageData(doc.id)
            });
        }).catch((error) => {
            console.log('messages retreive failed', error)
        })
    }


    /**
     * When user changes name or email, change the name or email in the messages theyve sent
     */
    updateMessageData = (id) => {
        firebase.firestore().collection('chat').doc(this.props.bday).collection('messages').doc(id).update({
            name: this.state.name
        })
        .then(() => {
            console.log('messages name updated')
        }).catch((error) => {
            console.log('messages avatar failed', error)
        })
    }

    handleBubblePress = (color) =>{
        this.props.saveBubbleColor(color)
    }


  render() {
    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          {/* THis View the inside of the modal*/}
          <SafeAreaView style={{flex: 1, backgroundColor: '#333'}}>
            {/*Top bar CLOSE and SAVE */}
            <View style={{flexDirection: 'row', marginBottom: 30, justifyContent: 'space-between', marginLeft: 10, marginRight: 10}}>
                <TouchableOpacity
                    onPress={() => {this.setModalVisible(!this.state.modalVisible);}}>
                    <Text style={{color: 'orange', fontSize: 20}}>Close</Text> 
                </TouchableOpacity>
                {this.state.nameChanged || this.state.emailChanged ? 
                <TouchableOpacity
                    onPress={this.handleSavePress}>
                    <Text style={{color: 'orange', fontSize: 20}}>Save</Text> 
                </TouchableOpacity>
                : null}
            </View>
                
            {/* profile image choose */}
            <View style={{flex: 0.3, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                    onPress={this.openCamera}>
                    <Image
                        style={{height: 150, width: 150, borderRadius: 75}}
                        source={{uri: this.props.avatar}}
                        />
                    <View style={{alignSelf: 'center', position: 'absolute', bottom: 10}}>
                        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20, textShadowColor: 'black', width: '100%',}}>Edit</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{flex: 0.05}} />

            {/* Profile section*/}
            <View style={{flex: 0.2, justifyContent: 'space-around'}}>
                {/* Name Row*/}
                <View style={styles.rowContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 18}}>Name</Text> 
                    </View> 
                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
                        <TextInput 
                        onChangeText={(name) => this.setState({name, nameChanged: true})}
                        value={this.state.name}
                        style={{color: 'white', fontSize: 18, alignSelf: 'flex-end', borderBottomWidth: 1, borderColor: 'grey', alignItems: 'center',}} /> 
                    </View>
                </View>
                {/* Email Row*/}
                <View style={styles.rowContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 18}}>Email</Text> 
                    </View> 
                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
                        <TextInput 
                            onChangeText={(email) => this.setState({email, emailChanged: true})}
                            value={this.state.email}
                            style={{color: 'white', fontSize: 18, alignSelf: 'flex-end', borderBottomWidth: 1, borderColor: 'grey'}} />
                    </View>
                </View>
                {/* Birthday Row*/}
                <View style={styles.rowContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 18}}>Birthday</Text> 
                    </View> 
                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 18}}>{this.props.bday}</Text> 
                    </View>
                </View>
                
            </View>

            <Seperator />
            
            {/* Settings section*/}
            <View style={{flex: 0.2, marginTop: 30}}>
                <View style={styles.rowContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 18}}>Birthday Wishes</Text> 
                    </View> 
                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'flex-end'}}>
                        <Switch 
                            value={this.state.notifications}
                            onValueChange={(value) => this.setState({notifications: value})}/>
                    </View>
                </View>
                {/* Chat color Row*/}
                <View style={styles.rowContainer}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{color: 'white', fontSize: 18}}>Bubbles</Text> 
                    </View> 
                </View> 
                <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around'}}>
                    <TouchableOpacity
                        onPress={() => this.handleBubblePress(Colors.blueBubble)}>
                        <Image
                            style={[styles.colors, {
                                backgroundColor: Colors.blueBubble, 
                                borderColor: this.props.bubbleColor == Colors.blueBubble ? 'white' : null, 
                                borderWidth: this.props.bubbleColor == Colors.blueBubble ? 2 : 0
                                }]} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => this.handleBubblePress(Colors.pinkBubble)}>
                        <Image
                            style={[styles.colors,{
                                backgroundColor: Colors.pinkBubble, 
                                borderColor: this.props.bubbleColor == Colors.pinkBubble ? 'white' : null, 
                                borderWidth: this.props.bubbleColor == Colors.pinkBubble ? 2 : 0}]} />
                    </TouchableOpacity>

                    <TouchableOpacity                   
                        onPress={() => this.handleBubblePress(Colors.greenBubble)}>
                        <Image
                            style={[styles.colors,{
                                backgroundColor: Colors.greenBubble,
                                borderColor: this.props.bubbleColor == Colors.greenBubble ? 'white' : null, 
                                borderWidth: this.props.bubbleColor == Colors.greenBubble ? 2 : 0}]} />
                    </TouchableOpacity>

                    <TouchableOpacity                   
                        onPress={() => this.handleBubblePress(Colors.yellowBubble)}>
                        <Image
                            style={[styles.colors,{
                                backgroundColor: Colors.yellowBubble,
                                borderColor: this.props.bubbleColor == Colors.yellowBubble ? 'white' : null, 
                                borderWidth: this.props.bubbleColor == Colors.yellowBubble ? 2 : 0}]} />
                    </TouchableOpacity>
                        
                    <TouchableOpacity                   
                        onPress={() => this.handleBubblePress(Colors.purpleBubble)}>
                        <Image
                            style={[styles.colors,{
                                backgroundColor: Colors.purpleBubble,
                                borderColor: this.props.bubbleColor == Colors.purpleBubble ? 'white' : null, 
                                borderWidth: this.props.bubbleColor == Colors.purpleBubble ? 2 : 0}]} />
                    </TouchableOpacity>
                    </View>
            </View>
            
            <View style={{flex: 0.2, alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                    onPress={this.logout}>
                    <Text style={{color: 'red', fontSize: 25}}>Logout</Text> 
                </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>

        <Avatar
            small
            rounded
            source={{uri: this.props.avatar}}
            onPress={() => {this.setModalVisible(!this.state.modalVisible);}}
            activeOpacity={0.7}
            />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
    return {
        name: state.user.name,
        bday: state.user.bday,
        email: state.user.email,
        avatar: state.user.avatar,
        uid: state.user.uid,
        bubbleColor: state.settings.bubbleColor
    }
}

export default connect(mapStateToProps, {removeUser, newAvatar, updateName, updateEmail, saveBubbleColor})(ProfileModal);


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row', 
        flex: 1, 
        marginLeft: 20, 
        marginRight: 20
    },
    colors: {
        width: 30,
        height: 30,
        borderRadius: 15
    }
})