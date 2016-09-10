'use strict';

import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import {React, Component, Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View, Image, Alert, Modal, TouchableHighlight,
    PixelRatio, TouchableWithoutFeedback, Linking, InteractionManager, NetInfo, AppState} from 'nuke';
import {navigationContext} from 'react-native'
import {NaviGoBack, parseUrlParam} from '../utils/CommonUtils';
require('../config/route');
import LoginContainer from '../containers/LoginContainer';
import AboutEXPContainer from './AboutEXPContainer';
import TabViewContainer from '../containers/TabViewContainer';
import WelfareContainer from '../containers/WelfareContainer';
import * as common from '../constants/Common';
import * as notifConst from '../constants/Notification';
import BackScore from '../pages/BackScore'
var GeTui = require('react-native').NativeModules.GeTui;
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
let NotificationHandler = require('../utils/NotificationHandler');
import { NativeAppEventEmitter, DeviceEventEmitter } from 'react-native';
import { setLoginDaysService } from '../service/configService';
import Toast from 'react-native-root-toast';
import MessageNoticeModal from '../components/MessageNoticeModal';
import WelfareModal from '../components/WelfareModal';
import AuthenticationContainer from '../containers/AuthenticationContainer';
import SelectCityContainer from '../containers/SelectCityContainer';
import AttentionBlockSetContainer from '../containers/AttentionBlockSetContainer';

let _navigator;
global.gtoken = '';
global.gcid = '';
global.guid = '';

