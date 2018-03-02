import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button
} from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
const firebase = require("firebase");
import md5 from '../lib/md5'
import {Avatar} from 'react-native-elements'
import TextField from '../Components/TextField';
import Separator from '../Components/Separator';
import {ProfileModal} from '../Components/ProfileModal'

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };

        navigation = this.props.navigation

        this.user = firebase.auth().currentUser;
        const { params } = navigation.state;
        const bday = params ? params.bday : null
        const name = params ? params.firstName : null;

        this.chatRef = this.getRef().child('Chat/' + bday);
        this.chatRefData = this.chatRef.orderByChild('order')
        this.onSend = this.onSend.bind(this);
    }
    
    static navigationOptions = ({navigation}) => (
        
        {
        gesturesEnabled: false,
        headerTitle: navigation.state.params.bday.substring(0,2) + '/' + navigation.state.params.bday.substring(3,5),
        backgroundColor: '#000',
        headerTitleStyle: {
            color: 'lightblue', 
        },
        headerStyle: {
            paddingLeft: 10,
            paddingRight: 10,
            backgroundColor: '#222'
        },
        headerTintStyle: {
            color: 'lightblue'
        },
        headerLeft: (
            <ProfileModal 
                //source={'https://api.adorable.io/avatars/100/' + navigation.state.params.name + '.png'}/>
                name={navigation.state.params.name} />
        ),
        headerRight: (
            <Button
                onPress={() => {
                    firebase.auth().signOut().then(() => {
                        navigation.dispatch({type: 'Navigation/RESET', 
                            index: 0, 
                            actions: [{ 
                                type: 'Navigate', 
                                routeName:'Login'
                            }]
                        });
                    }, function (error) {
                        // An error happened.
                    });
                }}
                title='Log Out'
                color='lightblue'
                />
          ),
      });

    getRef() {
        return firebase.database().ref();
    }

    listenForItems(chatRef) {
        chatRef.on('value', (snap) => {

            // get children as an array
            var items = [];
            snap.forEach((child) => {
                items.push({
                    _id: child.val().createdAt,
                    text: child.val().text,
                    createdAt: new Date(child.val().createdAt),
                    user: {
                        _id: child.val().uid,
                        avatar: child.val().avatar
                    }
                });
            });

            this.setState({
                loading: false,
                messages: items
            })


        });
    }

    componentDidMount() {
        console.log('Chat did mount')
        this.listenForItems(this.chatRefData);
    }

    componentWillUnmount() {
        this.chatRefData.off()
    }

    onSend(messages = []) {

        messages.forEach(message => {
            var now = new Date().getTime()
            var name = navigation.state.params.firstName;
            this.chatRef.push({
                _id: now,
                text: message.text,
                createdAt: now,
                avatar: 'https://api.adorable.io/avatars/40/' + name + '.png',
                uid: this.user.uid,
                order: -1 * now
            })
        })
        
    }

    renderBubble(props) { 
        return ( 
            <Bubble 
                {...props} 
                wrapperStyle={{
                    left: {
                        backgroundColor: '#ededed',
                    },
                    right: {
                        backgroundColor: 'lightblue'
                    }
                }} 
            />
        )}

    renderSend(props) {
        return (
            <Send 
                {...props}
                wrapperStyle={{
                    textStyle: {
                        color: 'lightblue'
                    }
                }}>
            </Send>
        );
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#333'}}>
                <GiftedChat
                    messages={this.state.messages}
                    onSend={this.onSend.bind(this)}
                    renderBubble={this.renderBubble}
                    renderSend={this.renderSend}
                    user={{
                        _id: this.user.uid,
                    }}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
        marginRight: 10,
        marginLeft: 10
    }
})