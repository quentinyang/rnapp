'use strict';

import React, {AppRegistry, StyleSheet} from 'react-native';
import Immutable, {List} from 'immutable'
import Root from './app/root';
import Tab from './app/components/Tab';
// import codePush from "react-native-code-push";

class fy360 extends React.Component {
    componentDidMount() {
        // download silently and installed the next time the app is restarted
        // codePush.sync({rollbackTimeout: 3000});
        // Prompt the user when an update is available,
        // codePush.sync({rollbackTimeout: 3000});
        // Prompt the user when an update is available, 
        // if aggree, and then display a "downloading" modal, and update immediately
        // codePush.sync({updateDialog: true, installMode: codePush.InstallMode.IMMEDIATE, rollbackTimeout: 3000});
    }
    render() {
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