class App extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this.hasShowAttention = false;
        let {actionsApp} = this.props;

        this.routeStack = [];
        this.state = {
            showModal: false,
            hasSetRoute: false
        };

        BackAndroid.addEventListener('hardwareBackPress', this._goBack);
        AsyncStorageComponent.multiGet([common.USER_TOKEN_KEY, common.USER_ID, common.CITY_ID])
        .then((value) => {
            let len = value.length;
            for(let i=0; i<len; i++) {
                switch (value[i][0]) {
                    case common.USER_TOKEN_KEY:
                        gtoken = value[i][1];
                        break;
                    case common.USER_ID:
                        if(value[i][1]) {
                            guid = value[i][1];
                            actionsApp.setSearchHistory(value[i][1] || "0");
                            ActionUtil.setUid(value[i][1]);
                        }
                        break;
                    case common.CITY_ID:
                        ActionUtil.setCcid(value[i][1]);
                        global.gccid = value[i][1];
                        break;
                }
            }

            if(!gtoken) {
                self.routeStack.push({
                    component: LoginContainer,
                    name: 'login',
                    title: '登陆',
                    hideNavBar: true
                });
                self.setState({
                    hasSetRoute: true
                });
            } else {
                if(Platform.OS == "ios" && gpage) {
                    self.routeStack.push(routes["home"]);
                    let params = parseUrlParam(unescape(gpage));
                    routes[params.name] && self.routeStack.push(Object.assign(routes[params.name], params));
                    self.setState({
                        hasSetRoute: true
                    });
                } else {
                    self.routeStack.push(routes["home"]);
                    self.setState({
                        hasSetRoute: true
                    });
                }
                actionsApp.setAppUserConfig();
                setLoginDays(guid);
            }
        })
        .catch((error) => {
            console.log(error);
        });

        if(Platform.OS === 'ios') {
            this.unlistenNotification =  NativeAppEventEmitter.addListener('clientIdReceived', (cId) => {
                self._clientIdReceived(cId);
            });
            this.unlistenPage =  NativeAppEventEmitter.addListener('goPage', (obj) => {
                let navRoute = _navigator.getCurrentRoutes(), len = navRoute.length;
                let params = parseUrlParam(unescape(obj.page));

                //当app在要打开的页面时，从外部打开后，无需跳转
                if(len && navRoute[len-1].name !== params.name) {
                    let goRoute = routes[params.name] ? Object.assign(routes[params.name], params) : null;
                    goRoute && gtoken && _navigator.push(goRoute);
                    gpage = obj.page;
                }
            });
        } else {
            DeviceEventEmitter.addListener('clientIdReceived', (cId) => {
                self._clientIdReceived(cId);
            });

            DeviceEventEmitter.addListener('goPage', (page) => {
                let navRoute = _navigator.getCurrentRoutes(), len = navRoute.length;
                let params = parseUrlParam(unescape(page));

                //当app在要打开的页面时，从外部打开后，无需跳转
                if(len && navRoute[len-1].name !== params.name) {
                    let goRoute = routes[params.name] ? Object.assign(routes[params.name], params) : routes['home'];
                    gtoken && _navigator.push(goRoute);
                    gpage = page;
                }
            });
        }

    }

    render() {
        let {hasSetRoute} = this.state;
        let {appData, messageNotice, actionsApp} = this.props;
        let isAndroid = (Platform.OS == "android");
        // (isAndroid && appData.get('config').get('isCidLogin'))
        return (
            <View style={styles.flex}>
                <MessageNoticeModal
                    visible={messageNotice.get('visible')}
                    message={messageNotice.get('msg')}
                    onClose={() => {
                        actionsApp.msgNoticeVisibleChanged(false);
                    }}
                    onSure={() => {
                        actionsApp.msgNoticeVisibleChanged(false);
                    }}
                />
                <WelfareModal
                    isVisible={appData.get('verifiedResult').get('visible')}
                    title="身份审核通过"
                    goTitle="看房卡怎么用"
                    subTitle={appData.get('verifiedResult').get('welfare_cards').size}
                    welfareData={appData.get('verifiedResult').get('welfare_cards')}
                    closeModal={() => {
                        actionsApp.verifiedResultVisibleChanged(false);
                    }}
                    goPage={() => {
                        actionsApp.verifiedResultVisibleChanged(false);
                        _navigator.push({
                            component: WelfareContainer,
                            name: 'welfare',
                            title: '看房卡',
                            hideNavBar: false
                        });
                    }}
                />
                <MessageNoticeModal
                    visible={appData.get('verifiedNotice').get('visible')}
                    message={appData.get('verifiedNotice').get('msg')}
                    hideClose={appData.get('verifiedNotice').get('hideClose')}
                    onClose={() => {
                        switch(appData.get('verifiedNotice').get('from')) {
                        case "detail":
                            ActionUtil.setAction(actionType.BA_DETAIL_IDENTITY_DELETE);
                            break;
                        case "charge":
                            ActionUtil.setAction(actionType.BA_MINE_RECHANGE_ENSURE_DELETE);
                            break;
                        case "noVerify":
                            ActionUtil.setAction(actionType.BA_MINE_IDENTITY_REVIEWBOX_DELETE);
                            break;
                        case "inVerify":
                            ActionUtil.setAction(actionType.BA_MINE_IDENTITY_NOREVIEWBOX_DELETE);
                            break;
                        default:
                            break;
                        }
                        actionsApp.verifiedNoticeVisibleChanged(false);
                    }}
                    onSure={() => {
                        switch(appData.get('verifiedNotice').get('from')) {
                        case "detail":
                            ActionUtil.setAction(actionType.BA_DETAIL_IDENTITY_SURE);
                            break;
                        case "charge":
                            ActionUtil.setAction(actionType.BA_MINE_RECHANGE_ENSURE_SURE);
                            break;
                        case "noVerify":
                            ActionUtil.setAction(actionType.BA_MINE_IDENTITY_REVIEWBOX_SURE);
                            break;
                        case "inVerify":
                            ActionUtil.setAction(actionType.BA_MINE_IDENTITY_NOREVIEWBOX_SURE);
                            break;
                        default:
                            break;
                        }
                        actionsApp.verifiedNoticeVisibleChanged(false);
                        if(appData.get('verifiedNotice').get('from') != "inVerify") {
                            _navigator.push({
                                component: AuthenticationContainer,
                                name: "auth",
                                title: "身份认证",
                            });
                        }
                    }}
                />
                <LogoutModal
                    logoutInfo={appData.get('auth')}
                    logoutSure={this._logoutSure}
                />
                <Modal visible={this.state.showModal} transparent={true} onRequestClose={() => {}}>
                    <View style={styles.bgWrap}>
                        <View style={styles.contentContainer}>
                            <Text style={[styles.modalTitle, styles.baseColor]}>提示</Text>
                            <Text style={[styles.modalContent, styles.baseColor]}>您的帐号在另外一个设备登录，被迫下线！</Text>
                            <TouchableHighlight
                                underlayColor='#fff'
                                onPress={this._hideModel.bind(this)}
                            >
                                <View style={styles.flex}>
                                    <Text style={[styles.modalBtn, styles.flex]}>知道了</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>

                <Modal visible={appData.get('config').get('showUpdateModal')} transparent={true} onRequestClose={() => {}}>
                    <View style={styles.bgWrap}>
                        <View style={styles.updateContentContainer}>
                            <View style={[styles.alignItems, styles.justifyContent]}>
                                <Image style={styles.updateAppImage} source={require('../images/update_app.png')}/>
                                <Text style={styles.updateModalHeader}>{"大批真实房源来了,\n快更新吧"}</Text>
                            </View>
                            <View style={[styles.row, styles.updateWrap]}>
                                {!appData.get('config').get('isEnforceUpdate') ?
                                <TouchableHighlight
                                    onPress={actionsApp.closeUpdateModal.bind(null, false)}
                                    style={styles.flex}
                                    underlayColor='#fff'
                                >
                                    <View style={[styles.updateBtnLeft, styles.alignItems, styles.justifyContent]}>
                                        <Text style={[styles.updateBtnLeftText]}>暂不更新</Text>
                                    </View>
                                </TouchableHighlight>
                                : null}

                                <TouchableHighlight
                                    onPress={this._downAppModel.bind(this)}
                                    style={styles.flex}
                                    underlayColor='#fff'
                                >
                                    <View style={[styles.updateBtnRight, styles.alignItems, styles.justifyContent]}>
                                        <Text style={[styles.updateBtnRightText]}>立即更新</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>

                <Modal visible={appData.get('loadingVisible')} transparent={true} onRequestClose={() => {}}>
                    <View style={[styles.flex, styles.alignItems, styles.justifyContent]}>
                        <Image source={require('../images/loading.gif')} style={styles.loading} />
                    </View>
                </Modal>

                <LevelModal levelNotice={appData.get('levelNotice')} closeFn={() => this.closeLevelModal()} linkFn={() => this.goExp(appData.get('levelNotice').get('data').toJS())} />

                {
                    hasSetRoute ?
                        <Navigator
                            style={styles.flex}
                            configureScene={this._configureScene}
                            renderScene={this._renderScene}
                            sceneStyle={styles.sceneStyle}
                            navigationBar={this._navBar()}
                            onWillFocus={this._willFocus}
                            initialRouteStack={this.routeStack}
                        /> : null
                }
            </View>
        )
    }

    closeLevelModal = () => {
        this.props.actionsApp.levelModalChanged(false);
    };

    goExp = (data) => {
        this.props.actionsApp.levelModalChanged(false);
        _navigator.push({
            component: AboutEXPContainer,
            name: 'exp',
            title: '我的等级',
            data: data
        });
    };

    _hideModel() {
        let {actionsApp} = this.props;

        AsyncStorageComponent.get('user_phone')
            .then((value) => {
                this.setState({
                    showModal: false
                });
                // actionsApp.closeLoginModal(false);
                _navigator.resetTo({
                    component: LoginContainer,
                    name: 'login',
                    title: '登录',
                    phone: value,
                    hideNavBar: true
                });
            });
    }

    _downAppModel() {
        Linking.openURL('http://www.fangyuan360.cn/download/app')
    }

    componentDidUpdate() {
        let {appData, actionsApp, appUserConfig} = this.props;

        if (appData.get('msg') !== '') {
            Alert.alert('提示', appData.get('msg'), [
                {
                    text: '确定',
                    onPress: () => {
                        actionsApp.webNetWorkError('');
                    }
                }
            ])
        }

        if(!this.hasShowAttention && appUserConfig.get('isSelectCity') != null && appUserConfig.get('isSelectAttention') != null) {
            this.hasShowAttention = true;
            if(!appUserConfig.get('isSelectCity')) {
                _navigator.resetTo({
                    component: SelectCityContainer,
                    name: 'selectCity',
                    title: '选择城市',
                    hideNavBar: false
                });
            } else if(!appUserConfig.get('isSelectAttention')) {
                 _navigator.resetTo({
                    component: AttentionBlockSetContainer,
                    name: 'AttentionBlockSetContainer',
                    title: '',
                    hideNavBar: false
                });
            }
        }        
    }

    componentDidMount() {
        let {actionsApp} = this.props;

        InteractionManager.runAfterInteractions(() => {
            actionsApp.setAppConfig();
        });

        GeTui.getClientId((cId) => {
            this._clientIdReceived(cId)
        });
        if(Platform.OS === 'ios') {
            this.geTuiDataReceived =  NativeAppEventEmitter.addListener('geTuiDataReceived', (notifData) => {
                this._geTuiDataReceivedHandle(notifData);
            });

            this.setGeTuiOpenAction =  NativeAppEventEmitter.addListener('setGeTuiOpenAction', () => {
                ActionUtil.setActionWithExtend(actionType.BA_PUSH_OPEN, {
                    bp: actionType.BA_PUSH_PAGE
                });
            });
        } else {
            DeviceEventEmitter.addListener('geTuiDataReceived', (notifData) => {
                this._geTuiDataReceivedHandle(JSON.parse(notifData));
            });

            // 个推打开的action监听
            DeviceEventEmitter.addListener('setGeTuiOpenAction', () => {
                ActionUtil.setActionWithExtend(actionType.BA_PUSH_OPEN, {
                    bp: actionType.BA_PUSH_PAGE
                });
            });
        }

        AsyncStorageComponent.get(common.GETUI_CLIENT_ID)
        .then((storageId) => {
            if (storageId) {
                gcid = storageId;
            }
        });

        AppState.addEventListener('change', this._setLoginDays);

        NetInfo.fetch().done(
            (data) => {
                if(data.toLowerCase() == 'none') {
                    actionsApp.netWorkChanged('no');
                } else {
                    actionsApp.netWorkChanged('yes');
                }
            }
        );

        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange
        );
    }

    componentWillUnmount() {
        if(Platform.OS === 'ios') {
            this.unlistenNotification.remove();
            this.geTuiDataReceived.remove();
            this.setGeTuiOpenAction.remove();
            this.unlistenPage.remove();
        } else {
            DeviceEventEmitter.removeAllListeners('clientIdReceived');
            DeviceEventEmitter.removeAllListeners('geTuiDataReceived');
            DeviceEventEmitter.removeAllListeners('setGeTuiOpenAction');
            DeviceEventEmitter.removeAllListeners('goPage');
        }

        AppState.removeEventListener('change', this._setLoginDays);

        NetInfo.removeEventListener(
            'change',
            this._handleConnectionInfoChange
        );
    }

    _setLoginDays = (currentAppState) => {
        gtoken && (currentAppState == 'active') && setLoginDays();
    };

    _handleConnectionInfoChange = (connection) => {
        let {actionsApp} = this.props;
        if(connection.toLowerCase() == 'none') {
            Toast.show('暂无网络', {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER
            });
            actionsApp.netWorkChanged('no');
        } else {
            actionsApp.netWorkChanged('yes');
            actionsApp.setAppConfig();
            global.gtoken && actionsApp.setAppUserConfig();
        }
    };

    _logoutSure = () => {
        let {actionsApp} = this.props;
        actionsApp.deletePush(); // 解绑个推
        AsyncStorageComponent.multiRemove([common.USER_TOKEN_KEY, common.USER_ID, common.CITY_ID]);
        ActionUtil.setUid("");
        gtoken = '';

        _navigator.resetTo({
            component: LoginContainer,
            name: 'login',
            title: '登录',
            hideNavBar: true,
            bp: actionType.BA_LOGIN
        });
        actionsApp.webAuthentication({visible: false});
    };

    _clientIdReceived = (cId) => {
        let {actionsApp} = this.props;
        if (cId) {
            AsyncStorageComponent.get(common.GETUI_CLIENT_ID)
            .then((storageId) => {
                if (!storageId) {
                    AsyncStorageComponent.save(common.GETUI_CLIENT_ID, cId);
                    gcid = cId;
                    actionsApp.setWebStartConfig({
                        cId: cId
                    });
                }
            });
        }
    };

    _geTuiDataReceivedHandle = (notifData) => {
        let newNotifData = JSON.parse(notifData.payloadMsg);
        let {actionsApp, actionsHome, actionsUser} = this.props;

        switch(Number(newNotifData.type)) {
            case notifConst.NEW_HOUSE: // 普通推送
                ActionUtil.setAction(actionType.BA_PUSH_RECIVED);
                actionsHome.fetchAttentionPrependHouseList({});
                break;
            case notifConst.LOGOUT: // 互踢
                NotificationHandler.logout.call(this, _navigator);
                break;
            case notifConst.OPEN_PAGE: //跳转到指定页
                NotificationHandler.openPage(_navigator, notifData);
                break;
            case notifConst.OPEN_URL: //打开指定URL
                NotificationHandler.openURL(_navigator, notifData);
                break;
            case notifConst.RED_POINT: //签到小红点提示
                actionsApp.appSignInChanged(false);
                break;
            case notifConst.NEW_LEVEL_NOTICE:  //会员等级升级提示
                actionsApp.levelPushed(newNotifData.data.extras);
                actionsUser.fetchUserProfile();
                break;
            case notifConst.TOAST_NOTICE:  //toast消息提示
                NotificationHandler.showToast(newNotifData.data.extras);
                break;
            case notifConst.FORCE_UPDATE: //强制升级
                NotificationHandler.showForceUpdate(actionsApp);
                break;
            case notifConst.MESSAGE_NOTICE: //消息弹框提示
                NotificationHandler.messageNotice(actionsApp);
                break;
            case notifConst.VERIFIED_NOTICE: //用户认证结果提示
                if(newNotifData.data.extras.result == "0") { //失败
                    actionsApp.verifiedNoticeSet({
                        visible: true,
                        msg: "您的身份未通过认证\n请重新上传身份信息",
                        hideClose: true
                    });
                    actionsApp.verifiedStatusChanged("3");
                } else if(newNotifData.data.extras.result == "1") { //成功
                    actionsApp.verifiedResultSet(Object.assign({visible: true}, newNotifData.data.extras));
                    actionsApp.verifiedStatusChanged("2");
                }                
                break;
            default:
                break;
        }
    };

    _configureScene = (route, routeStack) => {
        return Navigator.SceneConfigs.PushFromRight;
    };

    _goBack = () => {
        return NaviGoBack(_navigator);
    };

    _renderScene = (route, navigator) => {
        let Component = route.component;
        let barWrapStyle = route.hideNavBar ? null : styles.navBarWarp;
        _navigator = navigator;

        return (
            <View style={[barWrapStyle, styles.flex]}>
                <Component navigator={navigator} route={route} />
            </View>
        );
    };

    _navBar = () => {
        let {hideNavBar} = this.state;

        if (hideNavBar) {
            return null;
        } else {
            return (<Navigator.NavigationBar
                routeMapper={{
                    LeftButton: this._leftButton,
                    RightButton: this._rightButton,
                    Title: this._title
                }}
                style={[styles.navBar, styles.alignItems, styles.justifyContent]}
            />)
        }
    };

    _leftButton = (route, navigator, index, navState) => {
        let {actionsApp} = this.props;
        return (
            <TouchableOpacity
                onPress={() => {
                    route.backLog && ActionUtil.setAction(route.backLog);
                    actionsApp.clickBack(route.name);

                    if(route.callbackFun) {
                        route.callbackFun();
                    } else {
                        navigator.pop();
                    }
                }}
                style={[styles.navBarLeftButton]}>
                <View style={[styles.flex, styles.justifyContent, styles.alignItems, styles.navBarLeftButtonBox]}>
                    <Image
                        source={require('../images/back.png')}
                        style={styles.icon}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    _rightButton = (route, navigator, index, navState) => {
        return (
            route.right ?
                    <TouchableWithoutFeedback
                        onPress={() => {if(route.right.route) {navigator.push(route.right.route);}}}
                    >
                        <View style={[styles.navBarRightButton, styles.alignItems,styles.justifyContent]}><Text style={styles.modalBtn}>{route.right.msg || ""}</Text></View>
                    </TouchableWithoutFeedback>
                : null
        );
    };

    _title = (route, navigator, index, navState) => {
        return (
            <View style={[styles.flex, styles.justifyContent, styles.alignItems, styles.navBarTitleTextTop]}>
                <Text style={styles.navBarTitleText}>{route.title}</Text>
            </View>
        )
    };

    _willFocus = (route) => {
        this.setState({
            hideNavBar: route.hideNavBar
        })
    };
}
class LogoutModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {logoutInfo, logoutSure} = this.props;
        return (
            <Modal visible={logoutInfo.get('visible')} transparent={true} onRequestClose={() => {}}>
                <View style={styles.bgWrap}>
                    <View style={styles.contentContainer}>
                        <Text style={styles.textCenter}>{logoutInfo.get('msg')}</Text>

                        <TouchableHighlight
                            style={[styles.alignItems, styles.logoutSure, styles.justifyContent]}
                            onPress={logoutSure}
                            underlayColor='#04C1AE'
                        >
                            <View>
                                <Text style={[styles.updateBtnRightText]}>确认</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}


class LevelModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {levelNotice, closeFn, linkFn} = this.props;
        return (
            <Modal visible={levelNotice.get('visible')} transparent={true} onRequestClose={() => {}}>
                <View style={styles.bgWrap}>
                    <View>
                        <View style={[styles.contentContainer, {marginTop: 32}]}>
                            <TouchableHighlight
                                style={[styles.flex, styles.alignItems, styles.justifyContent, styles.closeBox]}
                                underlayColor="transparent"
                                onPress={closeFn}
                                >
                                <Image
                                    style={styles.closeIcon}
                                    source={require("../images/close.png")}
                                />
                            </TouchableHighlight>

                            <Text style={[styles.expTitle]}>会员升级</Text>

                            <View style={{marginTop: 10, marginBottom: 30}}>
                                <Text style={styles.font20}>恭喜您已成为<Text style={[styles.font20, styles.orange, styles.fontBold]}>V{levelNotice.get('data').get('level')}</Text>会员</Text>
                            </View>
                            <TouchableHighlight
                                underlayColor='#fff'
                                onPress={linkFn}
                            >
                                <View style={styles.flex}>
                                    <Text style={[styles.giftBtn, styles.flex]}>查看详情></Text>
                                </View>
                            </TouchableHighlight>
                        </View>

                        <View style={[styles.alignItems, styles.justifyContent, styles.giftBg]}>
                            <Image style={styles.horn} source={require("../images/horn.png")}/>
                        </View>
                    </View>
                </View>
            </Modal>

        );
    }
}

