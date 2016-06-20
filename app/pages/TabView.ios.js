'use strict';

import {React, Component, View, StyleSheet, TabBar, Alert} from 'nuke';
import HomeContainer from '../containers/HomeContainer';
import PublishFirstStepContainer from '../containers/PublishFirstStepContainer';
import InputHouseRule from '../pages/InputHouseRule';
import UserContainer from '../containers/UserContainer';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class TabView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabIndex: 0
        };
        this._renderScene = this._renderScene.bind(this);
    }

    render() {
        let {actionsUser, route, navigator} = this.props;
        return (
            <View style={styles.container}>
                <TabBar
                    tintColor='#04c1ae'
                    translucent={true}
                    barTintColor='#f8f8f8'>
                    {
                        tabArr.map(
                            (val) => {
                                return (
                                    <TabBar.Item
                                        style={{backgroundColor: "#333"}}
                                        title={val.title}
                                        selected={this.state.tabIndex === val.key}
                                        icon={{uri: val.icon, scale: 2}}
                                        key={val.key}
                                        onPress={() => {
                                            this.setState({
                                                tabIndex: val.key
                                            });
                                            if (val.key == 2) {
                                                actionsUser.fetchUserProfile({});
                                            }
                                        }}>
                                            {this._renderScene(route || val)}
                                    </TabBar.Item>
                                );
                            }
                        )
                    }
                </TabBar>
            </View>
        )
    }

    _renderScene(route) {
        let {navigator, actionsUser} = this.props;
        let {tabIndex} = this.state;

        switch(tabIndex) {
            case 0:
                return <HomeContainer navigator={navigator} route={route} rout='全部房源'/>;
                break;
            case 1:
                return <PublishFirstStepContainer navigator={navigator} route={route} rout='发房'/>;
                break;
            case 2:
                return <UserContainer navigator={navigator} route={route} rout='我的'/>;
                break;
        }
    }

    componentWillMount() {
        let origin = this.props.route.from;
        if(origin == 'reCharge' || origin == 'withdrawSuccess') {
            this.setState({tabIndex: 2});
            this.props.actionsUser.fetchUserProfile({});
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
        icon: 'data:image/png;base64,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',
        selectedIcon:'ios-list',
        systemIcon: 'bookmarks',
        bp: ''
    },
    {
        key: 1,
        title: '发房',
        icon: 'data:image/png;base64,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',
        selectedIcon:'ios-paper',
        systemIcon: 'history',
        bp: ''
    },
    {
        key: 2,
        title: '我的',
        icon: 'data:image/png;base64,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',
        selectedIcon:'ios-paper',
        systemIcon: 'downloads',
        bp: ''
    }
];