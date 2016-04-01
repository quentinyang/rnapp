'use strict';

import {React, Component, Text, View, ListView, StyleSheet, Image,
        TouchableWithoutFeedback, RefreshControl, ActivityIndicator, InteractionManager} from 'nuke';
import HouseItem from '../components/HouseItem';
import DetailContainer from '../containers/DetailContainer';
import Immutable, {List} from 'immutable';

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});


export default class HouseList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: false,
            loaded: false
        }
    }

    render() {
        let {houseData} = this.props;
        let houseList = houseData.get('properties');
        let pager = houseData.get('pager');

        return (
            Number(pager.get('total')) > 0 ? 
            <ListView
                style={styles.listViewWrap}
                dataSource={ds.cloneWithRows(houseList.toArray())}
                renderRow={this._renderRow}
                renderFooter={this._renderFooter}
                initialListSize={10}
                pageSize={10}
                scrollRenderAheadDistance={50}
                minPulldownDistance={30}
                onEndReachedThreshold={50}
                onEndReached={this._onEndReached}
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
            :
            <View style={[styles.flex, styles.center]}>
                <Image
                    source={require('../images/no_house_list.png')}
                    style={styles.noHouseList}
                />
                <Text style={styles.noHouseListMsg}>没有找到符合要求的结果</Text>
            </View>
        )
    }

    componentDidMount() {
        let {loaded} = this.state;
        let {actions, houseData} = this.props;
        let pager = houseData.get('pager');
        if (!loaded) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchHouseList({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    }

    componentWillUnmount() {
        let {actions} = this.props;
        actions.houseListPageCleared();
    }

    _renderRow = (rowData: any, sectionID: number, rowID: number) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        )
    };

    _onEndReached = () => { // 防止多次重复加载
        let {actions, houseData} = this.props;
        let pager = houseData.get('pager');

        if (Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchAppendHouseList({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
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

    _onRefresh = () => {
        let {actions} = this.props;
        this.setState({isRefreshing: true});

        InteractionManager.runAfterInteractions(() => {
            actions.fetchPrependHouseList({});
        });

        this.setState({isRefreshing: false});
    };

    _onItemPress = (propertyId) => {
        let {navigator} = this.props;

        navigator.push({
            component: DetailContainer,
            name: 'houseDetail',
            title: '房源详情',
            hideNavBar: false,
            propertyId: propertyId
        });
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    listViewWrap: {

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

