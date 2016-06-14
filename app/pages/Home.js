'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, ListView, Image, PixelRatio, Modal, Button, TouchableHighlight,
        TouchableWithoutFeedback, RefreshControl, InteractionManager, ActivityIndicator, Platform} from 'nuke';

import HouseListContainer from '../containers/HouseListContainer';
import AttentionBlockSetOneContainer from '../containers/AttentionBlockSetOneContainer';
import SignInContainer from '../containers/SignInContainer';
import Immutable, {List} from 'immutable';
import HouseItem from '../components/HouseItem';
import DetailContainer from '../containers/DetailContainer';
import ScoreRule from './ScoreRule';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import * as common from '../constants/Common';

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

class GiftModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {isVisible, modalInfo, closeGiftModal} = this.props;
        return (
        <Modal visible={isVisible} transparent={true} onRequestClose={() => {closeGiftModal(false)}}>
            <View style={styles.bgWrap}>
                <View style={styles.contentContainer}>
                    <View style={[styles.alignItems, styles.justifyContent, styles.giftBg]}>
                        <Image style={styles.gift} source={require("../images/gift.png")} />
                    </View>

                    <TouchableHighlight
                        style={[styles.flex, styles.alignItems, styles.justifyContent, styles.closeBox]}
                        underlayColor="#fff"
                        onPress={() => {closeGiftModal(false)}}
                    >
                        <Image
                            style={styles.closeIcon}
                            source={require("../images/close.png")}
                        />
                    </TouchableHighlight>


                    <Text style={[styles.h5, styles.giftDay]}>连续签到<Text>{modalInfo.get('sign_in_days')}</Text>天</Text>
                    <View style={[styles.row]}>
                        <Text>
                            <Text style={[styles.h2, styles.addNum]}>+</Text>
                            <Text style={[styles.h1, styles.scoreNum]}>{modalInfo.get('experience')}</Text>
                            经验</Text>
                        { modalInfo.get('points') ?
                            <Text style={styles.scoreAdd}>
                                <Text style={[styles.h2, styles.addNum]}>+</Text>
                                <Text style={[styles.h1, styles.scoreNum]}>{modalInfo.get('score')}</Text>
                                积分</Text>
                            : null
                        }
                    </View>

                    <TouchableHighlight
                        underlayColor='#fff'
                        onPress={this._goScore.bind(this)}
                    >
                        <View style={styles.flex}>
                            <Text style={[styles.giftBtn, styles.flex]}>查看详情></Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        </Modal>
        );
    }

    _goScore() {
        let {navigator, closeGiftModal, modalInfo} = this.props;

        closeGiftModal(false);
        navigator.push({
            component: SignInContainer,
            name: 'signIn',
            title: '签到送积分',
            hideNavBar: false,
            signInfo: modalInfo
        });
    }
}

class ScoreModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {modalInfo, actions} = this.props;
        return (
            <Modal visible={modalInfo.get('visible')} transparent={true} onModalVisibilityChanged={actions.setScoreModalVisible}>
                <View style={styles.bgWrap}>
                    <View style={styles.contentContainer}>
                        <TouchableHighlight
                            style={styles.closeBox}
                            underlayColor="#fff"
                            onPress={() => {ActionUtil.setAction(actionType.BA_FIRSTOPEN_DELETE);actions.setScoreModalVisible(false);}}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={[styles.msgTip]}>领<Text style={styles.orange}>{modalInfo.get('score')}</Text>积分免费看房源</Text>
                        <Button
                            containerStyle={[styles.btn, styles.btnMarginBottom]}
                            itemStyle={styles.btnSize} label="立即领取"
                            onPress={this._goScoreDetail.bind(this)} />
                    </View>
                </View>
            </Modal>
        );
    }

    _goScoreDetail() {
        let {actions, navigator} = this.props;
        actions.setScoreModalVisible(false);
        ActionUtil.setAction(actionType.BA_FIRSTOPEN_GETSOON);

        navigator.push({
            component: ScoreRule,
            name: 'scoreRule',
            title: '积分规则',
            hideNavBar: false,
            bp: actionType.BA_HOME_PAGE,
            backLog: actionType.BA_FIRSTOPEN_RETURN,
            score: this.props.modalInfo.get('score')
        });
    }
}

