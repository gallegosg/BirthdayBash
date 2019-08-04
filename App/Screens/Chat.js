import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text
} from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import firebase from 'react-native-firebase';
import { connect } from 'react-redux';
import moment from 'moment' 
import {ifIphoneX, isIphoneX} from 'react-native-iphone-x-helper';

class Chat extends Component {
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return{
      gesturesEnabled: false,
      headerTitle: params.date,
      backgroundColor: '#111',
      headerTitleStyle: {
        color: 'white',
      },
      headerStyle: {
        backgroundColor: '#222',
      },
      // headerRight: (
      //   <Avatar
      //     small
      //     rounded
      //     containerStyle={{marginRight: 10}}
      //     source={{uri: params.avatar}}
      //   />
      // ),
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isVisible: false,
      pressedUser: {},
      bubbleColor: this.props.bubbleColor
    };

    // const { navigation } = this.props;
    const db = firebase.firestore();
    this.user = firebase.auth().currentUser;
    // const { params } = navigation.state;
    // const bday = params ? params.bday : null
    // const name = params ? params.firstName : null;

    this.chatRef = db.collection('chat').doc(this.props.bday).collection('messages');

    // this.chatRefData = this.chatRef.orderBy('order')
    this.onSend = this.onSend.bind(this);
  }

  componentDidMount = () => {
    const {setParams} = this.props.navigation;
    const { bday, avatar } = this.props
    //get month name and day from date code
    const monthInt = bday.substring(0, 2).replace(/^0+/i, '') - 1;
    const day = bday.substring(3, bday.length).replace(/^0+/i, '');
    const month = moment().month(monthInt).format("MMMM")
    const date = month + ' ' + day
    setParams({date, avatar})

    this.listenForItems(this.chatRef);
  }

  componentWillUnmount = () => {
    const unsubscribe = this.chatRef
      .onSnapshot(() => {});
    // ...
    // Stop listening to changes
    unsubscribe();
  }

  onSend = (messages = []) => {
    messages.forEach((message) => {
      this.chatRef.doc(message._id).set({
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        avatar: this.props.avatar,
        uid: this.props.uid,
        name: this.props.name
      })
        .then(() => {
          console.log('saved to chat');
        }).catch((error) => {
          console.log(error);
        });
    });
  }

  getRef = () => firebase.database().ref();

  listenForItems = (chatRef) => {
    chatRef.orderBy('createdAt', 'desc').limit(50)
      .onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          // get children as an array
          const data = doc.data()
          items.push({
            _id: data._id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.uid,
              avatar: data.avatar,
              name: data.name,
            },
          });
        });
        this.setState({
          messages: items,
        });
      });
  }

  renderBubble = (props, color) => {
    console.log(props)
    const isUser = props.currentMessage.user._id == this.props.uid;
    const hasName = props.currentMessage.user.name ? true : false;
    const hasNext = props.nextMessage.user !== undefined
    const isNextDifferent = hasNext && props.currentMessage.user._id !== props.nextMessage.user._id
    return ( 
      <View>
        <Bubble
        {...props} 
        wrapperStyle={{
          left: {
            backgroundColor: '#ededed',
            },
          right: {
            backgroundColor: color
          }
        }} 
      />
      {!isUser && hasName && (isNextDifferent || !hasNext) && <Text style={styles.bubbleNametext}>{props.currentMessage.user.name}</Text>}
      </View>
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

    onAvatarPress = (user) => {
      this.setState({
        isVisible: true,
        pressedUser: user
      })
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

    render() {
      return (
        <View style={styles.container}>
          {/* <TouchableOpacity onPress={this.logout}><Text>hello</Text></TouchableOpacity> */}
          <GiftedChat
              messages={this.state.messages}
              onSend={this.onSend.bind(this)}
              bottomOffset={ifIphoneX(36, 0)}
              renderBubble={(props) => this.renderBubble(props, this.state.bubbleColor)}
              renderSend={this.renderSend}
              onPressAvatar={(user) => this.onAvatarPress(user)}
              user={{
                  _id: this.user._user.uid,
              }}
            />
          {
            isIphoneX() &&
            <View style={{ height: 36, backgroundColor: '#fff' }} />
          }
          {/* <View style={styles.profileContainer}>
            <View style={styles.profileOverlay} />
          </View> */}
          {/* <Overlay
            isVisible={this.state.isVisible}
            windowBackgroundColor="rgba(0, 0, 0, .7)"
            overlayBackgroundColor="transparent"
            width={100}
            height={100}
            borderRadius={20}
            onBackdropPress={() => this.setState({isVisible: false})}
            >
              <View style={styles.profileContainer}>
                <Avatar
                  size='xlarge'
                  rounded
                  source={{uri: this.state.pressedUser.avatar}}
                  activeOpacity={0.7}
                  />
                <Text style={styles.profileText}>{this.state.pressedUser.name}</Text>
              </View>
            </Overlay> */}
        </View>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    name: state.user.name,
    bday: state.user.bday,
    uid: state.user.uid,
    avatar: state.user.avatar,
    bubbleColor: state.settings.bubbleColor
  }
};


export default connect(mapStateToProps, {})(Chat);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  profileText: {
    color: 'white',
    fontSize: 30,
  },
  bubbleNametext: {
    color: '#fff'
  }
})