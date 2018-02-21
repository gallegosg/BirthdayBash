import React, {Component} from 'react';
import { 
    View,
    Text,
    TextInput,
    StyleSheet
} from 'react-native';
import { Colors, Styles } from '../Shared'

export default class MyTextField extends Component {
    render() {
        return (
            <View style={styles.container}>
                <TextInput 
                    style={[styles.text, this.props.style]}
                    placeholderTextColor={'grey'}
                    placeholder={this.props.placeholder}
                    onChangeText={this.props.onChangeText}
                    value={this.props.value}
                    secureTextEntry={this.props.secureTextEntry}
                    />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        width: 300,
        fontSize: 18,
        height: 35,
        color: 'white'
    }
})