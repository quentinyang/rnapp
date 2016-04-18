'use strict';

import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import {React, Component, Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View, Image, Alert} from 'nuke';
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
            initialRoute: null
        };

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

        DeviceEventEmitter.addListener('clientIdReceived', (cId) => {
            Alert.alert(cId);
        });

        this.unlistenNotification =  NativeAppEventEmitter.addListener(
            'clientIdReceived',
            (cId) => {
                Alert.alert('clientIdReceived' + cId);
            }
        );
    }

    render() {
        let {component} = this.state;

        return (
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
        )
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
            this.unlistenNotification =  NativeAppEventEmitter.addListener('geTuiDataReceived', (notifData) => {
                this._geTuiDataReceivedHandle(notifData);
            });
        } else {
            DeviceEventEmitter.addListener('geTuiDataReceived', (notifData) => {
                this._geTuiDataReceivedHandle(notifData);
            });
        }
    }

    componentWillUnmount() {
        if(Platform.OS === 'ios') {
            this.unlistenNotification.remove();
        } else {
            DeviceEventEmitter.removeAllListeners('clientIdReceived');
            DeviceEventEmitter.removeAllListeners('geTuiDataReceived');
        }
    }

    _clientIdReceived = (cId) => {
        let {actionsApp} = this.props;

        if (!gcid) {
            gcid = cId;
            actionsApp.setWebStartConfig({
                cId: cId
            });
        }
    };

    _geTuiDataReceivedHandle = (notifData) => {
        let newNotifData = JSON.parse(notifData);
        let {actionsHome} = this.props;

        switch(Number(newNotifData.type)) {
            case 1: // 普通推送
                actionsHome.fetchAttentionPrependHouseList({});
                break;
            case 2: // 互踢
                Alert.alert('提示', '您的房源360账号已经在另外一台设备上登录？', [
                    {text: '知道了', onPress: () => {
                        AsyncStorageComponent.remove(common.USER_TOKEN_KEY);
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
    }
});

export default App;
