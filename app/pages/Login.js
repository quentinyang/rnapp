
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

import Countdown from '../components/Countdown'
import {loginService} from '../service/userService';
import TabViewContainer from '../containers/TabViewContainer';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            num: 60
        };
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
                            onChangeText={(phone) => this.inputPhone(phone)}
                            keyboardType='numeric'
                            placeholder='手机号'
                            placeholderTextColor=''
                            maxLength={11}
                            underlineColorAndroid='transparent'
                            value={formInfo.get('phone')}
                        />
                        <Countdown
                            num={this.state.num}
                            code_send={controllerInfo.get('code_send')}
                            code_status={controllerInfo.get('code_status')}
                            sendCode={this.sendCode}
                            actions={this.props.actions}
                        />
                    </View>
                    <TextInput
                        style={styles.fiCode}
                        onChangeText={(code) => this.singleAction('codeChanged', code)}
                        keyboardType='numeric'
                        placeholder='验证码'
                        maxLength={4}
                        value={formInfo.get('code')}
                    />
                    <View style={styles.errMsgBox}>
                        <Text style={styles.errMsgText}>
                            {controllerInfo.get('err_msg')}
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

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    singleAction(action, value) {
        let {login, actions} = this.props;
        login.controllerInfo.get('err_msg') && actions.errMsg('');
        actions[action](value);
    }

    inputPhone = (value) => {
        let {login, actions} = this.props,
            {controllerInfo} = login;
        if(controllerInfo.get('code_send')) {
            return;
        }
        if(controllerInfo.get('code_status')) {
            actions.codeStatus(false);
        }
        if(controllerInfo.get('err_msg')) {
            actions.errMsg('');
        }
        actions.phoneChanged(value);

        if(value.length === 11) {
            if(!/^1\d{10}$/.test(value)) {
                actions.errMsg(errMsgs['phoneWrong']);
            } else {
                actions.codeStatus(true);
            }
        }
    };

    sendCode = () => {
        let self = this;
        let {login, actions} = self.props;

        actions.codeSend(true);
        self.onStart();
    };

    onStart = () => {
        clearTimeout(this.timer);
        this.refreshTime();
    };

    refreshTime = () => {
        if(this.state.num <= 0) {
            this.onEnd();
            return;
        }
        let sec = --this.state.num;
        this.timer = setTimeout(() => {
            this.setState({num: sec});
            this.refreshTime();
        }, 1000);
    };

    onEnd = () => {
        clearTimeout(this.timer);
        this.setState({num: 60});
        this.props.actions.codeSend(false);
    };

    checkForm = () => {
        let {formInfo} = this.props.login,
            phone = formInfo.get('phone'),
            code = formInfo.get('code'),
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
        let msg = this.checkForm(),
            {actions, navigator, login} = this.props;

        //msg ? actions.errMsg(errMsgs[msg]) : actions.loginSubmit(login.formInfo);
        if(msg) {
            actions.errMsg(errMsgs[msg])
        } else {
            loginService({body:login.formInfo})
            .then((oData) => {
                navigator.resetTo({
                    component: TabViewContainer,
                    name: 'home',
                    title: '我的主页',
                    hideNavBar: true
                });
            })
            .catch((error) => {
                console.error('Ajax Error: ' + error);
            })
        }
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