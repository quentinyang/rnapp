'use strict';

import {React, Component, Text, View, ListView, StyleSheet, Image,
        TouchableWithoutFeedback, RefreshControl, ActivityIndicator, InteractionManager} from 'nuke';
import HouseItem from '../components/HouseItem';
import DetailContainer from '../containers/DetailContainer';
import Immutable, {List} from 'immutable';
import Filter from '../components/Filter';
import FilterTab from '../components/FilterTab';
import Area from '../components/Area';
import SearchNavigator from '../components/SearchNavigator';
import Autocomplete from '../components/autocomplete'
import AutocompleteItem from '../components/AutocompleteItem'

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
        let {houseData, filterData, uiData, queryParamsData, navigator, communityData} = this.props;
        let houseList = houseData.get('properties');
        let pager = houseData.get('pager');
        let tabType = uiData.get('tabType');
        let onlyVerify = uiData.get('onlyVerify');
        let areaName = uiData.get('areaName');
        let bedroomsName = uiData.get('bedroomsName');
        let priceName = uiData.get('priceName');

        return (
            !uiData.get('autocompleteView') ? <View style={styles.flex}>
                <SearchNavigator navigator={navigator} onSearch={this._onSearch}
                    titleName={queryParamsData.get('community_name')}
                    onClearKeyword={this._onClearKeyword}
                />
                <Filter
                    tabType={tabType}
                    onlyVerify={onlyVerify}
                    areaName={areaName}
                    priceName={priceName}
                    bedroomsName={bedroomsName}
                    filterItemPress={this._filterItemPress}
                    onlyVerifyChanged={this._onlyVerifyChanged}
                />
                {
                    Number(pager.get('total')) > 0 ? 
                    <ListView
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
                }
                {
                    tabType && tabType != 4 ?
                        <Text style={[styles.mask, styles.maskBg]} onPress={this._hideMask}></Text>
                    : null
                }
                {
                    tabType == 1 ? 
                        <View style={styles.filterMask}>
                            <Area
                                data={filterData.get('district_block_list')}
                                leftSelectId={queryParamsData.get('district_id')}
                                rightSelectId={queryParamsData.get('block_id')}
                                blockFilterChanged={this._blockFilterChanged}
                            />
                        </View>
                    : null
                }
                {
                    tabType == 2 ? 
                        <View style={styles.filterMask}>
                            <FilterTab
                                data={filterData.get('price')}
                                min={queryParamsData.get('min_price')}
                                max={queryParamsData.get('max_price')}
                                filterTabChanged={this._filterTabChanged.bind(null, 'price')}
                            />
                        </View>
                    : null
                }
                {
                    tabType == 3 ? 
                        <View style={styles.filterMask}>
                            <FilterTab
                                data={filterData.get('bedrooms')}
                                min={queryParamsData.get('min_bedrooms')}
                                max={queryParamsData.get('max_bedrooms')}
                                filterTabChanged={this._filterTabChanged.bind(null, 'bedrooms')}
                            />
                        </View>
                    : null
                }
            </View>
            :
            <View style={styles.flex}>
                <Autocomplete
                    placeholder="搜索小区..."
                    keyword={queryParamsData.get('community_name')}
                    results = {communityData.get('results')}
                    renderRow={this._renderAutocompleteRow}
                    onChangeText={this._onChangeText}
                    onCancelSearch={this._cancelSearch}
                />
            </View>
        )
    }

    componentDidMount() {
        let {loaded} = this.state;
        let {actions, houseData, queryParamsData} = this.props;
        let pager = houseData.get('pager');
        if (!loaded) {
            InteractionManager.runAfterInteractions(() => {
                // actions.fetchHouseList({
                //     page: Number(pager.get('current_page')) + 1,
                //     ...queryParamsData.toJS()
                // });
                actions.fetchHouseFilter();
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
        let {actions, houseData, queryParamsData} = this.props;
        let pager = houseData.get('pager');

        if (Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchAppendHouseList({
                    page: Number(pager.get('current_page')) + 1,
                    ...queryParamsData.toJS()
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
        let {actions, queryParamsData} = this.props;
        let queryParamsDataJs = queryParamsData.toJS();
        this.setState({isRefreshing: true});

        InteractionManager.runAfterInteractions(() => {
            actions.fetchPrependHouseList({
                page: 1,
                ...queryParamsDataJs
            });
        });

        this.setState({isRefreshing: false});
    };

    _onItemPress = (item) => {
        let {navigator} = this.props;

        navigator.push({
            component: DetailContainer,
            name: 'houseDetail',
            title: '房源详情',
            hideNavBar: false,
            item
        });
    };

    _filterItemPress = (type) => {
        let {actions, uiData} = this.props;
        let tabType = uiData.get('tabType');
        if (type != '' && tabType == type) {
            actions.filterItemPressed('');
        } else {
            actions.filterItemPressed(type);
        }
    };

    // 过滤只看认证
    _onlyVerifyChanged = (verify) => {
        let {actions, queryParamsData} = this.props;
        let queryParamsDataJs = queryParamsData.toJS();
        queryParamsDataJs.only_verify = verify;

        actions.fetchHouseList({
            page: 1,
            ...queryParamsDataJs
        });

        actions.onlyVerifyChanged(verify)
    };

    // 过滤区域板块
    _blockFilterChanged = (districtId, blockId, areaName) => {
        let {actions, queryParamsData} = this.props;
        let queryParamsDataJs = queryParamsData.toJS();
        queryParamsDataJs.block_id = blockId;
        queryParamsDataJs.district_id = districtId;

        actions.fetchHouseList({
            page: 1,
            ...queryParamsDataJs
        });

        actions.blockFilterChanged(districtId, blockId, areaName);
        this._hideMask();
    };

    // 过滤价格或者户型
    _filterTabChanged = (type, min, max, title) => {
        let {actions, queryParamsData} = this.props;
        let queryParamsDataJs = queryParamsData.toJS();

        if (type == 'price') {
            queryParamsDataJs.min_price = min;
            queryParamsDataJs.max_price = max;

            actions.fetchHouseList({
                page: 1,
                ...queryParamsDataJs
            });
            actions.filterTabPriceChanged(min, max, title);
        } else {
            queryParamsDataJs.min_bedrooms = min;
            queryParamsDataJs.max_bedrooms = max;

            actions.fetchHouseList({
                page: 1,
                ...queryParamsDataJs
            });
            actions.filterTabBedroomsChanged(min, max, title);
        }

        this._hideMask();
    };

    _hideMask = () => {
        let {actions} = this.props;

        actions.filterItemPressed('')
    };

    // autocomplete
    _onSearch = () => {
        let {actions, queryParamsData} = this.props;
        let communityName = queryParamsData.get('community_name');

        actions.autocompleteViewShowed(true)
        actions.fetchHouseListCommunityList({keyword: communityName});
    };

    _cancelSearch = () => {
        let {actions} = this.props;

        actions.autocompleteViewShowed(false)
    };

    _onChangeText = (value) => {
        let {actions} = this.props;
        actions.fetchHouseListCommunityList({keyword: value});
    };

    _renderAutocompleteRow = (item, index) => {
        return <AutocompleteItem key={index} item={item} onPress={this._autocompleteRowPress}/>;
    };

    _autocompleteRowPress = (item) => {
        let {actions} = this.props;
        actions.fetchHouseList({
            page: 1,
            community_id: item.get('id'),
            community_name: item.get('name')
        });
        actions.filterCommunityNameChanged(item.get('id'), item.get('name'));
    };

    _onClearKeyword = () => {
        let {actions} = this.props;
        actions.fetchHouseList({page: 1});
        actions.filterCommunityNameCleared()
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
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
    },
    mask: {
        position: 'absolute',
        top: 108,
        bottom: 0,
        left: 0,
        right: 0
    },
    filterMask: {
        position: 'absolute',
        top: 88,
        left: 0,
        right: 0,
        height: 278
    },
    maskBg: {
        backgroundColor: '#000',
        opacity: 0.5
    }
});

