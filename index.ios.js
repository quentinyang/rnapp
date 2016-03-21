'use strict';

import React, {
    AppRegistry,
    Component,
    StyleSheet,
    View,
    Navigator,
    TouchableOpacity,
    ListView,
} from 'react-native';

import BasicComponentsDemo from './demo/BasicComponent';
import RefreshControlDemo from './demo/RefreshControl';

class fy360 extends Component {
    render() {
        return (
            <View>
                <BasicComponentsDemo />
                <RefreshControlDemo />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
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
