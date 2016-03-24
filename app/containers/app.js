'use strict';

import React, {Navigator, BackAndroid, StyleSheet, Platform, TouchableOpacity, Text, View} from 'react-native';
import {NaviGoBack} from '../utils/CommonUtils';
import Splash from '../pages/Splash';

let _navigator, isRemoved = false;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.renderScene = this.renderScene.bind(this);
        this.goBack = this.goBack.bind(this);
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

        // _navigator = navigator;

        // if(route.name === 'WebViewPage') {
        //     BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
        //     isRemoved = true;
        // } else {
        //     if(isRemoved) {
        //         BackAndroid.addEventListener('hardwareBackPress', this.goBack);
        //     };
        // }

        return (
            <View style={styles.navBarWarp}>
                <Component navigator={navigator} route={route} />
            </View>
        );
    }

    navBar() {
        let a = <Navigator.NavigationBar
                    routeMapper={{
                        LeftButton: this._LeftButton,
                        RightButton: this._RightButton,
                        Title: this._Title
                    }}
                    style={styles.navBar}
                />;


        return a;
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

    render() {
        return (
            <Navigator
                style={styles.navigator}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
                sceneStyle={{backgroundColor: '#fff'}}
                navigationBar={this.navBar()}
                initialRoute={{
                    component: Splash,
                    name: 'Splash',
                    title: 'Test'
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
