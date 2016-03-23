'use strict';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    Navigator,
    TouchableOpacity,
    ListView,
} from 'react-native';

import {Image, View, Text} from 'nuke';

import PickerDemo from './demo/Picker';
import PickerIOSDemo from './demo/PickerIOS';
import AlertDemo from './demo/Alert';
import BasicComponentsDemo from './demo/BasicComponent';
import RefreshControlDemo from './demo/RefreshControl';
import ToastDemo from './demo/ToastAndroid';

class fy360 extends Component {
    render() {
        var Picker1 = PickerIOSDemo.examples[0].render;
        var Picker2 = PickerIOSDemo.examples[1].render;
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                  Welcome to React Native!
                </Text>
                <Image source={require('./assets/test.jpg')} />
                <Text style={styles.instructions}>
                  To get started, edit index.android.js
                </Text>
                <Text style={styles.instructions}>
                  Shake or press menu button for dev menu
                </Text>
                <ToastDemo />
                <AlertDemo />
                <Picker1 />
                <Picker2 />
                <PickerDemo />
                <BasicComponentsDemo />
                <RefreshControlDemo />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    }
});

AppRegistry.registerComponent('fy360', () => fy360);