export function setLoginDays(uid) {
    let key = "LOGIN_DAYS_" + uid;

    AsyncStorageComponent.get(key)
    .then((value) => {
        let today = new Date().getDate().toString();
        if(value && value == today) {
        } else {
            setLoginDaysService().then(() => {
                AsyncStorageComponent.save(key, today).catch((error) => {console.log(error);})
            }).catch((error) => {
                console.log(error);
            });
        }
    }).catch((error) => {
        console.log(error);
    })
}

let styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    orange: {
        color: '#ff6d4b'
    },
    fontBold: {
        fontWeight: '400'
    },
    font20: {
        fontSize: 20
    },
    alignItems: {
        alignItems: 'center'
    },
    justifyContent: {
        justifyContent: 'center'
    },
    textCenter: {
        textAlign: "center"
    },
    baseColor: {
        color: "#3e3e3e"
    },
    sceneStyle: {
        backgroundColor: '#fff'
    },
    navBarWarp: {
        marginTop: (Platform.OS === 'ios') ? 65: 45
    },
    navBar: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        height: (Platform.OS === 'ios') ? 65: 45
    },
    navBarTitleText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#3e3e3e'
    },
    navBarTitleTextTop: {
        paddingTop: (Platform.OS === 'ios') ? 0 : 10
    },
    navBarLeftButton: {
        paddingLeft: 15,
        paddingRight: 25
    },
    navBarLeftButtonBox: {
        height: 45
    },
    navBarRightButton: {
        height: 45,
        marginRight: 15
    },
    icon: {
        width: 9.5,
        height: 20.5
    },
    bgWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    contentContainer: {
        width: 270,
        borderRadius: 10,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: 'bold'
    },
    modalContent: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: 5,
        marginBottom: 20
    },
    modalBtn: {
        color: "#04C1AE",
        textAlign: "center",
        fontSize: 16
    },
    updateWrap: {
        marginTop: 20
    },
    updateModalHeader: {
        textAlign: 'center',
        color: '#3e3e3e',
        fontSize: 19,
        paddingBottom: 10
    },
    updateAppImage: {
        width: 154,
        height: 95.4,
        marginTop: 20,
        marginBottom: 18
    },
    updateBtnLeft: {
        height: 35,
        borderColor: '#ccc',
        borderWidth: 1/PixelRatio.get(),
        marginRight: 10,
        marginLeft: 5,
        borderRadius: 4,
    },
    updateBtnLeftText: {
        color: '#8d8c92',
        fontSize: 16
    },
    updateBtnRight: {
        height: 35,
        marginLeft: 10,
        marginRight: 5,
        backgroundColor: '#04c1ae',
        borderRadius: 4,
    },
    updateBtnRightText: {
        color: '#fff',
        fontSize: 16
    },
    updateContentContainer: {
        width: 270,
        borderRadius: 5,
        padding: 20,
        backgroundColor: "#fff",
    },
    loading: {
        width: 32,
        height: 32
    },
    logoutSure: {
        width: 170,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#04c1ae',
        marginTop: 20
    },
    closeBox: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 50,
        height: 50,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    closeIcon: {
        width: 18,
        height: 18
    },
    expTitle: {
        marginTop: 28,
        marginBottom: 10,
        fontSize: 12,
        color: '#8d8c92'
    },
    giftBg: {
        position: 'absolute',
        top: 0,
        left: 100,
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: "#04C1AE"
    },
    giftBtn: {
        color: "#04c1ae",
        fontSize: 12
    },
    horn: {
        width: 34,
        height: 32.5
    }
});

export default App;