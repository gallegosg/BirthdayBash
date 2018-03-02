import React, {Component} from 'react';
import {Modal, Text, TouchableHighlight, View} from 'react-native';
import {Avatar} from 'react-native-elements'

export class ProfileModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            name: this.props.name
        };
    }

    componentWillMount = () => {
        this.setState({
            name: this.props.name
        })
        console.log(this.state.name)
    }

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert('Modal has been closed.');
          }}>
          {/* THis View the inside of the modal*/}
          <View style={{flex: 1, backgroundColor: '#333'}}>
            <View style={{alignItems: 'center'}}>
                <Avatar
                    large
                    rounded
                    source={{uri: 'https://api.adorable.io/avatars/150/' + this.state.name + '.png'}}
                    onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);}}
                    activeOpacity={0.7}
                    />
                <Text style={{color: 'white', fontSize: 50}}>Name: {this.state.name}</Text>

                <TouchableHighlight
                    onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    }}>
                    <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Avatar
                small
                rounded
                source={{uri: 'https://api.adorable.io/avatars/150/' + this.state.name + '.png'}}
                onPress={() => {this.setModalVisible(!this.state.modalVisible);}}
                activeOpacity={0.7}
                />
      </View>
    );
  }
}