'use strict';

import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import {React, Component, Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View, Image, Alert, Modal, TouchableHighlight,
    PixelRatio, TouchableWithoutFeedback, Linking, InteractionManager} from 'nuke';
import {navigationContext} from 'react-native'
import {NaviGoBack} from '../utils/CommonUtils';
import LoginContainer from '../containers/LoginContainer';
import TabViewContainer from '../containers/TabViewContainer';
import * as common from '../constants/Common';
import BackScore from '../pages/BackScore'
var GeTui = require('react-native').NativeModules.GeTui;
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import {routes} from '../config/route'
import { NativeAppEventEmitter, DeviceEventEmitter } from 'react-native';

let _navigator;
global.gtoken = '';
global.gcid = '';
global.guid = '';

class App extends Component {
    constructor(props) {
        super(props);
        var self = this;
        let {actionsApp} = this.props;
        this.state = {
            component: null,
            name: '',
            title: '',
            hideNavBar: true,
            initialRoute: null,
            showModal: false
        };

        BackAndroid.addEventListener('hardwareBackPress', this._goBack);
        AsyncStorageComponent.multiGet([common.USER_TOKEN_KEY, common.USER_ID])
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
                }
            }

            if(!gtoken) {
                self.setState({
                    component: LoginContainer,
                    name: 'login',
                    title: '登录',
                })
            } else {
                if(Platform.OS == "ios" && gpage) {
                    //routeStack 中加入Home 返回问题
                    self.setState(routes[gpage]);
                } else {
                    self.setState({
                        component: TabViewContainer,
                        name: 'home',
                        title: '我的主页'
                    });
                }
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
                _navigator.push(routes[obj.page]);
            });
        } else {
            DeviceEventEmitter.addListener('clientIdReceived', (cId) => {
                self._clientIdReceived(cId);
            });

            DeviceEventEmitter.addListener('goPage', (page) => {
                _navigator.push(routes[page]);
            });
        }

    }

    render() {
        let {component} = this.state;
        let {appData, actionsApp} = this.props;
        let isAndroid = (Platform.OS == "android");

        return (
            <View style={styles.flex}>
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
                { isAndroid ?
                <Modal visible={appData.get('config').get('showUpdateModal')} transparent={true} onRequestClose={() => {}}>
                    <View style={styles.bgWrap}>
                        <View style={styles.updateContentContainer}>
                            <View style={[styles.alignItems, styles.justifyContent]}>
                                <Image style={styles.updateAppImage} source={require('../images/update_app.png')}/>
                                <Text style={styles.updateModalHeader}>有新版本啦～</Text>
                            </View>
                            <View style={[styles.row, styles.updateWrap]}>
                                <TouchableHighlight
                                    onPress={actionsApp.closeUpdateModal.bind(null, false)}
                                    style={styles.flex}
                                    underlayColor='#fff'
                                >
                                    <View style={[styles.updateBtnLeft, styles.alignItems, styles.justifyContent]}>
                                        <Text style={[styles.updateBtnLeftText]}>暂不更新</Text>
                                    </View>
                                </TouchableHighlight>
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
                </Modal> : null }

                {
                    component ?
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

    _downAppModel() {
        Linking.openURL('http://www.fangyuan360.cn/download/app')
        let {actionsApp} = this.props;
        actionsApp.closeUpdateModal(false);
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
            this.unlistenPage.remove();
        } else {
            DeviceEventEmitter.removeAllListeners('clientIdReceived');
            DeviceEventEmitter.removeAllListeners('geTuiDataReceived');
            DeviceEventEmitter.removeAllListeners('setGeTuiOpenAction');
            DeviceEventEmitter.removeAllListeners('goPage');
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

        switch(Number(newNotifData.type)) {
            case 1: // 普通推送
                ActionUtil.setAction(actionType.BA_PUSH_RECIVED);
                actionsHome.fetchAttentionPrependHouseList({});
                break;
            case 2: // 互踢
                AsyncStorageComponent.multiRemove([common.USER_TOKEN_KEY, common.USER_ID]);
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

let styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    alignItems: {
        alignItems: 'center'
    },
    justifyContent: {
        justifyContent: 'center'
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
    updateWrap: {
        marginTop: 20
    },
    updateModalHeader: {
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
    }
});

export default App;