'use strict';

import {React, Component, View, Text, StyleSheet, Navigator, TouchableOpacity} from 'nuke';
import HomeContainer from '../containers/HomeContainer';

let _navigator = null;

export default class TabView extends Component {
    constructor(props) {
        super(props);

        this._renderScene = this._renderScene.bind(this);
        this._onWillFocus = this._onWillFocus.bind(this);
        this.state = {
            tabIndex:0
        };
    }

    _renderScene(route, nav) {
        _navigator = nav;
        let {navigator} = this.props;

        switch(route.key) {
            case 0:
                return <HomeContainer navigator={navigator} rout='全部房源'/>;
                break;
            case 1:
                return <HomeContainer navigator={navigator} rout='全部发房'/>;
                break;
            case 2:
                return <HomeContainer navigator={navigator} rout='我的'/>;
                break;
        }
    }

    _onWillFocus(route) {
        this.setState({
            tabIndex: route.key
        });
    }

    render() {
        return (
            <Navigator
                style={styles.container}
                initialRoute={tabArr[0]}
                initialRouteStack={tabArr}
                renderScene={this._renderScene}
                sceneStyle={styles.sceneStyle}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    } else {
                        return Navigator.SceneConfigs.FadeAndroid;
                    }
                }}
                navigationBar={
                    <TabBar
                        navigator={_navigator}
                        tabIndex={this.state.tabIndex}
                    />
                }
                onWillFocus={this._onWillFocus}
            />
        );
    }
}

class TabBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.tabbar}>
            {
                tabArr.map(
                    (tabItem) => {
                        return (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.tabitem}
                                key={tabItem.key}
                                onPress={()=>{
                                    if(this.props.tabIndex !== tabItem.key) {
                                        this.props.navigator.jumpTo(tabArr[tabItem.key]);
                                    }
                                }}
                            >
                                <View>
                                    <Text style={styles.tabtext}>{tabItem.title}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                )
            }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sceneStyle: {
        backgroundColor: '#fff'
    },
    tabbar: {
        backgroundColor: '#fff',
        borderTopColor:'#ddd',
        borderTopWidth: 1,
        height: 50,
        flexDirection:'row',
        position: 'relative',
        bottom:0,
        left:0,
        right:0,
    },
    tabitem: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
    },
    tabtext: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: -2
    }
});

const tabArr = [
    {
        key: 0,
        title: '看房',
        icon: 'ios-list-outline',
        selectedIcon:'ios-list',
        systemIcon: 'bookmarks'
    },
    {
        key: 1,
        title: '发房',
        icon: 'ios-paper-outline',
        selectedIcon:'ios-paper',
        systemIcon: 'history'
    },
    {
        key: 2,
        title: '我的',
        icon: 'ios-paper-outline',
        selectedIcon:'ios-paper',
        systemIcon: 'downloads'
    }
];