export default class Home extends Component {
    constructor(props) {
        super(props);
        var self = this;

        this.state = {
            isRefreshing: false,
            showGiftModal: false
        };
        this.pageId = actionType.BA_HOME_PAGE;
        ActionUtil.setActionWithExtend(actionType.BA_HOME_PAGE_ONVIEW, {"bp": this.props.route.bp});

        let key = common.APP_OPEN_DATE + guid;
        AsyncStorageComponent.get(key)
            .then((value) => {
                let today = new Date().getDate().toString();

                if(0 && value && value == today) { //不为空且 == today, 不显示
                } else { //为空 或 != today, 则显示并更新
                    self._setGiftModalVisible(true);
                    AsyncStorageComponent.save(key, today);
                    self.props.actions.fetchGiftInfo();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        let {houseData, baseInfo, actions, navigator} = this.props;
        let houseList = houseData.get('properties');
        let scoreModalInfo = baseInfo.get('scoreModal');
        return (
            <View style={[styles.flex, styles.pageBgColor]}>
                <ScoreModal modalInfo={scoreModalInfo} actions={actions} navigator={navigator} />
                <GiftModal
                    isVisible={this.state.showGiftModal}
                    modalInfo={baseInfo.get('giftModal')}
                    navigator={navigator}
                    closeGiftModal={this._setGiftModalVisible}
                />
                <View style={styles.searchWrap}>
                    <View style={[styles.searchBox, styles.row, styles.alignItems]}>
                        <Text style={[styles.searchText, styles.searchTextPadding]}>上海</Text>
                        <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, 'search')}>
                            <View style={[styles.flex, styles.searchBtn, styles.alignItems, styles.justifyContent, styles.row]}>
                                <Image
                                    source={require('../images/searchWhite.png')}
                                    style={styles.searchWhite}
                                />
                                <Text style={[styles.searchText]}>
                                    搜索
                                </Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <ListView
                    style={styles.noDataBg}
                    contentContainerStyle={styles.contentContainerStyle}
                    dataSource={ds.cloneWithRows(houseList.toArray())}
                    automaticallyAdjustContentInsets={false}
                    renderRow={this._renderRow}
                    initialListSize={10}
                    pageSize={10}
                    scrollRenderAheadDistance={50}
                    minPulldownDistance={30}
                    onEndReachedThreshold={50}
                    onEndReached={this._onEndReached}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
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
            </View>
        )
    }

    componentDidMount() {
        let {actions} = this.props;

        InteractionManager.runAfterInteractions(() => {
            // actions.fetchAttentionHouseList({});
            actions.fetchAttentionBlockAndCommunity({});
            actions.fetchScoreModalStatus();
            actions.fetchHouseNewCount();
        });
    }

    componentWillUnmount() {
        this.props.actions.clearHomePage();
    }

    _renderRow = (rowData: any) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        )
    };

    _onItemPress = (item) => {
        ActionUtil.setAction(actionType.BA_HOME_PAGE_CLICKDETAIL);
        let {navigator, actions} = this.props;
        if(!item.get('is_click')) {
            actions.setLookStatus({
                property_id: item.get('property_id')
            });
        }

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

    _onRefresh = () => {
        ActionUtil.setAction(actionType.BA_HOME_PAGE_SLIDEDOWN);
        let {actions} = this.props;
        this.setState({
            isRefreshing: true
        })
        InteractionManager.runAfterInteractions(() => {
            actions.fetchAttentionPrependHouseList({});
            actions.fetchHouseNewCount();
        });
        this.setState({
            isRefreshing: false
        })
    };

    _onHandlePress = (type) => {
        let {navigator, actionsHouseList} = this.props;
        if (type == 'search') {
            ActionUtil.setAction(actionType.BA_HOME_PAGE_SEARCH);
            actionsHouseList.autocompleteViewShowed(true);
            navigator.push({
                component: HouseListContainer,
                name: 'houseList',
                title: '全部房源',
                from: 'homeSearch',
                hideNavBar: true,
                bp: this.pageId
            });
        } else {
            ActionUtil.setAction(actionType.BA_HOME_PAGE_ALLHOUSELIST);
            navigator.push({
                component: HouseListContainer,
                name: 'houseList',
                title: '全部房源',
                hideNavBar: true,
                bp: this.pageId
            });
        }
    };

    _onEndReached = () => {
        ActionUtil.setAction(actionType.BA_HOME_PAGE_SLIDEUP);
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
        let {attentionList, navigator, baseInfo, houseData} = this.props;
        let houseList = houseData.get('properties');

        return (
            <View>
                <TouchableWithoutFeedback  onPress={this._onHandlePress.bind(null, 'list')}>
                    <View style={styles.allHouse}>
                        <Image
                            source={require('../images/all_house.png')}
                            style={[styles.allHouseImage]}
                        />
                        <Text style={[styles.flex, styles.heiti_16_header]}>{this.props.rout}</Text>
                        <Text style={styles.noData}>今日新增<Text style={[styles.mediumFont, styles.orange]}>{baseInfo.get('newCount')}</Text>套</Text>
                        <Image
                            source={require('../images/next.png')}
                            style={styles.nextImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={[styles.headerLine]}></View>
                <Attention attentionList={attentionList} hasHouse={houseList.size} navigator={navigator} onAttentionBlockSet={this._onAttentionBlockSet}/>
            </View>
        )
    };

    _renderFooter = () => {
        let {houseData, attentionList, navigator} = this.props;
        let pager = houseData.get('pager');
        let footerView = null;

        if (Number(pager.get('current_page')) == Number(pager.get('last_page')) && Number(pager.get('total')) != 0) {
            footerView = <View style={styles.listFooter}>
                        <Text style={styles.noData}>已经没有数据了！</Text>
                    </View>
        } else if(Number(pager.get('current_page')) != Number(pager.get('last_page')) && Number(pager.get('total')) != 0) {
            footerView = <View style={styles.listFooter}>
                        <ActivityIndicator color={'#ccc'} styleAttr="Small"/>
                    </View>
        } else {
            footerView = <NoData attentionList={attentionList} navigator={navigator} onAttentionBlockSet={this._onAttentionBlockSet}/>
        }
        return footerView;
    };

    _onAttentionBlockSet = (attentionList, log) => {
        ActionUtil.setAction(log);
        let {navigator} = this.props;

        navigator.push({
            component: AttentionBlockSetOneContainer,
            name: 'AttentionBlockSetOneContainer',
            title: '设置我的关注',
            hideNavBar: false,
            backLog: actionType.BA_SETFOCUS_RETURN,
            bp: this.pageId,
            attentionList
        });
    };

    _setGiftModalVisible = (visible) => {
        this.setState({
            showGiftModal: visible
        });
    }
}

export class Attention extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {attentionList, hasHouse} = this.props;
        let districtBlockSelect = attentionList.get('district_block_select');
        let communitySelect = attentionList.get('community_select');
        let dbArr = districtBlockSelect.size > 0 && (districtBlockSelect.map((v) => {
            return v.get('name');
        })).toJS() || ['去设置板块'];

        let commArr = communitySelect.size > 0 && (communitySelect.map((c) => {
            return c.get('name')
        })).toJS() || ['去设置小区'];

        return (
            <View style={styles.attention}>
                <View style={[styles.row, styles.alignItems, styles.headerMarginBottom]}>
                    <View style={styles.bar}></View>
                    <Text style={[styles.flex, styles.heiti_16_header]}>我的关注</Text>
                </View>
                <TouchableWithoutFeedback onPress={this.props.onAttentionBlockSet.bind(null, attentionList, actionType.BA_HOME_PAGE_SETFOCUS)}>
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
                <View style={[styles.row, styles.alignItems]}>
                    {hasHouse ? <View style={styles.bar}></View> : null}
                    <Text style={[styles.flex, styles.heiti_16_header]}>{hasHouse ? '关注的房源': ''}</Text>
                </View>
            </View>
        )
    }
}

