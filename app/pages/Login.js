import {
    React,
    Component,
    View,
    Text,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    TextInput,
    TouchableHighlight,
    PixelRatio,
    ScrollView
} from 'nuke';

import ReactNative from 'react-native';
import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import Countdown from '../components/Countdown'
import {loginService, sendCodeService} from '../service/userService';
import TabViewContainer from '../containers/TabViewContainer';
import TouchWebContainer from "../containers/TouchWebContainer";

import AttentionBlockSetContainer from '../containers/AttentionBlockSetContainer';
import {parseUrlParam} from '../utils/CommonUtils';
import DeviceInfo from 'react-native-device-info';
import FormContainer from '../components/FormContainer';
import * as common from '../constants/Common';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import  {setLoginDays} from '../containers/app';

class Login extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_LOGIN;
        ActionUtil.setActionWithExtend(actionType.BA_LOGIN_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {formInfo, controllerInfo} = this.props.login;

        return (
            <View style={styles.container}>
            <FormContainer style={styles.container} ref="formContainer" scrollViewRef="scrollView">
             <KeyboardAvoidingView behavior={"position"} >
                <View style={styles.imgRightBox}>
                    <Image
                        style={styles.fyImage}
                        source={require('../images/shape.png')}
                    />
                </View>
                <View style={[styles.alignItems, styles.logoWrapper]}>
                    <Image style={[styles.nameLogo]} source={require("../images/name_logo.png")} />
                </View>

                <Text style={styles.fysubtitle}>仅限二手房经纪人使用</Text>
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
                            onFocus={this.inputFocused.bind(this, 'phone', actionType.BA_LOGIN_PHONENUM)}
                        />
                        <Countdown
                            num={controllerInfo.get('num')}
                            code_send={controllerInfo.get('code_send')}
                            code_status={controllerInfo.get('code_status')}
                            sendCode={this.sendCode}
                            actions={this.props.actions}
                        />
                    </View>
                    <View style={styles.codeBox}>
                        <TextInput
                            ref='code'
                            style={styles.fiPhone}
                            onChangeText={(code) => this.singleAction('codeChanged', code)}
                            keyboardType='numeric'
                            placeholder='验证码'
                            maxLength={4}
                            underlineColorAndroid='transparent'
                            value={formInfo.get('code')}
                            onFocus={this.inputFocused.bind(this, 'code', actionType.BA_LOGIN_INPUTCODE)}
                        />
                    </View>
                    <View style={styles.errMsgBox}>
                        <Text style={styles.errMsgText}>{controllerInfo.get('err_msg')}</Text>
                    </View>
                    <TouchableHighlight
                        style={styles.submitButton}
                        underlayColor='#04c1ae'
                        onPress={this.handleSubmit}
                    >
                        <View><Text style={styles.submitText}>登录</Text></View>
                    </TouchableHighlight>
                </View>
            </KeyboardAvoidingView>
            </FormContainer>
            <Agreement navigator={this.props.navigator} />
            </View>
        );
    }

    componentWillUnmount() {
        this.singleAction('loginCleared');
        this.timer && clearTimeout(this.timer);
    }

    inputFocused (refName, actionLog) {
        ActionUtil.setAction(actionLog);
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
        ActionUtil.setAction(actionType.BA_LOGIN_SENDCODE);
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
        ActionUtil.setAction(actionType.BA_LOGIN_ENSURE);
        let msg = this.checkForm(),
            {actions, actionsApp, navigator, login} = this.props,
            data = Object.assign({}, login.formInfo.toJS(), {device_id: DeviceInfo.getUniqueID()});

        if(msg) {
            actions.errMsg(errMsgs[msg]);
        } else {
            actionsApp.appLoadingChanged(true);
            loginService(data)
            .then((oData) => {
                AsyncStorageComponent.save(common.USER_TOKEN_KEY, oData.token);
                AsyncStorageComponent.save(common.USER_PHONE, data.phone);
                AsyncStorageComponent.save(common.USER_ID, oData.user_id || "");
                ActionUtil.setUid(oData.user_id || "");
                setLoginDays(oData.user_id);
                actionsApp.setSearchHistory(oData.user_id || "0");
                actionsApp.appLoadingChanged(false);
                gtoken = oData.token;
                guid = oData.user_id;
                actionsApp.setAppUserConfig();
                if(oData.is_enter_attention_page) {
                    navigator.resetTo({
                        component: TabViewContainer,
                        name: 'home',
                        title: '我的主页',
                        hideNavBar: true,
                        bp: this.pageId
                    });
                    if(gpage) {
                        let params = parseUrlParam(unescape(gpage));
                        let goRoute = routes[params.name] ? Object.assign(routes[params.name], params) : null;
                        goRoute && navigator.push(goRoute);
                    }
                } else {
                    navigator.resetTo({
                        component: AttentionBlockSetContainer,
                        name: 'AttentionBlockSetContainer',
                        title: '设置我的关注',
                        hideNavBar: true,
                        bp: this.pageId
                    });
                }
            })
            .catch((error) => {
                actionsApp.appLoadingChanged(false);
                //let msg = error.msg, rs = msg.includes('\n') ? msg.replace('\n', ',') ? msg;

                let msg = error.msg;
                if(msg.includes('\n')) {
                    msg = msg.replace('\n', ',');
                }
                actions.errMsg(msg);
            })
        }
    };
}

class Agreement extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableHighlight underlayColor="transparent" onPress={this.goLink}>
                <View style={[styles.row, styles.center, {height: 40}]}>
                    <Text style={{fontSize: 12, color: '#8d8c92'}}>登录表明同意</Text>
                    <Text style={{fontSize: 12, color: '#04c1ae'}}>《用户协议》</Text>
                </View>
            </TouchableHighlight>
        );
    }

    goLink = () => {
        this.props.navigator.push({
            component: TouchWebContainer,
            url:'https://mp.weixin.qq.com/s?__biz=MzAxNDYyMTA0NQ==&mid=505710246&idx=1&sn=f5df3a0827688930a98b625bdf772f54&scene=0&uin=OTA2NDQ0MzAx&key=77421cf58af4a6530c369d591633f60ffb6af03c88c1247f6a13933258c27d3b7348336897a5c57d11143bdf395983c2&devicetype=iMac+MacBookPro11%2C1+OSX+OSX+10.10.5+build(14F1713)&version=11020201&lang=zh_CN&pass_ticket=jnN7tPBr%2BOSovurKr9I8a1x%2Fc5UqzoOKQ7Vj96YVWw1Q2%2B5KjRdwHbMDFuohSHZY',
            title: '第一房源用户协议',
            name: 'user rule'
        });
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
    row: {
        flexDirection: 'row'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    alignItems: {
        alignItems: "center"
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
    logoWrapper: {
        marginTop: -40
    },
    nameLogo: {
        width: 173,
        height: 44,
        marginBottom: 5
    },
    fysubtitle: {
        marginTop: 10,
        marginBottom: 60,
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
        borderWidth: 1/PixelRatio.get(),
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
    codeBox: {
        borderColor: '#d9d9d9',
        borderWidth: 1/PixelRatio.get(),
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