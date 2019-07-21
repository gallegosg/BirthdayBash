import React, {Component} from 'react';
import { 
    View,
    StyleSheet
} from 'react-native';
import { Colors, Styles } from '../Shared'

export default class Seperator extends Component {
    render() {
        return (
            <View style={styles.container} />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        height: 1,
        backgroundColor: Colors.secondaryColor,
        alignSelf: 'stretch'
    },
})