'use strict';
import React from 'react-native';

import { Button, Text, Component, StyleSheet, View } from 'nuke'

export default class ButtonDemo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            msg: 'Press Button'
        }
    }
    render() {
        return (
            <View style={{margin: 50}}>
                <Text>{this.state.msg}</Text>

                <Button onPress={this._pressed.bind(this)} onLongPress={this._longPress.bind(this)} itemStyle={styles.button} label="normal button"/>
                <Button disabled={true} onPress={this._pressed.bind(this)} onLongPress={this._longPress.bind(this)} label="disable button"/>
            </View>

        );
    }

    _pressed() {
        this.setState({
            msg: 'You have pressed the button!'
        });
    }
    _longPress() {
        this.setState({
            msg: 'You have long pressed the button!'
        });
    }
}


const styles = StyleSheet.create({
    button: {
        color: '#333',
        marginBottom: 20
    }
});

