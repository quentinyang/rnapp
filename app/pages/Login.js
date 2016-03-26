import React from 'react-native';
const {
  StyleSheet,
  Image,
  Text,
  Linking,
  TextInput,
  TouchableHighlight,
  View
} = React;

import TabViewContainer from '../containers/TabViewContainer';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {formInfo, controllerInfo} = this.props.login;

        return (
            <View style={styles.container}>
                <View>
                    <View style={{alignItems: 'center'}}>
                        <Image
                            style={{width: 110, height: 110}}
                            source={require('../images/flower.jpg')}
                        />
                        <Text style={styles.fytitle}>
                            房源360
                        </Text>
                        <Text style={styles.fysubtitle}>
                            房源信息共享平台
                        </Text>
                    </View>
                    <View style={styles.phoneBox}>
                        <TextInput
                            style={styles.fiPhone}
                            onChangeText={(phone) => this.singleAction('phoneChanged', phone)}
                            keyboardType='numeric'
                            placeholder='手机号'
                            placeholderTextColor=''
                            maxLength={11}
                            underlineColorAndroid='transparent'
                            value={formInfo.phone}
                        />
                        <TouchableHighlight
                            style={styles.codeButton}
                            onPress={this.sendCode}
                        >
                            <Text style={styles.codeText}>
                                发送验证码
                            </Text>
                        </TouchableHighlight>
                    </View>
                    <TextInput
                        style={styles.fiCode}
                        onChangeText={(code) => this.singleAction('codeChanged', code)}
                        keyboardType='numeric'
                        placeholder='验证码'
                        maxLength={4}
                        value={formInfo.code}
                    />
                    <View style={styles.errMsgBox}>
                        <Text
                            style={styles.errMsgText}
                        >
                            {controllerInfo.err_msg}
                        </Text>
                    </View>
                    <TouchableHighlight
                        style={styles.submitButton}
                        onPress={this.handleSubmit}
                    >
                        <Text style={styles.submitText}>
                            登录
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    singleAction(action, value) {
        let {actions} = this.props;

        actions.errMsg('');
        actions[action](value);
    }

    sendCode = () => {
        let {login, actions} = this.props,
            {controllerInfo} = login;
    };

    checkForm = () => {
        let {phone, code} = this.props.login.formInfo,
            msg = '';

        if(!phone) {
            msg = 'emptyPhone';
        } else if(!code) {
            msg = 'emptyCode';
        } else if (!/^1\d{10}$/.test(phone)) {
            msg = 'phoneWrong';
        } else if (!/^\d{4}$/.test(code)) {
            msg = 'codeWrong';
        }
        return msg;
    };

    handleSubmit = (e) => {
        let {actions, navigator} = this.props;
        // let msg = this.checkForm(),
        //     {actions, navigator} = this.props;

        // msg ? actions.errMsg(errMsgs[msg]) : actions.loginSubmit();

        navigator.resetTo({
            component: TabViewContainer,
            name: 'home',
            title: '我的主页',
            hideNavBar: true
        })
    };
}

let errMsgs = {
    "emptyPhone": "请输入手机号",
    "emptyCode": "请输入手机验证码",
    "phoneWrong": "请输入正确的手机号",
    "codeWrong": "验证码不正确"
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        marginLeft: 25,
        marginRight: 25
    },
    fytitle: {
        marginTop: 10,
        fontSize: 40,
        textAlign: 'center',
        color: '#04c1ae'
    },
    fysubtitle: {
        marginTop: 10,
        marginBottom: 80,
        fontSize: 14,
        textAlign: 'center',
        color: '#3e3e3e'
    },
    phoneBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#d9d9d9',
        borderRadius: 1
    },
    fiPhone: {
        flex: 1,
        paddingLeft: 10,
        height: 45,
        fontSize: 16,
        color: '#3e3e3e',
        borderWidth: 0
    },
    codeButton: {
        width: 100,
        height: 20,
        borderLeftWidth: 1,
        borderColor: '#ccc'
    },
    codeText: {
        marginVertical: 2,
        fontSize: 15,
        color: '#8d8c92',
        textAlign: 'center'
    },
    fiCode: {
        paddingLeft: 10,
        height: 45,
        fontSize: 16,
        color: '#3e3e3e',
        borderColor: '#d9d9d9',
        borderWidth: 1,
        borderRadius: 1
    },
    errMsgBox: {
        justifyContent: 'center',
        paddingLeft: 2,
        height: 25
    },
    errMsgText: {
        fontSize: 12,
        color: '#f00'
    },
    submitButton: {
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5
    },
    submitText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    }
})

export default Login;