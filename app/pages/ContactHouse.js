'use strict';

import {React, Component, Text, View, ListView, StyleSheet, Image,
    TouchableWithoutFeedback, RefreshControl, ActivityIndicator, InteractionManager} from 'nuke';

import ContactItem from '../components/ContactItem';
import DetailContainer from '../containers/DetailContainer';
import Immutable, {List} from 'immutable';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});


export default class ContactHouse extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_MINE_CONTACT;
        ActionUtil.setActionWithExtend(actionType.BA_MINE_CONTACT_ONVIEW, {"bp": this.props.route.bp});
        this.state = {
            isRefreshing: false,
            loaded: false
        }
    }

    render() {
        let { houseList, pager } = this.props;

        return (
            <View style={[styles.flex, styles.bgColor]}>
                {
                    Number(pager.get('total')) > 0 ?
                        <ListView
                            style={styles.listViewWrap}
                            dataSource={ds.cloneWithRows(houseList.toArray())}
                            renderRow={this._renderRow}
                            initialListSize={10}
                            pageSize={10}
                            scrollRenderAheadDistance={50}
                            minPulldownDistance={30}
                            onEndReachedThreshold={50}
                            onEndReached={this._onEndReached}
                            enableEmptySections={true}
                            refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh}
                                tintColor='#04c1ae'
                                title='松开刷新'
                                colors={['#fff']}
                                progressBackgroundColor='#04c1ae'
                            />
                        }
                        />
                        :
                        <View style={[styles.flex, styles.center]}>
                            <Image
                                source={require('../images/no_house_list.png')}
                                style={styles.noHouseList}
                            />
                            <Text style={styles.noHouseListMsg}>暂无数据~~~</Text>
                        </View>
                }
            </View>
        )
    }

    componentDidMount() {
        let {loaded} = this.state;
        let {actions, pager} = this.props;
        if (!loaded) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchContactHouse({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    }

    componentWillUnmount() {
        let {actions} = this.props;
        actions.houseDataCleared();
    }

    _renderRow = (rowData: any, sectionID: number, rowID: number) => {
        return (
            <ContactItem item={rowData} onItemPress={this._onItemPress}/>
        )
    };

    _onEndReached = () => { // 防止多次重复加载
        let {actions, pager} = this.props;

        if (Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchContactHouse({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    };

    _onRefresh = () => {
        let {actions} = this.props;
        this.setState({isRefreshing: true});

        InteractionManager.runAfterInteractions(() => {
            actions.fetchPrependContactHouse({
                page: 1
            });
        });

        this.setState({isRefreshing: false});
    };

    _onItemPress = (item) => {
        ActionUtil.setAction(actionType.BA_MINE_CONTACT_DETAIL);
        let {navigator} = this.props;

        navigator.push({
            component: DetailContainer,
            name: 'houseDetail',
            title: '房源详情',
            hideNavBar: false,
            backLog: actionType.BA_DETAIL_RETURN,
            bp: this.pageId,
            item
        });
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    listViewWrap: {

    },
    bgColor: {
        backgroundColor: "#eee"
    },
    noHouseList: {
        width: 100,
        height: 100,
    },
    noHouseListMsg: {
        fontSize: 15,
        color: '#8d8c92',
        fontFamily: 'Heiti SC',
        paddingTop: 50
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});

