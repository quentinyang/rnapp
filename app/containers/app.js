'use strict';

import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import {React, Component, Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View, Image, Alert, Modal, TouchableHighlight} from 'nuke';
import {navigationContext} from 'react-native'
import {NaviGoBack} from '../utils/CommonUtils';
import LoginContainer from '../containers/LoginContainer';
import TabViewContainer from '../containers/TabViewContainer';
import * as common from '../constants/Common';

var GeTui = require('react-native').NativeModules.GeTui;
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

var {
  NativeAppEventEmitter
} = React;

var { DeviceEventEmitter } = require('react-native');

let _navigator;
global.gtoken = '';
global.gcid = '';

class App extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this.state = {
            component: null,
            name: '',
            title: '',
            hideNavBar: true,
            initialRoute: null,
            showModal: false,
        };

        this.setGeTuiOpenActionFlag = false;

        BackAndroid.addEventListener('hardwareBackPress', this._goBack);
        AsyncStorageComponent.get('user_token')
        .then((value) => {
            if(value) {
                gtoken = value;
                self.setState({
                    component: TabViewContainer,
                    name: 'home',
                    title: '我的主页'
                });
            } else {
                self.setState({
                    component: LoginContainer,
                    name: 'login',
                    title: '登录',
                })
            }
        })
        .catch((error) => {
            console.log(error);
        });

        if(Platform.OS === 'ios') {
            this.unlistenNotification =  NativeAppEventEmitter.addListener('clientIdReceived', (cId) => {
                self._clientIdReceived(cId);
            });
        } else {
            DeviceEventEmitter.addListener('clientIdReceived', (cId) => {
                self._clientIdReceived(cId);
            });
        }

        AsyncStorageComponent.get('user_id')
        .then((value) => {
            if(value) {
                ActionUtil.setUid(value);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    render() {
        let {component} = this.state;

        return (
            <View style={styles.flex}>
            <Modal visible={this.state.showModal} transparent={true}>
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
            {component ?
            <Navigator
                style={styles.flex}
                configureScene={this._configureScene}
                renderScene={this._renderScene}
                sceneStyle={styles.sceneStyle}
                navigationBar={this._navBar()}
                onWillFocus={this._willFocus}
                initialRoute={{
                    component: this.state.component,
                    name: this.state.name,
                    hideNavBar: true,
                    title: this.state.title,
                    bp: ''
                }}
            /> : null
            }
            </View>
        )
    }

    _hideModel() {
        AsyncStorageComponent.get('user_phone')
        .then((value) => {
            this.setState({
                showModal: false
            });
            _navigator.resetTo({
                component: LoginContainer,
                name: 'login',
                title: '登录',
                phone: value,
                hideNavBar: true
            });
        });
    }

    componentDidUpdate() {
        let {appData, actionsApp} = this.props;
        if (!appData.get('auth')) {
            Alert.alert('提示', '请重新登录', [
                {
                    text: '确定',
                    onPress: () => {
                        _navigator.resetTo({
                            component: LoginContainer,
                            name: 'login',
                            title: '登录',
                            hideNavBar: true,
                            bp: actionType.BA_LOGIN
                        });
                        actionsApp.webAuthentication(true);
                    }
                }
            ])
        }

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
    }

    componentDidMount() {
        GeTui.getClientId((cId) => {
            this._clientIdReceived(cId)
        });
        if(Platform.OS === 'ios') {
            this.geTuiDataReceived =  NativeAppEventEmitter.addListener('geTuiDataReceived', (notifData) => {
                this._geTuiDataReceivedHandle(notifData);
            });

            this.setGeTuiOpenAction =  NativeAppEventEmitter.addListener('setGeTuiOpenAction', () => {
                this.setGeTuiOpenActionFlag = true;
            });
        } else {
            DeviceEventEmitter.addListener('geTuiDataReceived', (notifData) => {
                this._geTuiDataReceivedHandle(notifData);
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
    }

    componentWillUnmount() {
        if(Platform.OS === 'ios') {
            this.unlistenNotification.remove();
            this.geTuiDataReceived.remove();
            this.setGeTuiOpenAction.remove();
        } else {
            DeviceEventEmitter.removeAllListeners('clientIdReceived');
            DeviceEventEmitter.removeAllListeners('geTuiDataReceived');
            DeviceEventEmitter.removeAllListeners('setGeTuiOpenAction');
        }
    }

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
        let newNotifData = JSON.parse(notifData);
        let {actionsHome} = this.props;

        if (this.setGeTuiOpenActionFlag && newNotifData.type == 1) {
            this.setGeTuiOpenActionFlag = false;
            ActionUtil.setActionWithExtend(actionType.BA_PUSH_OPEN, {
                bp: actionType.BA_PUSH_PAGE
            });
        }
        switch(Number(newNotifData.type)) {
            case 1: // 普通推送
                ActionUtil.setActionWithExtend(actionType.BA_PUSH_RECIVED, newNotifData);
                actionsHome.fetchAttentionPrependHouseList({});
                break;
            case 2: // 互踢
                AsyncStorageComponent.remove(common.USER_TOKEN_KEY);
                if (Platform.OS === 'ios') {
                    Alert.alert('提示', '您的账号在另外一台设备登陆，被迫下线！', [
                        {text: '知道了', onPress: () => {
                            AsyncStorageComponent.get('user_phone')
                            .then((value) => {
                                _navigator.resetTo({
                                    component: LoginContainer,
                                    name: 'login',
                                    title: '登录',
                                    phone: value,
                                    hideNavBar: true
                                });
                            });
                        }}
                    ]);
                } else {
                    this.setState({
                        showModal: true
                    });
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
        return (
            <TouchableOpacity
                onPress={() => {ActionUtil.setAction(route.backLog);navigator.pop()}}
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
        return null;
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

let styles = StyleSheet.create({
    flex: {
        flex: 1
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
        marginRight: 15
    },
    icon: {
        width: 9.5,
        height: 20.5
    },
    alignItems: {
        alignItems: 'center'
    },
    justifyContent: {
        justifyContent: 'center'
    },
    bgWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    contentContainer: {
        width: 270,
        borderRadius: 5,
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
    baseColor: {
        color: "#3e3e3e"
    },
});

export default App;
