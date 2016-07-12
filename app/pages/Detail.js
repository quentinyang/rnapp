'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, TouchableWithoutFeedback, Alert, Modal, Button, Linking, Platform } from 'nuke'
import { NativeAppEventEmitter, DeviceEventEmitter } from 'react-native';
import HouseItem from '../components/HouseItem';
import HouseListContainer from '../containers/HouseListContainer';
import DetailContainer from '../containers/DetailContainer';
import PublishFirstStepContainer from '../containers/PublishFirstStepContainer'
import InputHouseRule from '../pages/InputHouseRule';
import RechargeContainer from '../containers/RechargeContainer'
import BackScoreContainer from '../containers/BackScoreContainer'
import AboutUserContainer from '../containers/AboutUserContainer'
let ActionUtil = require('../utils/ActionLog');
import {callUp} from '../utils/CommonUtils';
import * as actionType from '../constants/ActionLog';
import TitleBar from '../components/TitleBar';
import WelfareCard from '../components/WelfareCard';
import deviceInfo from '../utils/DeviceInfo';
var AudioPlayer = require('react-native').NativeModules.RNAudioPlayer;
var {RecyclerViewBackedScrollView} = require('react-native');

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.isGetCall = false;
        this.isVoiceGetCall = false;
        this.couponObj;
        this.pageId = actionType.BA_DETAIL;
        ActionUtil.setActionWithExtend(actionType.BA_DETAIL_ONVIEW, {
            "vpid": this.props.route.item.get('property_id'),
            "bp": this.props.route.bp
        });
    }

    render() {
        let {baseInfo, sameCommunityList, callInfo, actions, navigator, route} = this.props;
        let houseList = sameCommunityList.get('properties');
        let info = baseInfo.get("baseInfo");
        let couponArr = baseInfo.get('couponArr');
        let status = Number(info.get('phone_lock_status'));
        let phone = callInfo.get('sellerPhone').get('phone');

        let phoneStr = '';
        if (status || phone) {
            phoneStr = "联系房东(" + (status ? info.get('seller_phone') : phone ) + ")";
        } else {
            phoneStr = "获取房东电话";
        }

        let cost = this.couponObj ? this.couponObj.get('cost') : info.get('unlock_phone_cost');

        return (
            <View style={styles.flex}>
                <View style={[styles.contactWrap, styles.row, styles.center]}>
                    {
                        (status || !status && phone) ?
                            null :
                            <Image
                                style={styles.moneyIcon}
                                source={require("../images/money.png")}
                            />
                    }
                    {
                        (status || !status && phone) ?
                            null :
                            <Text
                                style={[styles.greenColor, styles.baseSize]}>{route.item.get('unlock_phone_cost') || 0}积分</Text>
                    }

                    <TouchableHighlight
                        style={[styles.flex, styles.contactButton]}
                        underlayColor="#04c1ae"
                        onPress={this._clickPhoneBtn.bind(this, status, info.get('seller_phone'), phone)}
                    >
                        <View style={[styles.row, styles.justifyContent, styles.center]}>
                            <Image
                                style={styles.phoneIcon}
                                source={require("../images/phone.png")}
                            />
                            <Text style={styles.contactText}>
                                {phoneStr}
                            </Text>
                        </View>
                    </TouchableHighlight>
                </View>

                { couponArr.size ?
                    <CouponModal
                        isVisible={callInfo.get('couponVisible')}
                        useCoupon={this._useCoupon.bind(this)}
                        couponArr={couponArr}
                        actions={actions}
                    />
                    : null
                }


                {
                    info.get('record_url') && info.get('record_url').size ?
                        <VoiceModal
                            isVisible={callInfo.get('voiceVisible')}
                            voiceInfo={info.get('record_url')}
                            costScore={cost== "0" ? "免费" : cost + "积分"}
                            getSellerPhone={this._getSellerPhone.bind(this)}
                            actions={actions}
                            navigator={navigator}
                            propertyId={route.item.get('property_id')}
                        />
                    : null
                }

                <PhoneModal
                    isVisible={callInfo.get('sellerPhoneVisible')}
                    phoneInfo={callInfo.get('sellerPhone')}
                    actions={actions}
                />

                <ErrorTipModal
                    callInfo={callInfo}
                    actions={actions}
                    navigator={navigator}
                />

                <CostScoreModal
                    propertyId={route.item.get('property_id')}
                    callInfo={callInfo}
                    actions={actions}
                    navigator={navigator}
                    score={cost}
                />
                <ListView
                    dataSource={ds.cloneWithRows(houseList.toArray())}
                    renderRow={this._renderRow}
                    initialListSize={5}
                    pageSize={5}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
                    style={styles.listView}
                    enableEmptySections={true}
                    renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                />
            </View>
        );
    }

    componentDidMount() {
        let self = this;
        let {actions, route, baseInfo} = this.props;
        let propertyId = route.item.get('property_id');

        InteractionManager.runAfterInteractions(() => {
            actions.fetchBaseInfo({
                property_id: propertyId
            });
            actions.fetchSimilarHouseList({
                property_id: propertyId
            });
            actions.fetchContactLog({
                property_id: propertyId,
                page: 1
            });
            actions.fetchUserInfo({
                property_id: propertyId
            });
            actions.fetchCoupon({
                status: 1,
                type: 1
            });
        });

        if (Platform.OS === 'ios') {
            this.callSubscription = NativeAppEventEmitter.addListener('callIdle', () => {
                self._showFeedbackModal();
            });
        } else {
            DeviceEventEmitter.addListener('callIdle', () => {
                self._showFeedbackModal();
            });
        }
    }

    _showFeedbackModal() {
        let {baseInfo, callInfo, actions} = this.props;
        let info = baseInfo.get("baseInfo");
        let status = Number(info.get('phone_lock_status'));

        if (status || !status && callInfo.get('sellerPhone').get('phone')) {
        } else {
            ActionUtil.setAction(actionType.BA_DETAIL_SPEND);
            actions.setFeedbackVisible(true);
            this.isGetCall = false;
        }
    }

    componentWillUnmount() {
        let {route, actions, actionsNavigation} = this.props;
        actions.clearHouseDetailPage();
        if (route.from == 'houseDetail') {
            actionsNavigation.detailPopRoute();
        } else if (route.from == 'houseList') {
            actionsNavigation.listPopRoute();
        } else if(route.from == 'aboutUser') {
            actionsNavigation.aboutUserPopRoute();
        }

        if (Platform.OS === 'ios') {
            this.callSubscription.remove();
        } else {
            DeviceEventEmitter.removeAllListeners('callIdle');
        }
    }

    _clickPhoneBtn(status, phone, hasPhone) {
        if (this.isGetCall) {
            return;
        }

        let {actions, actionsNavigation, actionsHome, route, baseInfo} = this.props;
        let propertyId = route.item.get("property_id");

        ActionUtil.setAction(actionType.BA_DETAIL_CLICK_CALL);
        if (status || hasPhone) { //1: 已解锁 或 已反馈在卖
            callUp(phone);
        } else {   //0: 未解锁
            let voice = baseInfo.get('baseInfo').get('record_url');

            if (baseInfo.get('couponArr').size) {  //是否有看房卡
                ActionUtil.setAction(actionType.BA_DETAIL_WELFARECARD_ONVIEW);
                actions.setCouponVisible(true);
            } else if (voice && voice.size) {     //是否有录音
                ActionUtil.setAction(actionType.BA_DETAIL_TAPE_ONVIEW);
                actions.setVoiceVisible(true);
            } else {                             //获取短号拨打
                this.isGetCall = true;
                actions.callSeller({
                    property_id: propertyId,
                    card_id: this.couponObj ? this.couponObj.get('id') : null
                });
            }
        }
    }

    _useCoupon(coupon) {
        let {baseInfo, route, actions} = this.props;
        let propertyId = route.item.get("property_id");
        let voice = baseInfo.get('baseInfo').get('record_url');

        this.couponObj = coupon;
        actions.setCouponVisible(false);
        if (voice && voice.size) {     //是否有录音
            ActionUtil.setAction(actionType.BA_DETAIL_TAPE_ONVIEW);
            actions.setVoiceVisible(true);
        } else {                             //获取短号拨打
            actions.callSeller({
                property_id: propertyId,
                card_id: this.couponObj ? this.couponObj.get('id') : null
            });
        }
    }

    _getSellerPhone() {
        if (this.isVoiceGetCall) {
            return;
        }
        let {actions, route} = this.props;
        ActionUtil.setAction(actionType.BA_DETAIL_TAPE_SURE);
        actions.setVoiceVisible(false);
        actions.fetchSellerPhone({
            property_id: route.item.get('property_id'),
            card_id: this.couponObj ? this.couponObj.get('id') : null
        });
        this.isVoiceGetCall = true;

        setTimeout(() => {
            this.isVoiceGetCall = false;
        }, 10000);
    }

    _renderRow = (rowData:any) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        );
    };

    _renderHeader = () => {
        let {baseInfo, sameCommunityList, route, actions, navigator, actionsNavigation} = this.props;
        let houseList = sameCommunityList.get('properties');
        let userInfo = baseInfo.get('userInfo');

        return (
            <View>

                <BaseInfo baseInfo={baseInfo.get('baseInfo')} route={route}/>
                { userInfo.get('input_user_id') ?
                    <UserInfo userInfo={userInfo} navigator={navigator} actions={actions} actionsNavigation={actionsNavigation} />
                    : null
                }

                {
                    baseInfo.get('contact').get('total') > 0 ?
                        <ContactList
                            properyId={baseInfo.get('baseInfo').get('property_id')}
                            actions={actions}
                            curLogs={baseInfo.get('curLogs')}
                            contact={baseInfo.get('contact')}
                        /> : null
                }

                {
                    houseList.size > 0 ? <View style={styles.gap}></View> : null
                }
                {
                    houseList.size > 0 ? <TitleBar title="周边房源"/> : null
                }
            </View>
        )
    };

    _renderFooter = () => {
        let {sameCommunityList} = this.props;
        return (
            sameCommunityList.get('total') > 5 ?
                <View style={[styles.padding]}>
                    <TouchableHighlight
                        style={styles.moreButton}
                        underlayColor="#fff"
                        onPress={this._handleMoreHouseList}
                    >
                        <View><Text style={styles.moreText}>
                            查看更多
                        </Text></View>
                    </TouchableHighlight>
                </View>
                :
                null
        )
    };

    _onItemPress = (item) => {

        ActionUtil.setActionWithExtend(actionType.BA_DETAIL_SAME_CLICK, {"vpid": item.get('property_id')});

        let {navigator, actionsNavigation, actions, actionsHouseList, actionsHome} = this.props;

        actionsNavigation.detailPushRoute();
        navigator.push({
            component: DetailContainer,
            name: 'houseDetail',
            from: 'houseDetail',
            title: '房源详情',
            hideNavBar: false,
            backLog: actionType.BA_DETAIL_RETURN,
            bp: this.pageId,
            item
        });
        if (!item.get('is_click')) {
            actionsNavigation.setLookStatus({
                property_id: item.get('property_id'),
                is_click: "1"
            });
            actionsHome.setLookStatus({
                property_id: item.get('property_id')
            });
        }
        actions.clearHouseDetailPage();
    };

    _handleMoreHouseList = () => {
        ActionUtil.setAction(actionType.BA_DETAIL_COMMUNITYHOUSE);
        let {route, navigator, actionsHouseList, actionsNavigation} = this.props,
            {item} = route;

        actionsHouseList.houseListPageCleared();
        actionsHouseList.filterCommunityNameChanged(item.get('community_id'), item.get('community_name'));

        actionsNavigation.detailPushRoute();
        navigator.push({
            component: HouseListContainer,
            name: 'houseList',
            from: 'houseDetail',
            title: '房源列表',
            hideNavBar: true,
            communityName: item.get('community_name'),
            communityId: item.get('community_id'),
            bp: this.pageId
        });
    };
}

class PhoneModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isVisible, phoneInfo, actions} = this.props;
        return (
            <Modal visible={isVisible} transparent={true}
                   onRequestClose={actions.setSellerPhoneVisible}>
                <View style={[styles.flex, styles.center, styles.justifyContent, styles.bgWrap]}>
                    <View style={[styles.center, styles.justifyContent, styles.contentContainer]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.center, styles.justifyContent, styles.closeBox]}
                            underlayColor="transparent"
                            onPress={() => {ActionUtil.setAction(actionType.BA_DETAIL_CASHRECHACLOSE);actions.setSellerPhoneVisible(false);}}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={styles.saleTel}>房东电话：{phoneInfo.get('phone')}</Text>
                        <Text style={styles.expMsg}>同时您获得了{phoneInfo.get('exp')}经验</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}

class VoiceModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: -1
        };
    }

    render() {
        let {isVisible, voiceInfo, costScore, getSellerPhone, actions, navigator, propertyId} = this.props;
        let voiceList = voiceInfo.map((item, index) => {
            let time = item.get('record_time'), m = parseInt(time / 60), s = time % 60;
            let voiceIcon = this.state.playing == index ? require('../images/voice_anim.gif') : require('../images/voice.png');
            return (
                <View key={index} style={[styles.row, styles.justifyContent, styles.center, {marginBottom: 28}]}>
                    <Text>通话{index + 1}</Text>
                    <TouchableHighlight
                        style={styles.flex}
                        underlayColor="#F8F8F8"
                        onPress={() => {
                            if(index == 0){
                            ActionUtil.setActionWithExtend(actionType.BA_DETAIL_TAPE_ONE, {
                                "vpid": propertyId,
                                "time": time.toString()

                            });
                            }else if(index == 1){
                            ActionUtil.setActionWithExtend(actionType.BA_DETAIL_TAPE_TWO, {
                                "vpid": propertyId,
                                "time": time.toString()
                            });
                            }

                            this.setState({
                                playing: index
                            });
                            AudioPlayer.stop();
                            AudioPlayer.play(item.get('record_url'));
                        }}
                    >
                        <View style={[styles.center, styles.justifyContent, styles.voiceBox]}>
                            <Image style={styles.voice} source={voiceIcon}/>
                            <Image style={styles.boxArrow} source={require('../images/arrow_left.png')}/>
                            <Text style={styles.greenColor}>{this.state.playing == index ? '正在播放' : '点击播放'}</Text>
                        </View>
                    </TouchableHighlight>
                    <Text style={[styles.grayColor, styles.itemSize]}>{m}:{s}</Text>
                </View>
            );
        });
        return (
            <Modal visible={isVisible && deviceInfo.version >= "1.4.0"} transparent={true}
                   onRequestClose={actions.setVoiceVisible}>
                <View style={[styles.flex, styles.bgWrap]}>
                    <View style={styles.flex}></View>
                    <View style={[styles.flex, styles.justifyBetween, styles.couponWrap, styles.voiceWrap]}>
                        <TouchableHighlight
                            style={[styles.closeBox, styles.center, styles.justifyContent]}
                            onPress={()=>{
                            ActionUtil.setAction(actionType.BA_DETAIL_TAPE_DELETE);
                                this.setState({
                                    playing: -1
                                });
                                AudioPlayer.stop();
                                actions.setVoiceVisible(false);
                            }}
                            underlayColor="transparent"
                        >
                            <Image style={styles.closeIcon} source={require('../images/close.png')}/>
                        </TouchableHighlight>
                        <View style={[styles.justifyContent, styles.center]}>
                            <Text style={[styles.subName]}>今日已有2通电话确认房子在卖</Text>
                            <Text style={styles.subName}>请听通话录音</Text>
                        </View>

                        <View>{voiceList}</View>

                        <TouchableHighlight
                            style={[styles.contactButton]}
                            underlayColor="#04C1AE"
                            onPress={() => {
                                this.setState({
                                    playing: -1
                                });
                                AudioPlayer.stop();
                                getSellerPhone();
                            }}
                        >
                            <View style={[styles.justifyContent, styles.center]}>
                                <Text style={styles.contactText}>
                                    {costScore} 获取房东电话
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }

    componentDidMount() {
        if(Platform.OS == "ios") {
            this.audioListener = NativeAppEventEmitter.addListener('mediaCompletioned', () => {
                this.setState({
                    playing: -1
                });
            });
        } else {
            DeviceEventEmitter.addListener('mediaCompletioned', () => {
                this.setState({
                    playing: -1
                });
            });
        }
    }

    componentWillUnmount() {
        if(Platform.OS == 'ios') {
            this.audioListener.remove();
        } else {
            DeviceEventEmitter.removeAllListeners('mediaCompletioned');
        }
    }
}

class CouponModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            curCoupon: this.props.couponArr.get(0)
        };
    }

    render() {
        let {couponArr, useCoupon, isVisible, actions} = this.props;
        return (
            <Modal visible={isVisible} transparent={true} onRequestClose={actions.setCouponVisible}>
                <View style={[styles.flex, styles.bgWrap]}>
                    <View style={styles.flex}></View>
                    <View style={[styles.flex, styles.couponWrap]}>
                        <View style={styles.couponHeader}>
                            <TouchableWithoutFeedback onPress={()=>{
                            ActionUtil.setAction(actionType.BA_DETAIL_WELFARECARD_DELETE);
                            actions.setCouponVisible(false)}}>
                                <View style={styles.touchBox}>
                                    <Image style={styles.closeIcon} source={require('../images/close.png')}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.center}>
                                <Text style={styles.subName}>是否要使用看房卡</Text>
                                <Text style={[styles.itemSize, styles.grayColor]}>未成功卡可退回</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>{
                            ActionUtil.setActionWithExtend(actionType.BA_DETAIL_WELFARECARD_SURE, {
                                "card_type": this.state.curCoupon.get('type')
                            });
                            useCoupon(this.state.curCoupon)}}>
                                <View style={styles.touchBox}>
                                    <Text style={[styles.greenColor, styles.couponSure]}>确定</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <ListView
                            contentContainerStyle={styles.touchBox}
                            dataSource={ds.cloneWithRows(couponArr.toArray())}
                            renderRow={this._renderRow.bind(this)}
                            renderFooter={this._renderFooter.bind(this)}
                            enableEmptySections={true}
                            showsVerticalScrollIndicator={false}
                            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                        />

                    </View>
                </View>
            </Modal>
        );
    }

    _renderFooter() {
        return (
            <TouchableWithoutFeedback onPress={()=> {
                ActionUtil.setAction(actionType.BA_DETAIL_WELFARECARD_NOUSE);
                this.props.useCoupon()}}>
                <View style={[styles.center, styles.justifyContent, styles.couponFooter]}>
                    <Text style={[styles.greenColor, styles.more]}>不使用看房卡</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _renderRow(rowData) {
        let isCur = this.state.curCoupon.get('id') == rowData.get("id");
        return (
            <View style={[styles.row, styles.center, styles.couponItem]}>
                <TouchableWithoutFeedback onPress={() => {
                    if(!isCur) {
                        this.setState({
                            curCoupon: rowData
                        });
                    }
                }}>
                    <View style={[styles.markBg, isCur ? styles.greenBg : styles.greyBg, styles.center, styles.justifyContent]}>
                        {isCur ? <Image style={styles.mark} source={require('../images/mark_white.png')} /> : null}
                    </View>
                </TouchableWithoutFeedback>
                <WelfareCard item={rowData}/>
            </View>
        );
    }
}

class UserInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {userInfo, navigator, actions, actionsNavigation} = this.props;
        let mobile = userInfo.get('mobile'),
            showMobile = mobile ? mobile.slice(0, 2) + '********' + mobile.slice(-1) : '';
        return (
            <View>
                <View style={styles.gap}></View>
                <TitleBar title="发房用户" />

                <TouchableWithoutFeedback
                    onPress={() => {
                        actionsNavigation.detailPushRoute();
                        ActionUtil.setAction(actionType.BA_DETAIL_USER);
                        navigator.push({
                            component: AboutUserContainer,
                            title: '用户' + showMobile,
                            from: 'houseDetail',
                            name: 'aboutUser',
                            backLog: actionType.BA_USER_RETURN,
                            bp: this.pageId,
                            userInfo
                        });
                        actions.clearHouseDetailPage();
                    }
                }>
                    <View>
                        <View style={[styles.row, styles.center]}>
                            <View style={styles.avatarBox}>
                                <Image
                                    style={styles.avatarImage}
                                    source={require('../images/avatar.png')}
                                />
                                <View style={[styles.levelBg, styles.center, styles.justifyContent]}>
                                    <Text style={[styles.levelText]}>V{userInfo.get('level')}</Text>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.subName}>{showMobile}</Text>
                            </View>
                        </View>

                        <View style={[styles.info, styles.row]}>
                            <View style={[styles.flex, styles.center, styles.justifyContent]}>
                                <Text style={styles.userVal}>{userInfo.get('login_days')}</Text>
                                <Text style={[styles.grayColor, styles.more]}>累计登录</Text>
                            </View>
                            <View style={styles.vline}></View>
                            <View style={[styles.flex, styles.center, styles.justifyContent]}>
                                <Text style={styles.userVal}>{Number(userInfo.get('earn_money'))}</Text>
                                <Text style={[styles.grayColor, styles.more]}>已赚积分</Text>
                            </View>
                            <View style={styles.vline}></View>
                            <View style={[styles.flex, styles.center, styles.justifyContent]}>
                                <Text style={styles.userVal}>{userInfo.get('input_house_count')}</Text>
                                <Text style={[styles.grayColor, styles.more]}>发房</Text>
                            </View>
                            <View style={styles.vline}></View>
                            <View style={[styles.flex, styles.center, styles.justifyContent]}>
                                <Text style={styles.userVal}>{userInfo.get('look_house_count')}</Text>
                                <Text style={[styles.grayColor, styles.more]}>看房</Text>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

class ErrorTipModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { callInfo, actions } = this.props;
        return (
            <Modal visible={callInfo.get('errorTipVisible')} transparent={true}
                   onModalVisibilityChanged={actions.setErrorTipVisible}>
                <View style={[styles.flex, styles.center, styles.justifyContent, styles.bgWrap]}>
                    <View style={[styles.center, styles.justifyContent, styles.contentContainer]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.center, styles.justifyContent, styles.closeBox]}
                            underlayColor="transparent"
                            onPress={() => {ActionUtil.setAction(actionType.BA_DETAIL_CASHRECHACLOSE);actions.setErrorTipVisible(false)}}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={[styles.msgTip, styles.baseColor]}>{callInfo.get('callError').get('msg')}</Text>

                        <TouchableHighlight
                            style={[styles.btn, styles.borderBtn]}
                            underlayColor="#fff"
                            onPress={this._goPage.bind(this, PublishFirstStepContainer, '房源基本信息', actionType.BA_DETAIL_CASH)}
                        >
                            <View><Text style={{color: "#04C1AE", textAlign: "center"}}>去发房</Text></View>
                        </TouchableHighlight>

                        <TouchableHighlight
                            style={[styles.btn, styles.borderBtn, styles.margin]}
                            underlayColor="#fff"
                            onPress={this._goPage.bind(this, RechargeContainer, '充值', actionType.BA_DETAIL_RECHANGE)}
                        >
                            <View><Text style={{color: "#04C1AE", textAlign: "center"}}>去充值</Text></View>
                        </TouchableHighlight>

                    </View>
                </View>
            </Modal>
        );
    }

    _goPage(component, title, actionLog) {
        ActionUtil.setAction(actionLog);

        let {navigator, actions} = this.props;
        actions.setErrorTipVisible(false);
        if (title == '房源基本信息') {
            navigator.push({
                component: component,
                name: 'publishInventory',
                title: title,
                right: {
                    msg: "发房规则",
                    route: {
                        component: InputHouseRule,
                        name: 'InputHouseRule',
                        title: '发房规则',
                        hideNavBar: false,
                        backLog: actionType.BA_SENDRULE_RETURN
                    }
                },
                hideNavBar: false,
                backLog: actionType.BA_SENDTWO_THREE_RETURN,
                bp: this.pageId
            });
        } else {
            navigator.push({
                component: component,
                name: '',
                title: title,
                hideNavBar: false,
                bp: this.pageId
            });
        }

    }
}

class CostScoreModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {callInfo, actions, score} = this.props;
        return (
            <Modal visible={callInfo.get('feedbackVisible')} transparent={true}
                   onModalVisibilityChanged={actions.setErrorTipVisible}>
                <View style={[styles.flex, styles.center, styles.justifyContent, styles.bgWrap]}>
                    <View style={[styles.center, styles.justifyContent, styles.contentContainer]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.center, styles.justifyContent, styles.closeBox]}
                            underlayColor="transparent"
                            onPress={this._handlerFeedback.bind(this, actionType.BA_DETAIL_SPENDCANCEL)}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={[styles.msgTip, styles.baseColor]}>本次通话花费了您{score}积分</Text>

                        <TouchableHighlight
                            style={[styles.btn, styles.sureBtn]}
                            underlayColor="#04c1ae"
                            onPress={this._handlerFeedback.bind(this, actionType.BA_DETAIL_SPENDENSURE)}
                        >
                            <View>
                                <Text style={[styles.baseSize, {color: "#fff", textAlign: "center"}]}>确认</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableWithoutFeedback
                            onPress={this._goBackScore.bind(this)}
                        >
                            <View><Text style={styles.backScore}>退还积分</Text></View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>
        );
    }

    _handlerFeedback(actionLog) {
        let {callInfo, actions, propertyId} = this.props;

        ActionUtil.setActionWithExtend(actionLog, {"vpid": propertyId});
        actions.setFeedbackVisible(false);
        actions.callFeedback({
            wash_id: callInfo.get('washId'),
            status: 1 //在卖
        }, propertyId);
    }

    _goBackScore() {
        let {callInfo, navigator, propertyId, actions} = this.props;
        ActionUtil.setActionWithExtend(actionType.BA_DETAIL_SPENDRECALL, {"vpid": propertyId});
        actions.setFeedbackVisible(false);
        navigator.push({
            component: BackScoreContainer,
            name: 'backScore',
            title: '找回积分',
            hideHeader: false,
            hideNavBar: false,
            bp: this.pageId,
            washId: callInfo.get('washId'),
            propertyId: propertyId
        });
    }
}

class BaseInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {baseInfo, route} = this.props;
        let houseInfo = route.item;

        return (
            <View>
                <View style={[styles.center, styles.justifyContent, styles.nameBox]}>
                    <Text style={[styles.name, styles.baseColor]}>{houseInfo.get('community_name') || ''}</Text>
                    <View style={[styles.row, styles.justifyContent]}>
                        <Text
                            style={[styles.subName, styles.flex, styles.baseColor]}>{houseInfo.get('building_num') || ''}{houseInfo.get('building_num') && houseInfo.get('building_unit') || ''}{houseInfo.get('door_num') || ''}{houseInfo.get('door_num') && '室'}</Text>
                        {
                            houseInfo.get('is_new') ? <Text style={[styles.tagNew, styles.flex]}>新</Text> : null
                        }
                    </View>
                </View>

                <View style={[styles.info, styles.row]}>
                    <View style={[styles.flex, styles.center, styles.justifyContent]}>
                        <Text style={[styles.attr, styles.baseColor]}>总价</Text>
                        <Text style={[styles.attrVal, styles.fontMedium]}>{houseInfo.get('price') || ''}万</Text>
                    </View>
                    <View style={styles.vline}></View>
                    <View style={[styles.flex, styles.center, styles.justifyContent]}>
                        <Text style={[styles.attr, styles.baseColor]}>户型</Text>
                        <Text
                            style={[styles.attrVal, styles.fontMedium]}>{houseInfo.get('bedrooms') || ''}室{houseInfo.get('living_rooms') || ''}厅{houseInfo.get('bathrooms') || ''}卫</Text>
                    </View>
                    <View style={styles.vline}></View>
                    <View style={[styles.flex, styles.center, styles.justifyContent]}>
                        <Text style={[styles.attr, styles.baseColor]}>面积</Text>
                        <Text style={[styles.attrVal, styles.fontMedium]}>{houseInfo.get('area') || ''}平米</Text>
                    </View>
                </View>
                <View style={[styles.justifyContent, styles.address]}>
                    <Text style={[styles.baseSize, styles.baseColor]}
                          numberOfLines={1}>地址: {houseInfo.get('district_name') || baseInfo.get('district_name') || ''}{houseInfo.get('block_name') || baseInfo.get('block_name') || ''} {houseInfo.get('community_address') || baseInfo.get('community_address') || ''}</Text>
                </View>
            </View>
        );
    }
}

