import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button
} from 'react-native';
const firebase = require("firebase");
import md5 from '../lib/md5'
import {Overlay, Avatar} from 'react-native-elements'

export default class ProfileOverlay extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        };
    }

    setModalVisible(visible) {
        this.setState({isVisible: visible});
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#333'}}>
                <Overlay
                    isVisible={this.state.isVisible}
                    windowBackgroundColor="rgba(255, 255, 255, .5)"
                    overlayBackgroundColor="red"
                    width={100}
                    height={100}
                    onBackdropPress={() => this.setState({isVisible: false})}
                    >
                        <Text>Hello from Overlay!</Text>
                    </Overlay>;
                <Avatar
                    small
                    rounded
                    source={{uri: 'https://api.adorable.io/avatars/150/jennfier.png'}}
                    onPress={() => {this.setModalVisible(!this.state.modalVisible);}}
                    activeOpacity={0.7}
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