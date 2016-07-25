'use strict';

import {React, Component, AppRegistry, StyleSheet} from 'nuke';
import Root from './app/root';
import codePush from "react-native-code-push";
var RCTLog = require('RCTLog');

// disable Yellow Box
console.disableYellowBox = true;
global.gpage = '';

class fy360 extends Component {
    componentDidMount() {
        // download silently and installed the next time the app is restarted
        codePush.sync({rollbackTimeout: 3000});
        // Prompt the user when an update is available,
        // if aggree, and then display a "downloading" modal, and update immediately
        // codePush.sync({updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE, rollbackTimeout: 3000});
    }
    componentWillMount() {
        gpage = this.props.page;
    }
    render() {
        return (
            <Root />
        );
    }
}

AppRegistry.registerComponent('fy360', () => fy360);
