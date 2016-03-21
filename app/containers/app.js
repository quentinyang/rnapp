'use strict';

import React, {Navigator, BackAndroid, StyleSheet} from 'react-native';
import {NaviGoBack} from '../utils/CommonUtils';
import Splash from '../pages/Splash';

let _navigator, isRemoved = false;

class App extends React.Component {
    constructor(props) {
        super(props);

        this.renderScene = this.renderScene.bind(this);
        this.goBack = this.goBack.bind(this);
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

        _navigator = navigator;

        if(route.name === 'WebViewPage') {
            BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
            isRemoved = true;
        } else {
            if(isRemoved) {
                BackAndroid.addEventListener('hardwareBackPress', this.goBack);
            };
        }

        return (
            <Component navigator={navigator} route={route} />
        );
    }

    render() {
        return (
            <Navigator
                style={styles.navigator}
                configureScene={this.configureScene}
                renderScene={this.renderScene}
                initialRoute={{
                    component: Splash,
                    name: 'Splash'
                }}
            />
        )
    }
}

let styles = StyleSheet.create({
    navigator: {
        flex: 1
    }
});

export default App;