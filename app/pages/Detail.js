'use strict';

import {React, Component, View, Text, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight } from 'nuke'
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
            actions.fetchSimilarHouseList({
                community_id: propertyId
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
        return (
            <View>
                <BaseInfo />
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
        console.dir(route);
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
        return (
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <View style={[styles.row, styles.name]}>
                        <Text style={{fontSize: 19}}>发动机可开放时间</Text>
                        <Text style={{fontSize: 12, color: '#8d8c92'}}>查看次数:{1}</Text>
                    </View>
                    <Text style={styles.baseSize}>发动机可<Text style={styles.baseSpace}>开放时间</Text></Text>
                </View>

                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>户型:</Text><Text style={[styles.baseSize, styles.baseSpace]}>开放时间</Text></View>
                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>面积:</Text><Text style={[styles.baseSize, styles.baseSpace]}>开放时间</Text></View>
                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>总价:</Text><Text style={[styles.baseSize, styles.baseSpace]}>开放时间</Text></View>
                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>单价:</Text><Text style={[styles.baseSize, styles.baseSpace]}>开放时间</Text></View>
                <View style={styles.itemContainer}>
                    <View style={styles.row}><Text style={styles.baseSize}>状态:</Text><Text style={[styles.baseSize, styles.baseSpace, {color: '#ff6d4b'}]}>发动</Text></View>
                    <Text style={styles.statusList}>234345附近的开始发送了房间</Text>
                </View>

                <View style={[styles.itemContainer, styles.row]}>
                    <Text>Icon</Text>
                    <Text style={{fontSize: 15, marginLeft: 6}}>查看房东电话需要消耗 4 积分</Text>
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