class NoData extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {attentionList} = this.props;
        let districtBlockSelect = attentionList.get('district_block_select');
        let communitySelect = attentionList.get('community_select');
        return (
            <View style={[styles.alignItems]}>
                <Image
                    source={require('../images/noAttention.png')}
                    style={styles.noAttention}
                />
                {
                    districtBlockSelect.size == 0 && communitySelect.size == 0 ?
                        <View style={[styles.alignItems]}>
                            <Text style={[styles.noAttentionText]}>设置关注的区域得<Text style={[styles.orange, styles.mediumFont]}>8</Text>积分</Text>
                            <Text style={[styles.noAttentionText]}>最多免费看<Text style={[styles.orange, styles.mediumFont]}>4</Text>套房源</Text>
                        </View> :
                        <Text style={[styles.noAttentionText]}>关注的板块和小区没有房源</Text>
                }

                {
                    districtBlockSelect.size == 0 && communitySelect.size == 0 ?
                    <TouchableWithoutFeedback onPress={this.props.onAttentionBlockSet.bind(null, attentionList, actionType.onAttentionBlockSet)}>
                        <View style={[styles.noAttentionBtn, styles.alignItems]}>
                            <Text style={styles.noAttentionBtnText}>去设置</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageBgColor: {
        backgroundColor: '#eee'
    },
    searchWrap: {
        height: (Platform.OS === 'ios') ? 65 : 45,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: '#04c1ae'
    },
    searchBox: {
        height: 45,
        paddingLeft: 15,
        paddingRight: 15
    },
    searchBtn: {
        height: 33,
        backgroundColor: '#0eaa99',
        borderRadius: 5
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
    mediumFont: {
        fontWeight: '500'
    },
    h1: {
        fontSize: 40
    },
    h2: {
        fontSize: 30
    },
    h5: {
        fontSize: 15
    },
    allHouse: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        borderColor: '#d9d9d9',
        // marginBottom: 10,
        borderBottomWidth: 1/PixelRatio.get()
    },
    headerLine: {
        height: 10,
        backgroundColor: '#eee'
    },
    allHouseImage: {
        width: 40,
        height: 40,
        marginRight: 10
    },
    nextImage: {
        width: 9,
        height: 18,
        marginLeft: 10
    },
    headerMarginBottom: {
        marginBottom: 15
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
        borderColor: '#d9d9d9',
        borderTopWidth: 1/PixelRatio.get()
    },
    attentionMsg: {
        height: 70,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#f8f8f8',
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9',
        borderRadius: 3,
        marginBottom: 15
    },
    bar: {
        width: 3,
        height: 15,
        backgroundColor: '#04C1AE',
        marginRight: 8,
        borderRadius: 2
    },
    alignItems: {
        alignItems: 'center',
    },
    justifyContent: {
        justifyContent: 'center',
    },
    heiti_15_content: {
        fontSize: 15,
        color: '#3e3e3e',
        marginTop: 4,
        marginBottom: 3
    },
    heiti_16_header: {
        fontSize: 16,
        color: '#3e3e3e',
        fontWeight: '500'
    },
    noDataBg: {
        backgroundColor: '#fff',
    },
    noAttention: {
        width: 90,
        height: 108,
        marginBottom: 20
    },
    noAttentionText: {
        paddingBottom: 6,
        fontSize: 16,
        color: '#3e3e3e',
        textAlign: 'center'
    },
    noAttentionBtn: {
        marginTop: 12,
        width: 150,
        height: 30,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#04C1AE',
        borderRadius: 6,
        justifyContent: 'center'
    },
    noAttentionBtnText: {
        fontSize: 15,
        color: '#04C1AE'
    },
    searchText: {
        fontSize: 15,
        color: '#fff'
    },
    searchTextPadding: {
        paddingRight: 10
    },
    searchWhite: {
        width: 21,
        height: 21,
        marginTop: 3
    },
    bgWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    contentContainer: {
        width: 270,
        borderRadius: 10,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    closeBox: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 50,
        height: 30,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    closeIcon: {
        width: 15,
        height: 11
    },
    msgTip: {
        marginTop: 16,
        marginBottom: 20,
        textAlign: "center",
        color: "#3E3E3E",
        fontSize: 19
    },
    orange: {
        color: "#FD9673"
    },
    btn: {
        width: 220,
        justifyContent: "center",
        borderRadius: 5
    },
    btnMarginBottom: {
        marginBottom: 5
    },
    btnSize: {
        fontSize: 18
    },
    giftBg: {
        position: 'absolute',
        top: -32,
        left: 104,
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: "#04C1AE"
    },
    gift: {
        width: 34,
        height: 34
    },
    giftDay: {
        marginTop: 28,
        marginBottom: 4
    },
    scoreAdd: {
        marginLeft: 30
    },
    addNum: {
        letterSpacing: 6,
        marginTop: -3
    },
    scoreNum: {
        letterSpacing: 1
    },
    giftBtn: {
        color: "#04c1ae",
        fontSize: 12,
        marginTop: 14
    }
});