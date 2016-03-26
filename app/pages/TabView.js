'use strict';

import {React, Component, View, StyleSheet, TabBar} from 'nuke';
import HomeContainer from '../containers/HomeContainer';

export default class TabView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 0
        };

        this._renderScene = this._renderScene.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <TabBar 
                    tintColor='#04c1ae'
                    translucent={true}
                    barTintColor='#f8f8f8'>
                    {
                        tabArr.map(
                            (val)=>{
                                return (
                                    <TabBar.Item
                                        title={val.title}
                                        selected={this.state.tabIndex === val.key}
                                        systemIcon={val.systemIcon}
                                        key={val.key}
                                        onPress={() => {
                                            this.setState({
                                                tabIndex: val.key
                                            });
                                        }}>
                                            {this._renderScene()}
                                    </TabBar.Item>
                                );
                            }
                        )
                    }
                </TabBar>
            </View>
        )
    }

    _renderScene() {
        let {navigator} = this.props;
        let {tabIndex} = this.state;

        switch(tabIndex) {
            case 0:
                return <HomeContainer navigator={navigator}/>;
                break;
            case 1:
                return <HomeContainer navigator={navigator}/>;
                break;
            case 2:
                return <HomeContainer navigator={navigator}/>;
                break;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabBar: {
        flex: 1,
        alignItems: 'flex-end'
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