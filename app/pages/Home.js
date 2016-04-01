'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, ListView, Image, PixelRatio,
        TouchableWithoutFeedback, RefreshControl, InteractionManager, ActivityIndicator} from 'nuke';
import HouseListContainer from '../containers/HouseListContainer';
import AttentionBlockSetOneContainer from '../containers/AttentionBlockSetOneContainer';

import HouseItem from '../components/HouseItem';
import DetailContainer from '../containers/DetailContainer';

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: false
        };
    }

    render() {
        let {houseData} = this.props;
        let houseList = houseData.get('properties');
        return (
            <View style={[styles.flex, styles.pageBgColor]}>
                <View style={styles.searchWrap}>
                    <Text></Text>
                </View>
                <ListView
                    style={styles.flex}
                    dataSource={ds.cloneWithRows(houseList.toArray())}
                    renderRow={this._renderRow}
                    initialListSize={10}
                    pageSize={10}
                    scrollRenderAheadDistance={50}
                    minPulldownDistance={30}
                    onEndReachedThreshold={50}
                    onEndReached={this._onEndReached}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            tintColor='#04c1ae'
                            title='松开刷新'
                            colors={['#ff0000', '#00ff00', '#0000ff']}
                            progressBackgroundColor='#ffff00'
                        />
                    }
                />
            </View>
        )
    }

    componentDidMount() {
        let {actions} = this.props;

        InteractionManager.runAfterInteractions(() => {
            // actions.fetchAttentionHouseList({});
            actions.fetchAttentionBlockAndCommunity({});
        });
    }

    _renderRow = (rowData: any) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        )
    };

    _onItemPress = (propertyId, communityId, communityName) => {
        let {navigator} = this.props;

        navigator.push({
            component: DetailContainer,
            name: 'houseDetail',
            title: '房源详情',
            hideNavBar: false,
            propertyId,
            communityId,
            communityName
        });
    };

    _onRefresh = () => {
        let {actions} = this.props;
        this.setState({
            isRefreshing: true
        })
        InteractionManager.runAfterInteractions(() => {
            actions.fetchAttentionPrependHouseList({});
        });
        this.setState({
            isRefreshing: false
        })
    };

    _onHandlePress = () => {
        let {navigator} = this.props;

        navigator.push({
            component: HouseListContainer,
            name: 'houseList',
            title: '全部房源',
            hideNavBar: false
        });
    };

    _onEndReached = () => {
        let {actions, houseData} = this.props;
        let pager = houseData.get('pager');

        if (Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchAttentionAppendHouseList({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    };

    _renderHeader = () => {
        let {attentionList, navigator} = this.props;

        return (
            <View>
                <TouchableWithoutFeedback  onPress={this._onHandlePress}>
                    <View style={styles.allHouse}>
                        <Image
                            source={require('../images/all_house.png')}
                            style={styles.allHouseImage}
                        />
                        <Text style={[styles.flex, styles.textPadding, styles.heiti_16_header]}>{this.props.rout}</Text>
                        <Image
                            source={require('../images/next.png')}
                            style={styles.nextImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <Attention attentionList={attentionList} navigator={navigator}/>
            </View>
        )
    };

    _renderFooter = () => {
        let {houseData} = this.props;
        let pager = houseData.get('pager');

        return (
                Number(pager.get('current_page')) == Number(pager.get('last_page')) ?
                    <View style={styles.listFooter}>
                        <Text style={styles.noData}>已经没有数据了！</Text>
                    </View>
                     :
                    <View style={styles.listFooter}>
                        <ActivityIndicator color={'#d43d3d'} styleAttr="Small"/>
                    </View>
        );
    };
}

export class Attention extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {attentionList} = this.props;
        let districtBlockSelect = attentionList.get('district_block_select');
        let communitySelect = attentionList.get('community_select');
        let dbArr = districtBlockSelect && (districtBlockSelect.map((v) => {
            return v.get('name');
        })).toJS() || ['请选择板块'];

        let commArr = communitySelect && (communitySelect.map((c) => {
            return c.get('name')
        })).toJS() || ['请选择小区'];

        return (
            <View style={[styles.attention]}>
                <View style={[styles.row, styles.alignItems, styles.headerMarginBottom]}>
                    <Text style={styles.bar}></Text>
                    <Text style={[styles.flex, styles.heiti_16_header]}>我关注的房源</Text>
                </View>
                <TouchableWithoutFeedback onPress={this._onAttentionBlockSet.bind(null, attentionList)}>
                    <View style={[styles.row, styles.attentionMsg, styles.alignItems]}>
                        <View style={[styles.column, styles.flex]}>
                            <Text style={[styles.heiti_15_content]} numberOfLines={1}>板块：{dbArr.join('、')}</Text>
                            <Text style={[styles.heiti_15_content]} numberOfLines={1}>小区：{commArr.join('、')}</Text>
                        </View>
                        <Image
                            source={require('../images/next.png')}
                            style={styles.nextImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    _onAttentionBlockSet = (attentionList) => {
        let {navigator} = this.props;

        navigator.push({
            component: AttentionBlockSetOneContainer,
            name: 'AttentionBlockSetOneContainer',
            title: '设置我的关注',
            hideNavBar: false,
            attentionList
        });
    };
}

const styles = StyleSheet.create({
    pageBgColor: {
        backgroundColor: '#eee'
    },
    searchWrap: {
        height: 60,
        backgroundColor: '#04c1ae'
    },
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    column: {
        flexDirection: 'column'
    },
    allHouse: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        marginBottom: 10,
        borderWidth: 1/PixelRatio.get()
    },
    allHouseImage: {
        width: 30,
        height: 30
    },
    nextImage: {
        width: 9,
        height: 18
    },
    headerMarginBottom: {
        marginBottom: 15
    },
    textPadding: {
        paddingLeft: 10
    },
    listFooter: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    noData: {
        color: '#8d8c92',
        fontSize: 12
    },
    attention: {
        padding: 15,
        paddingBottom: 0,
        backgroundColor: '#fff',
    },
    attentionMsg: {
        padding: 15,
        backgroundColor: '#f8f8f8',
    },
    bar: {
        width: 3,
        backgroundColor: '#04C1AE',
        marginRight: 8
    },
    alignItems: {
        alignItems: 'center',
    },
    heiti_15_content: {
        fontFamily: 'Heiti SC',
        fontSize: 15,
        color: '#3e3e3e'
    },
    heiti_16_header: {
        fontFamily: 'Heiti SC',
        fontSize: 16,
        color: '#3e3e3e',
        fontWeight: 'bold'
    }
});