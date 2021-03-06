'use strict';

import {React, Component, Text, View, ListView, StyleSheet, Image,
    TouchableWithoutFeedback, RefreshControl, ActivityIndicator, InteractionManager} from 'nuke';

import InputItem from '../components/InputItem';
import DetailContainer from '../containers/DetailContainer';
import NoNetwork from '../components/NoNetwork';
import Immutable, {List} from 'immutable';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});


export default class InputHouse extends Component {
    constructor(props) {
        super(props);

        this.pageId = actionType.BA_MINE_RELEASE;
        ActionUtil.setActionWithExtend(actionType.BA_MINE_RELEASE_ONVIEW, {"bp": this.props.route.bp});
        this.state = {
            isRefreshing: false,
            loaded: false
        }
    }

    render() {
        let { houseList, pager, netWork } = this.props;
        return (
            <View style={[styles.flex, {backgroundColor: "#eee"}]}>
                {
                    netWork == 'no' && !pager.get('total') ?
                    <NoNetwork onPress={() => {}} />
                    :
                    (Number(pager.get('total')) > 0 ?
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
                                tintColor='#ccc'
                                title='松开刷新'
                                colors={['#fff']}
                                progressBackgroundColor='#ccc'
                            />
                        }
                        />
                        :
                        pager.get('total') == 0 ?
                        <View style={[styles.flex, styles.center]}>
                            <Image
                                source={require('../images/no_house_list.png')}
                                style={styles.noHouseList}
                            />
                            <Text style={styles.noHouseListMsg}>暂无数据~~~</Text>
                        </View>:null)
                }
            </View>
        )
    }

    componentDidMount() {
        let {loaded} = this.state;
        let {actions, pager} = this.props;
        if (!loaded) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchInputHouse({
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
            <InputItem item={rowData} onItemPress={this._onItemPress}/>
        )
    };

    _onEndReached = () => { // 防止多次重复加载
        let {actions, pager} = this.props;

        if (Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchInputHouse({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    };

    _onRefresh = () => {
        let {actions} = this.props;
        this.setState({isRefreshing: true});

        InteractionManager.runAfterInteractions(() => {
            actions.fetchPrependInputHouse({
                page: 1
            });
        });

        this.setState({isRefreshing: false});
    };

    _onItemPress = (item) => {
        ActionUtil.setAction(actionType.BA_MINE_RELEASE_DETAIL);
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
    noHouseList: {
        width: 100,
        height: 100,
    },
    noHouseListMsg: {
        fontSize: 15,
        color: '#8d8c92',
        paddingTop: 50
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    }
});