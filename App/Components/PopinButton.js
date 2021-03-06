import React, { Component } from 'react';
import PropTypes from 'prop-types'
import { Animated, TouchableWithoutFeedback } from 'react-native';

export default class PopinButton extends Component {
  componentWillMount = () => {
    this.animatedValue = new Animated.Value(1);
  }

  handlePressIn = () => {
    Animated.spring(this.animatedValue, {
      toValue: this.props.shrinkTo
    }).start()
  }

  handlePressOut = () => {
    Animated.spring(this.animatedValue, {
      toValue: 1,
      tension: 50,
      friction: 10
    }).start();
    this.props.onPress()
  }
  
  render() {
    const animatedStyles = { transform: [{scale: this.animatedValue }]};
    return (
      <TouchableWithoutFeedback
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}>
        <Animated.View 
          useNativeDriver={true}
          style={[this.props.style, animatedStyles]}>
          {this.props.children}
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

PopinButton.propTypes = {
  onPress: PropTypes.func.isRequired
}

PopinButton.defaultProps = {
  shrinkTo: 0.9
}