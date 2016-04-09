import {
    React,
    Component,
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableHighlight,
    ScrollView
} from 'nuke';


import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import Countdown from '../components/Countdown'
import {loginService, sendCodeService} from '../service/userService';
import TabViewContainer from '../containers/TabViewContainer';

import AttentionBlockSetContainer from '../containers/AttentionBlockSetContainer';

import DeviceInfo from 'react-native-device-info';
import FormContainer from '../components/FormContainer';
import * as common from '../constants/Common';

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {formInfo, controllerInfo} = this.props.login;

        return (
            <FormContainer ref="formContainer" scrollViewRef="scrollView">
                <View style={styles.imgRightBox}>
                    <Image
                        style={styles.fyImage}
                        source={require('../images/shape.png')}
                    />
                </View>
                <Text style={styles.fytitle}>房源360</Text>
                <Text style={styles.fysubtitle}>房源信息共享平台</Text>
                <View style={styles.layout}>
                    <View style={styles.phoneBox}>
                        <TextInput
                            ref='phone'
                            style={styles.fiPhone}
                            onChangeText={(phone) => this.inputPhone(phone)}
                            keyboardType='numeric'
                            placeholder='手机号'
                            placeholderTextColor=''
                            maxLength={11}
                            underlineColorAndroid='transparent'
                            value={formInfo.get('phone')}
                            onFocus={this.inputFocused.bind(this, 'phone')}
                        />
                        <Countdown
                            num={controllerInfo.get('num')}
                            code_send={controllerInfo.get('code_send')}
                            code_status={controllerInfo.get('code_status')}
                            sendCode={this.sendCode}
                            actions={this.props.actions}
                        />
                    </View>
                    <TextInput
                        ref='code'
                        style={styles.fiCode}
                        onChangeText={(code) => this.singleAction('codeChanged', code)}
                        keyboardType='numeric'
                        placeholder='验证码'
                        maxLength={4}
                        value={formInfo.get('code')}
                        onFocus={this.inputFocused.bind(this, 'phone')}
                    />
                    <View style={styles.errMsgBox}>
                        <Text style={styles.errMsgText}>{controllerInfo.get('err_msg')}</Text>
                    </View>
                    <TouchableHighlight
                        style={styles.submitButton}
                        underlayColor='#04c1ae'
                        onPress={this.handleSubmit}
                    >
                        <Text style={styles.submitText}>登录</Text>
                    </TouchableHighlight>
                </View>
            </FormContainer>
        );
    }

    componentWillUnmount() {
        this.singleAction('loginCleared');
        this.timer && clearTimeout(this.timer);
    }

    inputFocused (refName) {
        setTimeout(() => {
            let scrollResponder = this.refs.formContainer.refs.scrollView.getScrollResponder();

            scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
              React.findNodeHandle(this.refs[refName]),
              120, //additionalOffset
              true
            );
        }, 50);
    }

    singleAction(action, value) {
        let {login, actions} = this.props;
        login.controllerInfo.get('err_msg') && actions.errMsg('');
        actions[action](value);
    }

    componentDidMount() {
        let phone = this.props.route.phone;

        if(phone && /^1\d{10}$/.test(phone)) {
            this.singleAction('phoneChanged', phone);
            this.singleAction('codeStatus', true);
        }
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
        let self = this,
            {login, actions} = self.props,
            data = {
                phone: self.props.login.formInfo.get('phone')
            };

        sendCodeService({body:data})
        .then((oData) => {
            actions.codeSend(true);
            self.onStart();
        })
        .catch((error) => {
            actions.errMsg(error.msg);
        })
    };

    onStart = () => {
        clearTimeout(this.timer);
        this.refreshTime();
    };

    refreshTime = () => {
        let {login, actions} = this.props,
            num = login.controllerInfo.get('num'),
            sec = --num;

        if(num <= 0) {
            this.onEnd();
            return;
        }
        this.timer = setTimeout(() => {
            actions.numChanged(sec);
            this.refreshTime();
        }, 1000);
    };

    onEnd = () => {
        let {actions} = this.props;
        clearTimeout(this.timer);

        actions.numChanged(60);
        actions.codeSend(false);
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
            {actions, navigator, login} = this.props,
            data = Object.assign({}, login.formInfo.toJS(), {device_id: DeviceInfo.getUniqueID()});

        if(msg) {
            actions.errMsg(errMsgs[msg]);
        } else {
            loginService(data)
            .then((oData) => {
                AsyncStorageComponent.save(common.USER_TOKEN_KEY, oData.token);
                AsyncStorageComponent.save(common.USER_PHONE, data.phone);
                gtoken = oData.token;
                if(oData.is_enter_attention_page) {
                    navigator.resetTo({
                        component: TabViewContainer,
                        name: 'home',
                        title: '我的主页',
                        hideNavBar: true
                    });
                } else {
                    navigator.resetTo({
                        component: AttentionBlockSetContainer,
                        name: 'AttentionBlockSetContainer',
                        title: '设置我的关注',
                        hideNavBar: true
                    });
                }
            })
            .catch((error) => {
                actions.errMsg(error.msg);
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
        flex: 1
    },
    content: {
        justifyContent: 'center',
    },
    imgRightBox: {
        alignItems: 'flex-end'
    },
    fyImage: {
        width: 123,
        height: 215
    },
    fytitle: {
        marginTop: -80,
        fontSize: 40,
        textAlign: 'center',
        color: '#04c1ae',
        backgroundColor: 'transparent'
    },
    fysubtitle: {
        marginTop: 10,
        marginBottom: 80,
        fontSize: 14,
        textAlign: 'center',
        color: '#3e3e3e',
        backgroundColor: 'transparent'
    },
    layout: {
        marginLeft: 25,
        marginRight: 25
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