class ContactList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {curLogs, contact, actions} = this.props;

        let contactList = curLogs.map((item, index) => {
            return (
                <View key={index} style={[styles.row, styles.contactItem, styles.center]}>
                    <Text style={[styles.grayColor, styles.date]}>{item.get('time')}</Text><Text
                    style={[styles.baseColor, styles.itemSize]}>{item.get('phone')}联系了房东</Text>
                </View>
            );
        });
        return (
            <View>
                <View style={styles.gap}></View>
                <TitleBar title={"联系房东记录 (" + contact.get('total') + "次)"} />
                <View style={[styles.contactBox]}>
                    {contactList}
                </View>

                {curLogs.size == contact.get('total') ? null :
                    <TouchableWithoutFeedback
                        onPress={() => {ActionUtil.setAction(actionType.BA_DETAIL_MORECONTACT);actions.changeCurrentContactLog()}}
                    >
                        <View style={[styles.row, styles.justifyContent, styles.center, styles.moreBox]}>
                            <Image
                                style={styles.moreIcon}
                                source={require('../images/dropDown.png')}/>
                            <Text style={[styles.grayColor, styles.more]}>更多</Text>
                        </View>
                    </TouchableWithoutFeedback>
                }
            </View>
        );
    }

    componentDidUpdate() {
        let {propertyId, contact, actions} = this.props;
        let pager = contact.get('pager');
        if (contact.get('logs').size < 5 && pager.get('current_page') < pager.get('last_page')) {
            actions.fetchAppendContactLog({
                property_id: propertyId,
                page: Number(pager.get('current_page')) + 1
            })
        }
    }
}

var styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    center: {
        alignItems: 'center',
    },
    justifyContent: {
        justifyContent: 'center'
    },
    justifyBetween: {
        justifyContent: 'space-between'
    },
    baseColor: {
        color: "#3e3e3e"
    },
    grayColor: {
        color: '#8D8C92'
    },
    greenColor: {
        color: '#04C1AE'
    },
    fontMedium: {
        fontWeight: '600'
    },
    padding: {
        padding: 15
    },
    gap: {
        height: 10,
        backgroundColor: '#eee'
    },
    listView: {
        marginBottom: 70
    },
    nameBox: {
        height: 90,
        marginLeft: 15,
        marginRight: 15,
        borderStyle: 'solid',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
    },
    name: {
        fontSize: 22,
        marginBottom: 10
    },
    subName: {
        fontSize: 19
    },
    tagNew: {
        backgroundColor: '#ffa251',
        color: '#fff',
        fontSize: 12,
        padding: (Platform.OS === 'ios') ? 2 : 0,
        fontWeight: '500',
        marginTop: 4,
        marginLeft: 5,
        width: 16,
        textAlign: 'center',
        textAlignVertical: 'top'
    },
    tagAuth: {
        backgroundColor: '#45c7c9'
    },
    info: {
        height: 90
    },
    attr: {
        fontSize: 15,
        marginBottom: 10
    },
    attrVal: {
        fontSize: 17,
        color: '#FF845D'
    },
    vline: {
        height: 32,
        borderStyle: 'solid',
        borderLeftWidth: 1 / PixelRatio.get(),
        borderLeftColor: '#d9d9d9',
        width: 1,
        marginTop: 28
    },
    address: {
        height: 50,
        marginLeft: 15,
        marginRight: 15,
        borderStyle: 'solid',
        borderTopWidth: 1 / PixelRatio.get(),
        borderTopColor: '#d9d9d9',
    },
    baseSize: {
        fontSize: 16
    },
    contactBox: {
        marginTop: 8,
        paddingLeft: 15,
        paddingRight: 15,
        paddingBottom: 6
    },
    contactItem: {
        height: 30
    },
    date: {
        fontSize: 15,
        width: 100
    },
    itemSize: {
        fontSize: 15
    },
    moreBox: {
        borderStyle: 'solid',
        borderBottomWidth: 1 / PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        paddingBottom: 8
    },
    moreIcon: {
        height: 8,
        width: 13,
        marginRight: 7
    },
    more: {
        fontSize: 12
    },
    contactWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        borderTopWidth: 1 / PixelRatio.get(),
        borderStyle: 'solid',
        borderTopColor: '#d9d9d9',
        backgroundColor: '#fff'
    },
    moneyIcon: {
        width: 11,
        height: 15,
        marginRight: 4,
        marginLeft: 13
    },
    contactButton: {
        marginLeft: 12,
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5,
        marginRight: 15
    },
    contactText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    },
    phoneIcon: {
        width: 20,
        height: 20,
        marginRight: 7
    },
    bgWrap: {
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    contentContainer: {
        width: 270,
        borderRadius: 5,
        padding: 20,
        backgroundColor: "#fff"
    },
    closeBox: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 50,
        height: 30
    },
    closeIcon: {
        marginTop: 5,
        width: 15,
        height: 13
    },
    msgTip: {
        marginTop: 14,
        marginBottom: 22,
        textAlign: "center",
        fontSize: 16
    },
    btn: {
        width: 170,
        height: 30,
        justifyContent: "center",
        borderRadius: 5
    },
    sureBtn: {
        height: 35,
        width: 195,
        backgroundColor: '#04c1ae',
        marginBottom: 20
    },
    moreButton: {
        justifyContent: 'center',
        height: 40,
        borderColor: '#04c1ae',
        borderWidth: 2 / PixelRatio.get(),
        borderStyle: 'solid',
        borderRadius: 5,
    },
    moreText: {
        fontSize: 16,
        color: '#04c1ae',
        textAlign: 'center'
    },
    goMore: {
        marginBottom: 60
    },
    backScore: {
        fontSize: 15,
        color: '#04c1ae',
        marginBottom: 10
    },
    borderBtn: {
        borderWidth: 1,
        borderColor: "#d9d9d9",
        marginBottom: 10
    },
    avatarBox: {
        width: 50,
        height: 50,
        marginHorizontal: 15
    },
    avatarImage: {
        width: 50,
        height: 50
    },
    levelBg: {
        position: 'absolute',
        bottom: 2,
        right: -6,
        width: 19,
        height: 19,
        borderRadius: 10,
        backgroundColor: '#FAAE6C',
        borderWidth: 1 / PixelRatio.get(),
        borderColor: "#fff"
    },
    levelText: {
        fontSize: 12,
        color: '#fff',
        backgroundColor: "transparent"
    },
    userVal: {
        fontSize: 20,
        marginTop: 4,
        marginBottom: 6
    },
    couponWrap: {
        backgroundColor: '#fff'
    },
    couponHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginVertical: 20
    },
    couponSure: {
        fontSize: 18
    },
    touchBox: {
        padding: 15,
        paddingTop: 0
    },
    couponFooter: {
        marginTop: 20
    },
    couponItem: {
        marginBottom: 20
    },
    markBg: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 16
    },
    mark: {
        width: 13.5,
        height: 9
    },
    greyBg: {
        backgroundColor: '#eee'
    },
    greenBg: {
        backgroundColor: '#04C1AE'
    },
    voiceWrap: {
        paddingHorizontal: 20,
        paddingVertical: 25
    },
    voiceBox: {
        height: 44,
        borderColor: '#D9D9D9',
        borderWidth: 1 / PixelRatio.get(),
        borderRadius: 3,
        backgroundColor: '#F8F8F8',
        marginLeft: 15,
        marginRight: 10
    },
    voice: {
        height: 17,
        width: 12,
        position: 'absolute',
        left: 17,
        top: 13,
    },
    saleTel: {
        marginTop: 14,
        marginBottom: 6
    },
    expMsg: {
        marginBottom: 12
    },
    boxArrow: {
        position: 'absolute',
        top: 17,
        left: -4,
        width: 5,
        height: 10,
        backgroundColor: '#F8F8F8'
    },
});
