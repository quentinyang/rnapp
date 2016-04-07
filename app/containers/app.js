'use strict';

import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import {React, Component, Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View, Image, Alert} from 'nuke';
import {navigationContext} from 'react-native'
import {NaviGoBack} from '../utils/CommonUtils';
import LoginContainer from '../containers/LoginContainer';
import TabViewContainer from '../containers/TabViewContainer';

let _navigator;
global.gtoken = '';
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
                    title: this.state.title
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
                            hideNavBar: true
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
                style={[styles.navBar]}
            />)
        }
    };

    _leftButton = (route, navigator, index, navState) => {
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={[styles.navBarLeftButton, styles.flex, styles.justifyContent, styles.alignItems]}>
                <Image
                    source={require('../images/back.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
        );
    };

    _rightButton = (route, navigator, index, navState) => {
        return null;
    };

    _title = (route, navigator, index, navState) => {
        return (
            <View style={[styles.flex, styles.justifyContent, styles.alignItems]}>
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
        marginTop: (Platform.OS === 'ios') ? 65: 48
    },
    navBar: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        height: (Platform.OS === 'ios') ? 65: 48
    },
    navBarTitleText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#3e3e3e'
    },
    navBarLeftButton: {
        paddingLeft: 15
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
