'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, ListView, Image, PixelRatio, Modal, Button, TouchableHighlight,
    TouchableWithoutFeedback, RefreshControl, InteractionManager, ActivityIndicator, Platform, AppState} from 'nuke';

import HouseListContainer from '../containers/HouseListContainer';
import AttentionBlockSetOneContainer from '../containers/AttentionBlockSetOneContainer';
import SignInContainer from '../containers/SignInContainer';
import Immutable, {List} from 'immutable';
import HouseItem from '../components/HouseItem';
import DetailContainer from '../containers/DetailContainer';
import ScoreRule from './ScoreRule';
import WelfareContainer from '../containers/WelfareContainer';
let ActionUtil = require('../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import * as common from '../constants/Common';
import * as homeConst from '../constants/Home';
import {getAttentionStatus} from '../service/blockService';
import WelfareModal from '../components/WelfareModal';
import NoNetwork from '../components/NoNetwork';

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

global.gmodal = [];

class InputRuleModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isVisible, modalInfo, actions, setCurrentModal} = this.props;
        return (
        <Modal visible={isVisible} transparent={true} onRequestClose={() => {}}>
            <View style={styles.bgWrap}>
                <View>
                    <View style={[styles.contentContainer, {marginTop: 32}]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.alignItems, styles.justifyContent, styles.closeBox]}
                            underlayColor="transparent"
                            onPress={() => {
                                setCurrentModal('');
                            }}
                            >
                                <Image
                                    style={styles.closeIcon}
                                    source={require("../images/close.png")}
                                />
                            </TouchableHighlight>


                            <Text style={[styles.h5, styles.giftDay, styles.grey]}>发房新规则</Text>

                            <Text>发布一套房源审核通过后获得<Text style={styles.orange}>{modalInfo.get('input_points')}</Text>积分</Text>
                        </View>


                        <View style={[styles.alignItems, styles.justifyContent, styles.giftBg]}>
                            <Image style={styles.horn} source={require("../images/horn.png")}/>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

export default class Home extends Component {
    constructor(props) {
        super(props);
        let hasGetModal = false;

        this.state = {
            isRefreshing: false
        };
        this.pageId = actionType.BA_HOME_PAGE;
        ActionUtil.setActionWithExtend(actionType.BA_HOME_PAGE_ONVIEW, {"bp": this.props.route.bp});
        this._ruleModalStatus();
    }

