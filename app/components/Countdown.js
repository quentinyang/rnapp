'use strict';

import {
    React,
    Component,
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight
} from 'nuke';

export default class Countdown extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {code_send, code_status, num, actions} = this.props;

        if(code_send) {
            return (
                <TouchableHighlight
                    style={styles.codeButton}
                >
                    <View style={styles.codeView}>
                        <Text style={styles.codeText}>
                            {num}秒后重试
                        </Text>
                    </View>
                </TouchableHighlight>
            );
        } else {
            if(code_status) {
                return (
                    <TouchableHighlight
                        style={styles.codeButton}
                        underlayColor='#fff'
                        onPress={this.props.sendCode}
                    >
                        <View style={styles.codeView}>
                            <Text style={[styles.codeText, {color: '#ffa251'}]}>
                                发送验证码
                            </Text>
                        </View>
                    </TouchableHighlight>
                );
            } else {
                return(
                    <TouchableHighlight
                        style={styles.codeButton}
                    >
                        <View style={styles.codeView}>
                            <Text style={styles.codeText}>
                                发送验证码
                            </Text>
                        </View>
                    </TouchableHighlight>
                );
            }
        }
    }
}

const styles = StyleSheet.create({
    codeButton: {
        width: 100,
        height: 45,
        justifyContent: 'center'
    },
    codeView: {
        height: 20,
        borderLeftWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center'
    },
    codeText: {
        marginVertical: 2,
        fontSize: 15,
        color: '#8d8c92',
        textAlign: 'center'
    }
});