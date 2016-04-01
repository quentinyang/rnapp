'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight } from 'nuke'
import HouseItem from '../components/HouseItem';
import HouseListContainer from '../containers/HouseListContainer';

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export default class Detail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {sameCommunityList} = this.props;
        let houseList = sameCommunityList.get('properties');

        return (
            <View style={styles.flex}>
                <ListView
                    dataSource={ds.cloneWithRows(houseList.toArray())}
                    renderRow={this._renderRow}
                    initialListSize={5}
                    pageSize={5}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
                    style={styles.listView}
                />
                <View style={styles.contactWrap}>
                    <TouchableHighlight
                        style={styles.contactButton}
                    >
                        <Text style={styles.contactText}>
                            联系房东
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    componentDidMount() {
        let {actions, route} = this.props;
        let propertyId = route.propertyId;

        InteractionManager.runAfterInteractions(() => {
            actions.fetchBaseInfo({
                property_id: propertyId
            });
            actions.fetchSimilarHouseList({
                community_id: propertyId
            });
            actions.fetchHouseStatus({
                property_id: propertyId
            });
        });
    }

    _renderRow = (rowData: any) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        );
    };

    _renderFooter = () => {
        return (
            <View style={styles.moreWrap}>
                <TouchableHighlight
                    style={styles.moreButton}
                    onPress={this._handleMoreHouseList}
                >
                    <Text style={styles.moreText}>
                        查看更多
                    </Text>
                </TouchableHighlight>
            </View>
        )
    };

    _renderHeader = () => {
        let { baseInfo } = this.props;
        return (
            <View>
                <BaseInfo info={baseInfo} />
                <View style={[styles.itemContainer, styles.row]}>
                    <Text style={styles.bar}></Text>
                    <Text style={styles.baseSize}>同小区房源</Text>
                </View>
            </View>
        )
    };

    _onItemPress = (propertyId: string) => {
        let {navigator} = this.props;

        // 重新加载数据
    };

    _handleMoreHouseList = () => {
        let {route, navigator} = this.props;
        let {communityName, communityId} = route;
        console.info('Route: ', route);
        navigator.push({
            component: HouseListContainer,
            name: 'houseDetail',
            title: '房源详情',
            hideNavBar: false,
            communityName,
            communityId
        });
    };
}

class BaseInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {info} = this.props;
        let baseInfo = info.get('baseInfo');
        let status = info.get('status');

        let statusList = status.map((s, i) => {
            return (
                <Text key={i} style={styles.statusList}>{s.get('time')} {s.get('name')}{s.get('status')}</Text>
            );
        });
        return (
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <View style={[styles.row, styles.name]}>
                        <Text numberOfLines={1} style={{fontSize: 19, flex: 1}}>{baseInfo.get('community_name') || ''} {baseInfo.get('building_num') || ''}{baseInfo.get('building_unit') || ''}{baseInfo.get('door_num') || ''}室</Text>
                        <Text style={{fontSize: 12, width: 68, color: '#8d8c92'}}>查看次数:{baseInfo.get('see_count')}</Text>
                    </View>
                    <Text style={styles.baseSize}>{baseInfo.get('district_name') || ''}-{baseInfo.get('block_name') || ''}<Text style={styles.baseSpace}>{baseInfo.get('community_address') || ''}</Text></Text>
                </View>

                <View style={[styles.itemContainer, styles.row]}>
                    <Text style={styles.baseSize}>户型:</Text>
                    <Text style={[styles.baseSize, styles.baseSpace]}>{baseInfo.get('bedrooms') || ''}室{baseInfo.get('living_rooms') || ''}厅{baseInfo.get('bathrooms') || ''}卫</Text>
                </View>
                <View style={[styles.itemContainer, styles.row]}>
                    <Text style={styles.baseSize}>面积:</Text>
                    <Text style={[styles.baseSize, styles.baseSpace]}>{baseInfo.get('area') || ''}m²</Text>
                </View>
                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>总价:</Text><Text style={[styles.baseSize, styles.baseSpace]}>{baseInfo.get('price') || ''}万</Text></View>
                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>单价:</Text><Text style={[styles.baseSize, styles.baseSpace]}>{baseInfo.get('avg_price') || ''}元/m²</Text></View>
                <View style={styles.itemContainer}>
                    <View style={styles.row}><Text style={styles.baseSize}>状态:</Text><Text style={[styles.baseSize, styles.baseSpace, {color: '#ff6d4b'}]}>{baseInfo.get('status') || ''}</Text></View>
                    {statusList}
                </View>

                <View style={[styles.itemContainer, styles.row]}>
                    <Image style={styles.money_icon} source={require('../images/money.png')}/>
                    <Text style={{fontSize: 15, marginLeft: 6}}>查看房东电话需要消耗 {baseInfo.get('see_count')} 积分</Text>
                </View>
                <View style={[styles.gap, styles.flex]}></View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    listView: {
        marginBottom: 70
    },
    container: {
        flex: 1
    },
    itemContainer: {
        borderBottomWidth: 1/PixelRatio.get(),
        borderStyle: 'solid',
        borderBottomColor: '#d9d9d9',
        padding: 15
    },
    baseSize: {
        fontSize: 16
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    },
    name: {
        justifyContent: 'space-between',
        marginBottom: 10
    },
    baseSpace: {
        marginLeft: 12
    },
    statusList: {
        fontSize: 12,
        color: '#8d8c92',
        marginTop: 8
    },
    money_icon: {
        width: 18,
        height: 18
    },
    bar: {
        width: 3,
        height: 15,
        backgroundColor: '#04C1AE',
        marginRight: 8,
        borderRadius: 2
    },
    contactWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        borderTopWidth: 1/PixelRatio.get(),
        borderStyle: 'solid',
        borderTopColor: '#d9d9d9',
    },
    contactButton: {
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5,
        position: 'absolute',
        bottom: 10,
        left: 15,
        right: 15,
    },
    contactText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    },
    moreWrap: {
        padding: 15,
        paddingBottom: 0
    },
    moreButton: {
        justifyContent: 'center',
        height: 40,
        borderColor: '#04c1ae',
        borderWidth: 2/PixelRatio.get(),
        borderStyle: 'solid',
        borderRadius: 5,
    },
    moreText: {
        fontSize: 16,
        color: '#04c1ae',
        textAlign: 'center'
    },
    gap: {
        height: 15,
        backgroundColor: '#eee'
    }
});