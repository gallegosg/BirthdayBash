import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay'

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{backgroundColor: '#333'}}>
        <Spinner visible={true} />
      </View>
    );
  }
}
