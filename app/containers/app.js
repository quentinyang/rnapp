'use strict';

import {React, Component, Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View, Image} from 'nuke';
import {NaviGoBack} from '../utils/CommonUtils';
import LoginContainer from '../containers/LoginContainer';

let _navigator;

class App extends Component {
    constructor(props) {
        super(props);

        this.renderScene = this.renderScene.bind(this);
        this.goBack = this.goBack.bind(this);
        this._willFocus = this._willFocus.bind(this);
        this.navBar = this.navBar.bind(this);
        this._leftButton = this._leftButton.bind(this);
        this._rightButton = this._rightButton.bind(this);
        this._title = this._title.bind(this);

        this.state = {
            hideNavBar: true
        };

        BackAndroid.addEventListener('hardwareBackPress', this.goBack);
    }

    configureScene(route, routeStack) {
        return Navigator.SceneConfigs.PushFromRight;
    }

    goBack() {
        return NaviGoBack(_navigator);
    }

    renderScene(route, navigator) {
        let Component = route.component;
        let barWrapStyle = route.hideNavBar ? null : styles.navBarWarp;
        _navigator = navigator;

        return (
            <View style={[barWrapStyle, styles.flex]}>
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
                    LeftButton: this._leftButton,
                    RightButton: this._rightButton,
                    Title: this._title
                }}
                style={styles.navBar}
            />)
        }
    }

    _leftButton(route, navigator, index, navState) {
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
    }

    _rightButton(route, navigator, index, navState) {
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarRightButton}>
                <Text style={styles.navBarText}>Right</Text>
            </TouchableOpacity>
        );
    }

    _title(route, navigator, index, navState) {
        return (
            <Text style={styles.navBarTitleText}>{route.title}</Text>
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
                style={styles.flex}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
                sceneStyle={styles.sceneStyle}
                navigationBar={this.navBar()}
                onWillFocus={this._willFocus}
                initialRoute={{
                    component: LoginContainer,
                    name: 'login',
                    hideNavBar: true,
                    title: 'Login'
                }}
            />
        )
    }
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
