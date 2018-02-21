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

import TextField from '../Components/TextField';
import Separator from '../Components/Separator';

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: []
        };

        navigation = this.props.navigation

        this.user = firebase.auth().currentUser
        const { params } = navigation.state;
        const bday = params ? params.bday : null

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
            backgroundColor: '#222'
        },
        headerTintStyle: {
            color: 'lightblue'
        },
        headerLeft: null,
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
                var avatar = 'https://www.gravatar.com/avatar/' + (md5(this.user.email))
                var name = this.user.name
                items.push({
                    _id: child.val().createdAt,
                    text: child.val().text,
                    createdAt: new Date(child.val().createdAt),
                    user: {
                        _id: child.val().uid,
                        avatar: avatar
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

        // this.setState({
        //     messages: GiftedChat.append(this.state.messages, messages),
        // });
        messages.forEach(message => {
            var now = new Date().getTime()
            this.chatRef.push({
                _id: now,
                text: message.text,
                createdAt: now,
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