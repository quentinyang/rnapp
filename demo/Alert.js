'use strict';

var React = require('react-native');
var {
    AlertIOS,
    StyleSheet,
    TouchableHighlight,
} = React;

import { Text, View, Alert} from 'nuke';

var alertMessage = '亲，积分不够啦~<br>您可以发房赚积分或去充值~';

var AlertExample = React.createClass({

  render: function() {
    return (
        <View>
            <Text style={[styles.mark, styles.top]}>//Alert,Android和iOS通用。但Android在大于三个选项时只显示前三个。</Text>
            <Text style={styles.mark}>//AlertIOS,多一个prompt功能，只在iOS上有用。用于在弹层内的输入框。目前业务没有此用法</Text>
            <TouchableHighlight style={styles.wrapper}
                onPress={() => Alert.alert(
                    'Alert Title',
                    '消耗4积分即可获得房东电话',
                    [{text: '确认', onPress: () => console.log('xxx')}]
                )}>
                <View style={styles.button}>
                    <Text>Alert with message and default button</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.wrapper}
                onPress={() => AlertIOS.prompt(
                    'Enter password',
                    'Enter your password to clain your $1.58 in lottery winnings',
                    [
                        {text: 'Cancel', onPress: () => alert('Cancel'), style: {backgroundColor: '#f00'}},
                        {text: 'OK', onPress: password => alert('OK,Password:' + password)},
                    ],
                    'secure-text',
                    '123456'
                )}>
                <View style={styles.button}>
                    <Text>prompt</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.wrapper}
                onPress={() => Alert.alert(
                    'Alert Title',
                    alertMessage,
                    [
                        {text: '去发房', onPress: () => console.log('Cancel Pressed!')},
                        {text: '去充值', onPress: () => console.log('OK Pressed!')},
                    ]
                )}>
                <View style={styles.button}>
                    <Text>联系房东</Text>
                </View>
            </TouchableHighlight>
            <TouchableHighlight style={styles.wrapper}
                onPress={() => Alert.alert(
                    'Foo Title',
                    alertMessage,
                    '..............'.split('').map((dot, index) => ({
                        text: 'Button ' + index,
                        onPress: () => console.log('Pressed ' + index)
                    }))
                )}>
                <View style={styles.button}>
                    <Text>Alert with too many buttons</Text>
                </View>
            </TouchableHighlight>
        </View>
    );
  },
});

var styles = StyleSheet.create({
    top: {
        marginTop: 20,
    },
    mark: {
        fontSize: 12,
        color: '#666',
    },
    wrapper: {
        borderRadius: 15,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#eeeeee',
        padding: 10,
    },
});

module.exports = AlertExample;