'use strict';

import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import {React, Component, Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View, Image} from 'nuke';
import {navigationContext} from 'react-native'
import {NaviGoBack} from '../utils/CommonUtils';
import LoginContainer from '../containers/LoginContainer';
import AttentionBlockSetContainer from '../containers/AttentionBlockSetContainer';
import AttentionBlockSetOneContainer from '../containers/AttentionBlockSetOneContainer';
import HomeContainer from '../containers/HomeContainer';
import TabViewContainer from '../containers/TabViewContainer';

let _navigator;

class App extends Component {
    constructor(props) {
        super(props);
        var self = this;
        this.state = {
            component: TabViewContainer,
            name: '',
            title: '房源360',
            hideNavBar: true
        };
        BackAndroid.addEventListener('hardwareBackPress', this._goBack);
        AsyncStorageComponent.get('user_token')
        .then((value) => {
            if(value) {
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
        return (
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
            />
        )
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
                style={styles.navBar}
            />)
        }
    };

    _leftButton = (route, navigator, index, navState) => {
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Image
                    source={require('../images/back.png')}
                    style={styles.icon}
                />
            </TouchableOpacity>
        );
    };
        // <TouchableOpacity
        //         onPress={() => navigator.pop()}
        //         style={styles.navBarRightButton}>
        //         <Text style={styles.navBarText}>Right</Text>
        //     </TouchableOpacity>
    _rightButton = (route, navigator, index, navState) => {
        return null;
    };

    _title = (route, navigator, index, navState) => {
        return (
            <Text style={styles.navBarTitleText}>{route.title}</Text>
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
        marginTop: (Platform.OS === 'ios') ? 64: 48
    },
    navBar: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        height: (Platform.OS === 'ios') ? 64: 48,
    },
    navBarText: {
        // fontSize: (Platform.OS === 'ios')? 20: 19,
        // marginVertical: (Platform.OS === 'ios')? 11: 12,
    },
    navBarTitleText: {
        fontSize: (Platform.OS === 'ios')? 20: 19,
        marginTop: (Platform.OS === 'ios')? 10: 20,
        fontWeight: '500',
        color: (Platform.OS === 'ios')? '#333': '#666'
    },
    navBarLeftButton: {
        paddingLeft: 15
    },
    navBarRightButton: {
        marginRight: 15
    },
    icon: {
        width: 10,
        height: 24,
        marginTop: (Platform.OS === 'ios')? 6: 9
    }
});

export default App;
