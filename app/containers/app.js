'use strict';

import React, {Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View} from 'react-native';
import {NaviGoBack} from '../utils/CommonUtils';
import Splash from '../pages/Splash';
import LoginContainer from '../containers/LoginContainer';
import HomeContainer from '../containers/HomeContainer';

let _navigator, isRemoved = false;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.renderScene = this.renderScene.bind(this);
        this.goBack = this.goBack.bind(this);
        this._willFocus = this._willFocus.bind(this);

        this.state = {
            hideNavBar: true
        }
        // this.navBar = this.navBar.bind(this);
        // this._LeftButton = this._LeftButton.bind(this);
        // this._RightButton = this._RightButton.bind(this);
        // this._Title = this._Title.bind(this);

        // BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    }

    configureScene(route, routeStack) {
        return Navigator.SceneConfigs.PushFromRight;
    }

    goBack() {
        // return NaviGoBack(_navigator);
    }

    renderScene(route, navigator) {
        let Component = route.component;
        let barWrapStyle = route.hideNavBar ? null : styles.navBarWarp;

        return (
            <View style={barWrapStyle}>
                <Component navigator={navigator} route={route} />
            </View>
        );
    }

    navBar() {
        let {hideNavBar} = this.state;

        if (hideNavBar) {
            return null;
        } else {
            return (<Navigator.NavigationBar
                routeMapper={{
                    LeftButton: this._LeftButton,
                    RightButton: this._RightButton,
                    Title: this._Title
                }}
                style={styles.navBar}
            />)
        }
    }

    _LeftButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Text>Left</Text>
            </TouchableOpacity>
        );
    }

    _RightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarRightButton}>
                <Text>Right</Text>
            </TouchableOpacity>
        );
    }

    _Title(route, navigator, index, navState) {
        return (
            <Text style={styles.navBarTitleText}>{ route.title }</Text>
        )
    }

    _willFocus(route) {
        this.setState({
            hideNavBar: route.hideNavBar
        })
    }

    render() {
        return (
            <Navigator
                style={styles.navigator}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
                sceneStyle={{backgroundColor: '#fff'}}
                navigationBar={this.navBar()}
                onWillFocus={this._willFocus}
                initialRoute={{
                    component: HomeContainer,
                    name: 'login',
                    hideNavBar: true,
                    title: 'Login'
                }}
            />
        )
    }
}

let styles = StyleSheet.create({
    navBarWarp: {
        marginTop: (Platform.OS === 'ios') ? 64: 48
    },
    navBar: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        height: (Platform.OS === 'ios') ? 64: 48,
    },
    navBarTitleText: {
        fontWeight: '500',
    },
    navBarLeftButton: {
        paddingLeft: 5
    },
    navBarRightButton: {
        marginRight: 5
    },
    icon: {
        width: 30,
        height: 30,
        marginTop: (Platform.OS === 'ios')? 6: 9,
        textAlign: 'center'
    }
});

export default App;