     _ruleModalStatus() {
        let {actions} = this.props;
        let key = common.APP_SHOW_RULE + guid;

        AsyncStorageComponent.get(key)
            .then((value) => {
                let today = new Date().getDate().toString();

                if(!value) {
                    actions.pushShowModal(homeConst.RULE);
                    actions.fetchRuleModalStatus();
                    AsyncStorageComponent.save(key, today).catch((error) => {console.log(error)});
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    componentWillUpdate() {
        if(this.hasGetModal) {
            return;
        }

        let {baseInfo} = this.props;
        if(baseInfo.get('scoreModal').get('fetched') && baseInfo.get('couponModal').get('fetched')) {
            this._setCurrentModal(homeConst.SCORE);
            this.hasGetModal = true;
        }
    }

    _setCurrentModal(start) {
        let {baseInfo, actions} = this.props;
        let modals = baseInfo.get('modals');
        let cur = '';

        switch(start) {
        case homeConst.SCORE:
            if(modals.includes(homeConst.SCORE)) {
                cur = homeConst.SCORE;

            } else if(modals.includes(homeConst.COUPON)) {
                cur = homeConst.COUPON;

            } else if(modals.includes(homeConst.RULE)) {
                cur = homeConst.RULE;

            }
            break;
        case homeConst.COUPON:
            if(modals.includes(homeConst.COUPON)) {
                cur = homeConst.COUPON;

            } else if(modals.includes(homeConst.RULE)) {
                cur = homeConst.RULE;

            }
            break;
        case homeConst.RULE:
            if(modals.includes(homeConst.RULE)) {
                cur = homeConst.RULE;

            }
            break;
        default:
            break;
        }
        if(cur == homeConst.SCORE) {
            let scoreWelfare = baseInfo.get('scoreModal').get('welfareArr');
            if(scoreWelfare.size) {
                let scorePoints = [];
                scoreWelfare.map((item) => {
                    scorePoints.push(item.cost);
                });

                ActionUtil.setActionWithExtend(actionType.BA_FIRSTOPEN_WELFARE, {"points": scorePoints.join(",")});
            }
        } else if(cur == homeConst.COUPON) {
            let couponWelfare = baseInfo.get('couponModal').get('welfareArr');
            if(couponWelfare.size) {
                let couponPoints = [];
                couponWelfare.map((item) => {
                    couponPoints.push(item.cost);
                });

                ActionUtil.setActionWithExtend(actionType.BA_HOME_PAGEWELFARECARD_ONVIEW, {"points": couponPoints.join(",")});
            }
        } else if(cur == homeConst.RULE) {
            ActionUtil.setAction(actionType.BA_HOME_SENDRULE_ONVIEW);
        }

        actions.currentModalChanged(cur);
    }

    render() {
        let {houseData, baseInfo, actions, navigator} = this.props;
        let houseList = houseData.get('properties');
        let registerMoalInfo = baseInfo.get('scoreModal');
        let couponModalInfo = baseInfo.get('couponModal');

        return (
            <View style={[styles.flex, styles.pageBgColor]}>
                <WelfareModal
                    isVisible={baseInfo.get('currentModal') == homeConst.SCORE}
                    title="注册成功"
                    subTitle={"获得" + registerMoalInfo.get('welfareArr').size + "张看房卡"}
                    welfareData={registerMoalInfo.get('welfareArr')}
                    closeModal={this._closeModal.bind(this, homeConst.COUPON, actionType.BA_FIRSTOPEN_DELETE)}
                    goPage={this._goCoupon.bind(this, homeConst.COUPON, actionType.BA_FIRSTOPEN_GETSOON, actionType.BA_FIRSTOPEN_RETURN)}
                />

                <WelfareModal
                    isVisible={baseInfo.get('currentModal') == homeConst.COUPON}
                    title={"恭喜您获得" + couponModalInfo.get('welfareArr').size + "张"}
                    welfareData={couponModalInfo.get('welfareArr')}
                    closeModal={this._closeModal.bind(this, homeConst.RULE, null)}
                    goPage={this._goCoupon.bind(this, homeConst.RULE, null, actionType.BA_MINE_WELFARE_BACK)}
                />

                <View style={styles.searchWrap}>
                    <View style={[styles.searchBox, styles.row, styles.alignItems]}>
                        <Text style={[styles.searchText, styles.searchTextPadding]}>上海</Text>
                        <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, 'search')}>
                            <View
                                style={[styles.flex, styles.searchBtn, styles.alignItems, styles.justifyContent, styles.row]}>
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
                    removeClippedSubviews={false}
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
            actions.fetchAttentionHouseList({});
            actions.fetchAttentionBlockAndCommunity({});
            actions.fetchScoreModalStatus();
            actions.fetchHouseNewCount();
            actions.fetchCouponModalStatus();
            //actions.fetchRuleModalStatus();
        });

        AppState.addEventListener('change', this._refreshHouseData);
    }

    componentWillUnmount() {
        this.props.actions.clearHomePage();
        AppState.removeEventListener('change', this._refreshHouseData);
    }

    _refreshHouseData = (currentAppState) => {
        if(!gtoken) {
            return;
        }
        if(currentAppState == 'active') {
            let {actions} = this.props;
            InteractionManager.runAfterInteractions(() => {
                actions.fetchAttentionPrependHouseList();
                actions.fetchHouseNewCount();
            });
        }
    }

    _renderRow = (rowData:any) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        )
    };

    _onItemPress = (item) => {
        ActionUtil.setAction(actionType.BA_HOME_PAGE_CLICKDETAIL);
        let {navigator, actions} = this.props;
        if (!item.get('is_click')) {
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
            actions.fetchAttentionBlockAndCommunity();
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
                bp: this.pageId,
                callbackFun: () => {
                    this._refreshHouseData();
                    navigator.pop();
                }
            });
        } else {
            ActionUtil.setAction(actionType.BA_HOME_PAGE_ALLHOUSELIST);
            navigator.push({
                component: HouseListContainer,
                name: 'houseList',
                title: '全部房源',
                hideNavBar: true,
                bp: this.pageId,
                callbackFun: () => {
                    this._refreshHouseData();
                    navigator.pop();
                }
            });
        }
    };

    _onEndReached = () => {
        ActionUtil.setAction(actionType.BA_HOME_PAGE_SLIDEUP);
        let {actions, houseData} = this.props;
        let pager = houseData.get('pager');

        if (Number(pager.get('current_page')) != 0 && Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
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
                <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, 'list')}>
                    <View style={styles.allHouse}>
                        <Image
                            source={require('../images/all_house.png')}
                            style={[styles.allHouseImage]}
                        />
                        <Text style={[styles.flex, styles.heiti_16_header]}>{this.props.rout}</Text>
                        <Text style={styles.noData}>今日新增<Text
                            style={[styles.mediumFont, styles.orange]}>{baseInfo.get('newCount')}</Text>套</Text>
                        <Image
                            source={require('../images/next.png')}
                            style={styles.nextImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <View style={[styles.headerLine]}></View>
                <Attention attentionList={attentionList} hasHouse={houseList.size} navigator={navigator}
                           onAttentionBlockSet={this._onAttentionBlockSet}/>
            </View>
        )
    };

    _renderFooter = () => {
        let {houseData, attentionList, navigator, baseInfo, netWork} = this.props;
        let pager = houseData.get('pager');
        let footerView = null;

        if(netWork == 'no' && !pager.get('total')) {
            footerView = <NoNetwork style={{marginTop: 20}} />
        } else if (Number(pager.get('current_page')) == Number(pager.get('last_page')) && Number(pager.get('total')) != 0) {
            footerView = <View style={styles.listFooter}>
                <Text style={styles.noData}>已经没有数据了！</Text>
            </View>
        } else if (Number(pager.get('current_page')) != Number(pager.get('last_page')) && Number(pager.get('total')) != 0) {
            footerView = <View style={styles.listFooter}>
                <ActivityIndicator color={'#ccc'} styleAttr="Small"/>
            </View>
        } else if(Number(pager.get('current_page')) == 0) {
            footerView = null;
        } else {
            footerView = <NoData attentionList={attentionList} navigator={navigator}
                                 onAttentionBlockSet={this._onAttentionBlockSet}
                                 baseInfo={baseInfo}/>
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
    _goCoupon(modal, log, backLog) {
        let {actions, navigator} = this.props;
        log && ActionUtil.setAction(log);
        actions.currentModalChanged('');

        navigator.push({
            component: WelfareContainer,
            name: 'welfare',
            title: '福利卡',
            hideNavBar: false,
            bp: this.pageId,
            backLog: backLog || '',
            callbackFun: () => {
                navigator.pop();
                this._setCurrentModal(modal);
            }
        });
    }
    _closeModal(modal, log, event) {
        log && ActionUtil.setAction(log);
        this._setCurrentModal(modal);
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
                <TouchableWithoutFeedback
                    onPress={this.props.onAttentionBlockSet.bind(null, attentionList, actionType.BA_HOME_PAGE_SETFOCUS)}>
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
                    <Text style={[styles.flex, styles.heiti_16_header]}>{hasHouse ? '关注的房源' : ''}</Text>
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
        let {attentionList,baseInfo} = this.props;
        let districtBlockSelect = attentionList.get('district_block_select');
        let communitySelect = attentionList.get('community_select');
        return (
            <View style={[styles.alignItems]}>
                <Image
                    source={require('../images/no_house_list.png')}
                    style={styles.noAttention} />
                {
                    districtBlockSelect.size == 0 && communitySelect.size == 0 ?
                        <View style={[styles.alignItems]}>
                            <Text style={[styles.noAttentionText]}>关注的房源会出现在这里</Text>
                        </View>
                        : <Text style={[styles.noAttentionText]}>关注的板块和小区没有房源</Text>
                }

                {
                    districtBlockSelect.size == 0 && communitySelect.size == 0 ?
                        <TouchableWithoutFeedback
                            onPress={this.props.onAttentionBlockSet.bind(null, attentionList, actionType.onAttentionBlockSet)}>
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
    h0: {
        fontSize: 38
    },
    h1: {
        fontSize: 28
    },
    h2: {
        fontSize: 25
    },
    h3: {
        fontSize: 19
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
        borderBottomWidth: 1 / PixelRatio.get()
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
        borderTopWidth: 1 / PixelRatio.get()
    },
    attentionMsg: {
        height: 70,
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#f8f8f8',
        borderWidth: 1 / PixelRatio.get(),
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
        width: 100,
        height: 100,
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
    orange: {
        color: "#FD9673"
    },
    grey: {
        color: '#8d8c92'
    },
    giftBg: {
        position: 'absolute',
        top: 0,
        left: 100,
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: "#04C1AE"
    },
    giftDay: {
        marginTop: 28,
        marginBottom: 4
    },
    horn: {
        width: 34,
        height: 32.5
    }
});