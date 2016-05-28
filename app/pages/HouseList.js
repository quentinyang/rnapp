'use strict';

import {React, Component, Text, View, ListView, StyleSheet, Image, Platform,
        TouchableWithoutFeedback, RefreshControl, ActivityIndicator, InteractionManager} from 'nuke';
import HouseItem from '../components/HouseItem';
import DetailContainer from '../containers/DetailContainer';
import Immutable, {List} from 'immutable';
import Filter from '../components/Filter';
import FilterTab from '../components/FilterTab';
import Area from '../components/Area';
import SearchNavigator from '../components/SearchNavigator';
import Autocomplete from '../components/Autocomplete'
import AutocompleteItem from '../components/AutocompleteItem'
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});


export default class HouseList extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_ALLHOUSE_LIST;
        ActionUtil.setActionWithExtend(actionType.BA_ALLHOUSE_LIST_ONVIEW, {"bp": this.props.route.bp});

        let fromHomeSearch = this.props.route.from ? true: false;
        this.state = {
            isRefreshing: false,
            loaded: false,
            homeSearch: fromHomeSearch
        };
        this.keyword = "";
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
                    backLog={actionType.BA_ALLHOUSE_LIST_RETURN}
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
                    visibleLog={this.state.homeSearch ? actionType.BA_LOOK_HOME_SEARCH_ONVIEW : actionType.BA_LOOK_LIST_SEARCH_ONVIEW}
                    bp={this.state.homeSearch ? actionType.BA_HOME_PAGE : actionType.BA_ALLHOUSE_LIST}
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
        let {actions, actionsNavigation, route} = this.props;
        actions.houseListPageCleared();
        if(route.from == 'houseDetail') {
            actionsNavigation.detailPopRoute();
        } else if(route.from == 'houseList') {
            actionsNavigation.listPopRoute();
        }
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
            ActionUtil.setAction(actionType.BA_ALLHOUSE_LIST_SLIDEUP);
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
        let propertiesLength = houseData.get('properties').size;

        return (
                (Number(pager.get('current_page')) == Number(pager.get('last_page')) || (Number(pager.get('current_page')) > 0 && propertiesLength < 10 )) ?
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
        ActionUtil.setAction(actionType.BA_ALLHOUSE_LIST_SLIDEDOWN);
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
        ActionUtil.setAction(actionType.BA_ALLHOUSE_LIST_CLICKDETAIL);
        let {navigator, actionsNavigation, actions, actionsHome, actionsDetail} = this.props;
        actionsNavigation.listPushRoute();
        navigator.push({
            component: DetailContainer,
            from: 'houseList',
            name: 'houseDetail',
            title: '房源详情',
            hideNavBar: false,
            backLog: actionType.BA_DETAIL_RETURN,
            bp: this.pageId,
            item
        });
        if(!item.get('is_click')) {
            actionsNavigation.setLookStatus({
                property_id: item.get('property_id'),
                is_click: "1"
            });
            actionsHome.setLookStatus({
                property_id: item.get('property_id')
            });
        }
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
        ActionUtil.setAction(actionType.BA_ALLHOUSE_LIST_FILTERCERTIFY);
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
        ActionUtil.setAction(actionType.BA_ALLHOUSE_LIST_FILTERAREA);
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
            ActionUtil.setAction(actionType.BA_ALLHOUSE_LIST_FILTERPRICE);
            queryParamsDataJs.min_price = min;
            queryParamsDataJs.max_price = max;

            actions.fetchHouseList({
                page: 1,
                ...queryParamsDataJs
            });
            actions.filterTabPriceChanged(min, max, title);
        } else {
            ActionUtil.setAction(actionType.BA_ALLHOUSE_LIST_FILTERSTYLE);
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
        ActionUtil.setAction(actionType.BA_ALLHOUSE_LIST_SEARCH);
        let {actions, queryParamsData} = this.props;
        let communityName = queryParamsData.get('community_name');

        actions.autocompleteViewShowed(true)
        actions.fetchHouseListCommunityList({keyword: communityName});
    };

    _cancelSearch = () => {
        ActionUtil.setAction(this.state.homeSearch ? actionType.BA_LOOK_HOME_SEARCH_CANCEL : actionType.BA_LOOK_LIST_SEARCH_CANCEL);
        let {actions} = this.props;
        if(this.state.homeSearch) {
            this.props.navigator.pop();
        } else {
            actions.autocompleteViewShowed(false);
        }
    };

    _onChangeText = (value) => {
        let {actions} = this.props;
        this.keyword = value;
        actions.fetchHouseListCommunityList({keyword: value});
    };

    _renderAutocompleteRow = (item, index) => {
        return <AutocompleteItem key={index} item={item} onPress={this._autocompleteRowPress.bind(this)}/>;
    };

    _autocompleteRowPress = (item) => {
        if(this.state.homeSearch) {
            ActionUtil.setActionWithExtend(actionType.BA_LOOK_HOME_SEARCH_ASSOCIATION, {"keyword": this.keyword, "comm_id": item.get("id"), "comm_name": item.get("name")});
        } else {
            ActionUtil.setActionWithExtend(actionType.BA_LOOK_LIST_SEARCH_ASSOCIATION, {"keyword": this.keyword, "comm_id": item.get("id"), "comm_name": item.get("name")});
        }
        let {actions} = this.props;
        if(this.state.homeSearch) {
            this.setState({
                homeSearch: false
            });
        }
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
        top: (Platform.OS == "ios" ? 108 : 88),
        left: 0,
        right: 0,
        height: 278
    },
    maskBg: {
        backgroundColor: '#000',
        opacity: 0.5
    }
});

