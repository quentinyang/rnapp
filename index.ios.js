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
import Root from './app/root';
import ToastDemo from './demo/ToastAndroid';
import ButtonDemo from './demo/Button'
import ModalDemo from './demo/Modal'

import codePush from "react-native-code-push";

class fy360 extends Component {
  componentDidMount() {
    // download silently and installed the next time the app is restarted
    codePush.sync({rollbackTimeout: 3000});
    // Prompt the user when an update is available,
    // if aggree, and then display a "downloading" modal, and update immediately
    // codePush.sync({updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE, rollbackTimeout: 3000});
  }

  render() {

    var DeviceInfo = require('react-native-device-info');
    console.log("Device Unique ID", DeviceInfo.getUniqueID());

    var Picker1 = PickerIOSDemo.examples[0].render;
    var Picker2 = PickerIOSDemo.examples[1].render;
    return (
        <Root />
    );
  }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
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
