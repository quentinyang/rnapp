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
                                setCurrentModal(homeConst.GIFT);
                            }}
                            >
                                <Image
                                    style={styles.closeIcon}
                                    source={require("../images/close.png")}
                                />
                            </TouchableHighlight>


                            <Text style={[styles.h5, styles.giftDay, styles.grey]}>发房新规则</Text>

                            <Text>1、发布一套房源审核通过后获得<Text
                                style={styles.orange}>{modalInfo.get('input_points')}</Text>积分</Text>
                            <Text>2、房源的电话每被查看1次获得<Text
                                style={styles.orange}>{modalInfo.get('looked_points')}</Text>积分</Text>
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

class CouponModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isVisible, modalInfo, actions, setCurrentModal} = this.props;
        let cardMsg = modalInfo.get('cost') == "0" ? "免费" : modalInfo.get('cost') + "积分";
        return (
            <Modal visible={isVisible} transparent={true}
                   onRequestClose={() => {}}>
                <View style={styles.bgWrap}>
                    <View>
                        <View style={[styles.contentContainer, {marginTop: 32}]}>
                            <TouchableHighlight
                                style={[styles.flex, styles.alignItems, styles.justifyContent, styles.closeBox]}
                                underlayColor="transparent"
                                onPress={() => {
                                setCurrentModal(homeConst.RULE);
                            }}
                            >
                                <Image
                                    style={styles.closeIcon}
                                    source={require("../images/close.png")}
                                />
                            </TouchableHighlight>

                            <Text style={[styles.h5, styles.giftDay]}>恭喜你获得1张</Text>

                            { modalInfo.get('type') == "1" ?
                                <Text style={styles.h5}><Text
                                    style={[styles.h0, styles.scoreNum]}>{cardMsg}</Text>看房卡</Text>
                                : <Text style={[styles.h0, styles.scoreNum]}>补签卡</Text>
                            }

                            <TouchableHighlight
                                underlayColor='#fff'
                                onPress={this._goCoupon.bind(this)}
                            >
                                <View style={styles.flex}>
                                    <Text style={[styles.giftBtn, styles.flex]}>查看详情></Text>
                                </View>
                            </TouchableHighlight>

                        </View>

                        <View style={[styles.alignItems, styles.justifyContent, styles.giftBg]}>
                            <Image style={styles.coupon} source={require("../images/coupon_white.png")}/>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    _goCoupon() {
        let {navigator, actions, log, setCurrentModal} = this.props;
        actions.currentModalChanged('');

        navigator.push({
            component: WelfareContainer,
            name: 'welfare',
            title: '福利卡',
            hideNavBar: false,
            bp: log.pageId,
            backLog: log.pageId,
            callbackFun: () => {
                navigator.pop();
                setCurrentModal(homeConst.RULE);
            }
        });
    }
}

class GiftModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isVisible, modalInfo, actions} = this.props;
        return (
            <Modal visible={isVisible} transparent={true} onRequestClose={() => {}}>
                <View style={styles.bgWrap}>
                    <View>
                        <View style={[styles.contentContainer, {marginTop: 32}]}>
                            <TouchableHighlight
                                style={[styles.flex, styles.alignItems, styles.justifyContent, styles.closeBox]}
                                underlayColor="transparent"
                                onPress={() => {
                                ActionUtil.setAction(actionType.BA_HOME_PAGE_DELETE); 
                                actions.currentModalChanged('');
                            }}
                            >
                                <Image
                                    style={styles.closeIcon}
                                    source={require("../images/close.png")}
                                />
                            </TouchableHighlight>

                            <Text style={[styles.h3, styles.giftDay]}>连续签到<Text
                                style={[styles.h3, styles.mediumFont]}>{modalInfo.get('sign_in_days')}</Text>天</Text>
                            <View style={[styles.row]}>
                                <Text style={styles.h5}>
                                    <Text style={[styles.h2, styles.addNum]}>+</Text>
                                    <Text style={[styles.h1, styles.scoreNum]}>{modalInfo.get('experience')}</Text>
                                    经验</Text>
                                { modalInfo.get('points') ?
                                    <Text style={styles.scoreAdd}>
                                        <Text style={[styles.h2, styles.addNum]}>+</Text>
                                        <Text style={[styles.h1, styles.scoreNum]}>{modalInfo.get('points')}</Text>
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

                        <View style={[styles.alignItems, styles.justifyContent, styles.giftBg]}>
                            <Image style={styles.gift} source={require("../images/gift.png")}/>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    _goScore() {
        let {navigator, actions, modalInfo, log} = this.props;

        actions.currentModalChanged('');
        navigator.push({
            component: SignInContainer,
            name: 'signIn',
            title: '签到送积分',
            hideNavBar: false,
            signInfo: modalInfo,
            bp: log.pageId,
            backLog: log.back
        });
        ActionUtil.setAction(actionType.BA_HOME_PAGE_FIND);
    }
}

class ScoreModal extends Component {
    constructor(props) {
        super(props);        
    }

    render() {
        let {isVisible, modalInfo, actions, setCurrentModal} = this.props;
        return (

            <Modal visible={isVisible} transparent={true}
                   onRequestClose={() => {}}>

                <View style={styles.bgWrap}>
                    <View style={styles.contentContainer}>
                        <TouchableHighlight
                            style={styles.closeBox}
                            underlayColor="transparent"
                            onPress={() => {
                                ActionUtil.setAction(actionType.BA_FIRSTOPEN_DELETE);                            
                                setCurrentModal(homeConst.COUPON);
                            }}
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
                            onPress={this._goScoreDetail.bind(this)}/>
                    </View>
                </View>
            </Modal>
        );
    }

    _goScoreDetail() {
        let {actions, navigator, setCurrentModal} = this.props;
        ActionUtil.setAction(actionType.BA_FIRSTOPEN_GETSOON);
        actions.currentModalChanged('');

        navigator.push({
            component: ScoreRule,
            name: 'scoreRule',
            title: '积分规则',
            hideNavBar: false,
            bp: actionType.BA_HOME_PAGE,
            backLog: actionType.BA_FIRSTOPEN_RETURN,
            score: this.props.modalInfo.get('score'),
            callbackFun: () => {
                navigator.pop();
                setCurrentModal(homeConst.COUPON);
            }
        });
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

        this._setGiftModalStatus();
    }

    _setGiftModalStatus() {
        let {actions} = this.props;
        let key = common.APP_OPEN_DATE + guid;

        AsyncStorageComponent.get(key)
            .then((value) => {
                let today = new Date().getDate().toString();
                if(!value) {
                    actions.pushShowModal(homeConst.RULE);
                    actions.fetchRuleModalStatus();
                }

                if (value && value == today) { //不为空且 == today, 不显示

                } else { //为空 或 != today, 则显示并更新
                    actions.pushShowModal(homeConst.GIFT);
                    actions.fetchGiftInfo();
                    AsyncStorageComponent.save(key, today);
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

            } else if(modals.includes(homeConst.GIFT)) {
                cur = homeConst.GIFT;

            }
            break;
        case homeConst.COUPON:
            if(modals.includes(homeConst.COUPON)) {
                cur = homeConst.COUPON;

            } else if(modals.includes(homeConst.RULE)) {
                cur = homeConst.RULE;

            } else if(modals.includes(homeConst.GIFT)) {
                cur = homeConst.GIFT;
            }
            break;
        case homeConst.RULE:
            if(modals.includes(homeConst.RULE)) {
                cur = homeConst.RULE;

            } else if(modals.includes(homeConst.GIFT)) {
                cur = homeConst.GIFT;
            }
            break;
        case homeConst.GIFT: 
            if(modals.includes(homeConst.GIFT)) {
                cur = homeConst.GIFT;
            }
            break;
        default:        
            break;
        }

        if(cur == homeConst.COUPON) {
            ActionUtil.setActionWithExtend(actionType.BA_HOME_PAGEWELFARECARD_ONVIEW, {"points": baseInfo.get('couponModal').get('cost')});
        } else if(cur == homeConst.RULE) {
            ActionUtil.setAction(actionType.BA_HOME_SENDRULE_ONVIEW);
        } else if(cur == homeConst.GIFT) {
            baseInfo.get('giftModal').get('points') 
                ? ActionUtil.setActionWithExtend(actionType.BA_HOME_PAGE_CREDIT_ONVIEW, {"points": baseInfo.get('giftModal').get('points')})
                : ActionUtil.setAction(actionType.BA_HOME_PAGE_EXPERIENCE_ONVIEW);
        }

        actions.currentModalChanged(cur);
    }

    render() {
        let {houseData, baseInfo, actions, navigator} = this.props;
        let houseList = houseData.get('properties');
let welfare = Immutable.fromJS([
    {
            "id": "1", //用户福利卡id
            "name": "看房卡", //福利卡名称
            "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
            "type": "1", //1看房卡, 2补签卡
            "cost": "1", //花费积分，0积分为免费。补签卡则另外说明
            "status": "1", //使用状态, 0不可用, 1可用, 2已用，3过期
            "begin_at": "", //开始时间，空为获取时就开始
            "end_at": "2016-07-16", //过期时间
            "created_at": "2016-06-01", //获取时间
            "used_at": "2016-06-05" //使用时间，未使用时为空
        },
        {
            "id": "2", //用户福利卡id
            "name": "看房卡", //福利卡名称
            "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
            "type": "1", //1看房卡, 2补签卡
            "cost": "1", //花费积分，0积分为免费。补签卡则另外说明
            "status": "1", //使用状态, 0不可用, 1可用, 2已用，3过期
            "begin_at": "", //开始时间，空为获取时就开始
            "end_at": "2016-07-16", //过期时间
            "created_at": "2016-06-01", //获取时间
            "used_at": "2016-06-05" //使用时间，未使用时为空
        },
        {
            "id": "3", //用户福利卡id
            "name": "看房卡", //福利卡名称
            "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
            "type": "1", //1看房卡, 2补签卡
            "cost": "1", //花费积分，0积分为免费。补签卡则另外说明
            "status": "1", //使用状态, 0不可用, 1可用, 2已用，3过期
            "begin_at": "", //开始时间，空为获取时就开始
            "end_at": "2016-07-16", //过期时间
            "created_at": "2016-06-01", //获取时间
            "used_at": "2016-06-05" //使用时间，未使用时为空
        },
        {
            "id": "3", //用户福利卡id
            "name": "看房卡", //福利卡名称
            "brief": "获任意1套房源的房东电话花1积分", //福利卡描述
            "type": "1", //1看房卡, 2补签卡
            "cost": "1", //花费积分，0积分为免费。补签卡则另外说明
            "status": "1", //使用状态, 0不可用, 1可用, 2已用，3过期
            "begin_at": "", //开始时间，空为获取时就开始
            "end_at": "2016-07-16", //过期时间
            "created_at": "2016-06-01", //获取时间
            "used_at": "2016-06-05" //使用时间，未使用时为空
        }
        ]);

/*<WelfareModal
                    title="注册成功"
                    subTitle="获得2张看房卡"
                    welfareData={welfare}
                />*/
        return (
            <View style={[styles.flex, styles.pageBgColor]}>
                
                <ScoreModal
                    isVisible={baseInfo.get('currentModal') == homeConst.SCORE}
                    modalInfo={baseInfo.get('scoreModal')}
                    actions={actions}
                    navigator={navigator}
                    log={{pageId: this.pageId, back: actionType.BA_MINE_CREDIT_BACK}}
                    setCurrentModal={this._setCurrentModal.bind(this)}
                />
                <CouponModal
                    isVisible={baseInfo.get('currentModal') == homeConst.COUPON}
                    modalInfo={baseInfo.get('couponModal')}
                    actions={actions}
                    navigator={navigator}
                    log={{pageId: this.pageId, back: actionType.BA_MINE_WELFARE_BACK}}
                    setCurrentModal={this._setCurrentModal.bind(this)}
                />
                <InputRuleModal 
                    isVisible={baseInfo.get('currentModal') == homeConst.RULE} 
                    modalInfo={baseInfo.get('ruleModal')}
                    actions={actions}
                    setCurrentModal={this._setCurrentModal.bind(this)}
                />

                <GiftModal
                    isVisible={baseInfo.get('currentModal') == homeConst.GIFT}
                    modalInfo={baseInfo.get('giftModal')}
                    actions={actions}
                    navigator={navigator}
                    log={{pageId: this.pageId, back: actionType.BA_MINE_CREDIT_BACK}}
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
            actions.fetchCouponModalStatus();
            actions.fetchRuleModalStatus();
            actions.fetchCurrentStatus();
        });
        AppState.addEventListener('change', this._dealGiftModal.bind(this));
    }

    _dealGiftModal(currentAppState) {
        if (currentAppState == 'active') {
            this._setGiftModalStatus();
        }
    }

    componentWillUnmount() {
        this.props.actions.clearHomePage();
        AppState.removeEventListener('change', this._dealGiftModal);
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
            actions.fetchHouseNewCount();
            actions.fetchCurrentStatus();
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
        let {houseData, attentionList, navigator, baseInfo} = this.props;
        let pager = houseData.get('pager');
        let footerView = null;

        if (Number(pager.get('current_page')) == Number(pager.get('last_page')) && Number(pager.get('total')) != 0) {
            footerView = <View style={styles.listFooter}>
                <Text style={styles.noData}>已经没有数据了！</Text>
            </View>
        } else if (Number(pager.get('current_page')) != Number(pager.get('last_page')) && Number(pager.get('total')) != 0) {
            footerView = <View style={styles.listFooter}>
                <ActivityIndicator color={'#ccc'} styleAttr="Small"/>
            </View>
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
                    style={styles.noAttention}/>
                {
                    districtBlockSelect.size == 0 && communitySelect.size == 0 ?
                        (baseInfo.get('current') == 0 ?
                            <View style={[styles.alignItems]}>
                                <Text style={[styles.noAttentionText]}>设置关注的区域得<Text
                                    style={[styles.orange, styles.mediumFont]}>8</Text>积分</Text>
                                <Text style={[styles.noAttentionText]}>最多免费看<Text
                                    style={[styles.orange, styles.mediumFont]}>4</Text>套房源</Text>
                            </View>
                            : (baseInfo.get('current') == 1 ?
                            <View style={[styles.alignItems]}>
                                <Text style={[styles.noAttentionText]}>关注的房源会出现在这里</Text>
                            </View> :
                            null)) :
                        <Text style={[styles.noAttentionText]}>关注的板块和小区没有房源</Text>
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
    grey: {
        color: '#8d8c92'
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
        top: 0,
        left: 100,
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
    },
    coupon: {
        width: 37.5,
        height: 25
    },
    horn: {
        width: 34,
        height: 32.5
    }
});