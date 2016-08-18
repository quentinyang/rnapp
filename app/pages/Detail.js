'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, TouchableWithoutFeedback, Alert, Modal, Button, Linking, Platform, AppState } from 'nuke'
import { NativeAppEventEmitter, DeviceEventEmitter } from 'react-native';
import Toast from 'react-native-root-toast';
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
        let phone = status ? info.get('seller_phone') : callInfo.get('sellerPhone').get('seller_phone');
        let cost = this.couponObj ? this.couponObj.get('cost') : info.get('unlock_phone_cost');
        let verfify = null;
        let point = info.get('has_discount') == "1" ? info.get('cur_point') : info.get('point');

        if(phone) {
            verfify = true;
        } else if(info.get('record_url')) {
            verfify = info.get('record_url').size ? true : false;
        }

        return (
            <View style={styles.flex}>
                {
                    verfify == null ? null :
                    verfify ?
                    <VerifyBtn
                        hideRecord={info.get('record_url') && info.get('record_url').size == 0}
                        phone={phone}
                        playRecord={this._playRecord}
                        getSellerPhone={this._clickGetSellerPhoneBtn.bind(this, status, phone)}
                    /> :
                    <UnVerifyBtn
                        contactSeller={this._contactSeller}
                    />
                }

                <GuideModal
                    isVisible={!baseInfo.get('userEnter')}
                    actions={actions}
                />

                {
                    verfify ?
                    <VoiceModal
                        isVisible={callInfo.get('voiceVisible')}
                        time={info.get('record_url') && info.get('record_url').get('record_time') || "00:00"}
                        actions={actions}
                    /> : null
                }

                <CallTipModal
                    isVisible={callInfo.get('callTipVisible')}
                    score={point}
                    callSellerPhone={verfify ? this._getSellerPhone.bind(this) : this._callSellerPhone.bind(this)}
                    actions={actions}
                />

                { couponArr.size ?
                    <CouponModal
                        isVisible={callInfo.get('couponVisible')}
                        useCoupon={this._useCoupon.bind(this, verfify)}
                        couponArr={couponArr}
                        actions={actions}
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
                    removeClippedSubviews={false}
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

        if (status || (!status && callInfo.get('sellerPhone').get('seller_phone')) || !callInfo.get('orderId'))  {
        } else {
            ActionUtil.setAction(actionType.BA_DETAIL_SPEND);
            actions.setFeedbackVisible(true);
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
        AudioPlayer.stop();
    }

    _clickGetSellerPhoneBtn(status, phone) {
        let {actions, actionsNavigation, actionsHome, route, baseInfo} = this.props;
        let propertyId = route.item.get("property_id");

        ActionUtil.setAction(actionType.BA_DETAIL_PHONEGET_CLICK);
        if (phone) { // 已买 或 已获取房东电话
            callUp(phone);
        } else {   // 未买在卖状态的房源
            if (baseInfo.get('couponArr').size) {  //是否有看房卡
                ActionUtil.setAction(actionType.BA_DETAIL_WELFARECARD_ONVIEW);
                actions.setCouponVisible(true);
            } else {
                actions.setCallTipVisibel(true);
            }
        }
    }

    _getSellerPhone() {
        let {actions} = this.props;

        ActionUtil.setAction(actionType.BA_DETAIL_PHONEGET_PAYPOINTS);
        actions.fetchSellerPhone({
            property_id: this.props.route.item.get('property_id'),
            card_id: this.couponObj ? this.couponObj.get('id') : null
        });
    }

    _useCoupon(verfify, coupon) {
        let {route, actions} = this.props;
        let propertyId = route.item.get("property_id");

        this.couponObj = coupon;
        actions.setCouponVisible(false);

        if(verfify) {
            this._getSellerPhone();
        } else {
            this._callSellerPhone();
        }
    }

    _renderRow = (rowData:any) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        );
    };

    _renderHeader = () => {
        let {baseInfo, callInfo, sameCommunityList, route, actions, navigator, actionsNavigation} = this.props;
        let houseList = sameCommunityList.get('properties');
        let userInfo = baseInfo.get('userInfo');

        return (
            <View>
                <BaseInfo baseInfo={baseInfo.get('baseInfo')} hasBuyed={callInfo.get('sellerPhone').get('seller_phone')} route={route}/>
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
        return null;
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

    _playRecord = () => {
        let {baseInfo, actions, route} = this.props;
        let info = baseInfo.get('baseInfo');
        let record = info.get('record_url');
        if (record == null) {
            return;
        }

        ActionUtil.setAction(actionType.BA_DETAIL_TAPEFREE_CLICK);
        if(record.get('record_url')) { //是否有录音
            ActionUtil.setAction(actionType.BA_DETAIL_TAPEFREE_ONVIEW);
            actions.setVoiceVisible(true);
            AudioPlayer.stop();
            AudioPlayer.play(record.get('record_url'));
        } else {
            actions.fetchPropertyRecord({
                property_id: route.item.get('property_id')
            });
        }
    }

    _contactSeller = () => {
        let {baseInfo, actions, callInfo} = this.props;
        ActionUtil.setAction(actionType.BA_DETAIL_CLICK_CALL);

        if(callInfo.get('isPayed')) {
            this.couponObj = null;
            this._callSellerPhone();
        } else if (baseInfo.get('couponArr').size) {  //是否有看房卡
            ActionUtil.setAction(actionType.BA_DETAIL_WELFARECARD_ONVIEW);
            actions.setCouponVisible(true);
        } else {
            actions.setCallTipVisibel(true);
        }
    }
    _callSellerPhone = () => {  //获取短号拨打
        let {actions, route} = this.props;
        ActionUtil.setAction(actionType.BA_DETAIL_PAYPOINTS);
        actions.callSeller({
            property_id: route.item.get("property_id"),
            card_id: this.couponObj ? this.couponObj.get('id') : null
        });
    }
}

class VerifyBtn extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {phone, playRecord, getSellerPhone, hideRecord} = this.props;
        return (
            <View style={[styles.contactWrap, styles.row, styles.center]}>
            {
                hideRecord ? null :
                <TouchableHighlight
                    style={[styles.voiceBtn, styles.contactButton]}
                    underlayColor="#04c1ae"
                    onPress={playRecord}
                >
                    <View style={[styles.justifyContent, styles.center]}>
                        <Text style={[styles.whiteColor, styles.voiceText]}>听认证录音</Text>
                    </View>
                </TouchableHighlight>
            }
                <TouchableHighlight
                    style={[styles.flex, styles.contactButton]}
                    underlayColor="#04c1ae"
                    onPress={getSellerPhone}
                >
                    {
                        phone ?
                        <View style={[styles.row, styles.justifyContent, styles.center]}>
                            <Image
                                style={styles.phoneIcon}
                                source={require("../images/phone.png")}
                            />
                            <Text style={styles.contactText}>联系房东</Text>
                            <Text style={[styles.sellerPhone, styles.whiteColor]}>({phone})</Text>
                        </View>
                        :
                        <View style={[styles.row, styles.justifyContent, styles.center]}>
                            <Image
                                style={styles.phoneIcon}
                                source={require("../images/phone.png")}
                            />
                            <Text style={styles.contactText}>
                                联系房东
                            </Text>
                        </View>
                    }
                </TouchableHighlight>
            </View>
        );
    }
}

class UnVerifyBtn extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.contactWrap, styles.row, styles.center]}>
                <TouchableHighlight
                    style={[styles.flex, styles.contactButton, styles.orangeBg]}
                    underlayColor="#FF6D4B"
                    onPress={this.props.contactSeller}
                >
                    <View style={[styles.row, styles.justifyContent, styles.center]}>
                        <Image
                            style={[styles.phoneIcon, styles.mPhoneIcon]}
                            source={require("../images/phone.png")}
                        />
                        <Text style={styles.contactText}>联系房东</Text>
                    </View>
                </TouchableHighlight>
            </View>
        );
    }
}

class GuideModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isVisible, actions} = this.props;
        return (
            <Modal visible={isVisible} transparent={true} onRequestClose={() => {}}>
                <View style={[styles.flex, styles.justifyEnd, styles.bgWrap]}>
                    <View style={styles.guideContent}>
                        <Text style={[styles.whiteColor, styles.guideTip]}>这都是房子确认在卖的录音哦</Text>

                        <View style={styles.row}>
                            <Image
                                style={styles.arrow}
                                source={require('../images/arrow.png')}
                             />

                            <TouchableHighlight
                                underlayColor="transparent"
                                onPress={() => {actions.setEnterStatus(true);}}
                            >
                                <View style={[styles.knowBtn, styles.whiteBorder, styles.center, styles.justifyContent]}>
                                    <Text style={styles.whiteColor}>我知道了</Text>
                                </View>
                            </TouchableHighlight>
                        </View>

                        <View style={[styles.whiteBorder, styles.contactButton, styles.voiceBtn, styles.center]}>
                            <Text style={styles.whiteColor}>免费听录音</Text>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

class CallTipModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { isVisible, score, callSellerPhone, actions } = this.props;
        return (
            <Modal visible={isVisible} transparent={true}
                   onRequestClose={() => {}}>
                <View style={[styles.flex, styles.center, styles.justifyContent, styles.bgWrap]}>
                    <View style={[styles.center, styles.justifyContent, styles.contentContainer]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.center, styles.justifyContent, styles.closeBox]}
                            underlayColor="transparent"
                            onPress={() => {actions.setCallTipVisibel(false); ActionUtil.setAction(actionType.BA_DETAIL_PAYPOINTS_CLOSE)}}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={[styles.msgTip, styles.baseColor]}>消耗<Text style={styles.fontMedium}>{score}</Text>积分即可获得房东电话</Text>

                        <TouchableHighlight
                            style={[styles.btn, styles.greenBg, {marginBottom: 18}]}
                            underlayColor="#fff"
                            onPress={() => { actions.setCallTipVisibel(false); callSellerPhone();}}
                        >
                            <View style={styles.center}><Text style={styles.whiteColor}>确认</Text></View>
                        </TouchableHighlight>
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
            playing: 1
        };
    }

    componentWillReceiveProps(nextProp) {
        if(nextProp.isVisible == true) {
            this.setState({
                playing: 1
            });
        }
    }

    render() {
        let {isVisible, time, actions} = this.props;
        let m = parseInt(time / 60), s = time % 60;
        let voiceIcon = this.state.playing == 1 ? require('../images/voice_anim.gif') : require('../images/voice.png');
        if(m < 10) {
            m = "0" + m;
        }
        if(s < 10) {
            s = "0" + s;
        }

        return (
            <Modal visible={isVisible} transparent={true} onRequestClose={() => {}}>
                <View style={[styles.flex, styles.center, styles.justifyContent, styles.voiceBg]}>
                    <View style={[styles.voiceContent, styles.bgWrap, styles.center]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.center, styles.justifyContent, styles.closeBox]}
                            underlayColor="transparent"
                            onPress={() => {
                                this.setState({
                                    playing: -1
                                });
                                AudioPlayer.stop();
                                actions.setVoiceVisible(false);
                                ActionUtil.setAction(actionType.BA_DETAIL_TAPEFREE_DELETE);
                            }}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Image
                            style={styles.voiceIcon}
                            source={voiceIcon}
                        />

                        <Text style={styles.whiteColor}>{m}:{s}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
    componentDidMount() {
        AppState.addEventListener('change', this._changePlayStatus.bind(this));

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
        AppState.removeEventListener('change', this._changePlayStatus.bind(this));

        if(Platform.OS == 'ios') {
            this.audioListener.remove();
        } else {
            DeviceEventEmitter.removeAllListeners('mediaCompletioned');
        }
    }

    _changePlayStatus(currentAppState) {
        if(currentAppState == 'background') {
            AudioPlayer.stop();
            this.props.actions.setVoiceVisible(false);
        } else if(currentAppState == 'inactive') {
            AudioPlayer.stop();
            this.props.actions.setVoiceVisible(false);
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
                    <View style={[styles.flex, styles.whiteBg]}>
                        <View style={styles.couponHeader}>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    ActionUtil.setAction(actionType.BA_DETAIL_WELFARECARD_DELETE);
                                    actions.setCouponVisible(false)
                                }}
                            >
                                <View style={styles.touchBox}>
                                    <Image style={styles.closeIcon} source={require('../images/close.png')}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.center}>
                                <Text style={styles.subName}>是否要使用看房卡</Text>
                                <Text style={[styles.itemSize, styles.grayColor]}>房源无效可退回卡</Text>
                            </View>
                            <TouchableWithoutFeedback
                                onPress={()=>{
                                    ActionUtil.setActionWithExtend(actionType.BA_DETAIL_WELFARECARD_SURE, {
                                        "card_type": this.state.curCoupon.get('type')
                                    });
                                    useCoupon(this.state.curCoupon)
                                }}
                            >
                                <View style={styles.touchBox}>
                                    <Text style={[styles.greenColor, styles.couponSure]}>确定</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <ListView
                            contentContainerStyle={styles.touchBox}
                            dataSource={ds.cloneWithRows(couponArr.toArray())}
                            renderRow={this._renderRow.bind(this)}
                            enableEmptySections={true}
                            showsVerticalScrollIndicator={false}
                            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                        />

                        <TouchableWithoutFeedback
                            onPress={()=> {
                                ActionUtil.setAction(actionType.BA_DETAIL_WELFARECARD_NOUSE);
                                this.props.useCoupon()
                            }}
                        >
                            <View style={[styles.center, styles.justifyContent, styles.couponFooter]}>
                                <Text style={[styles.greenColor, styles.more]}>不使用看房卡</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>
        );
    }

    _renderRow(rowData) {
        let isCur = this.state.curCoupon.get('id') == rowData.get("id");
        return (
            <TouchableWithoutFeedback onPress={() => {
                if(!isCur) {
                    this.setState({
                        curCoupon: rowData
                    });
                }
            }}>
                <View style={[styles.row, styles.center, styles.couponItem]}>
                    <View style={[styles.markBg, isCur ? styles.greenBg : styles.greyBg, styles.center, styles.justifyContent]}>
                        {isCur ? <Image style={styles.mark} source={require('../images/mark_white.png')} /> : null}
                    </View>
                    <WelfareCard item={rowData}/>
                </View>
            </TouchableWithoutFeedback>
        );
    }
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
                <View style={[styles.flex, styles.justifyEnd, styles.bgWrap]}>
                    <View style={[styles.whiteBg]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.center, styles.justifyContent, styles.closeBox]}
                            underlayColor="transparent"
                            onPress={this._closeModal.bind(this, actionType.BA_DETAIL_TAPEFREE_CLOSE)}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={styles.phoneVal}>房东电话：<Text style={[styles.phoneVal, styles.fontMedium]}>{phoneInfo.get('seller_phone')}</Text></Text>
                        <Text style={[styles.more, styles.grayColor, {textAlign: 'center'}]}>您可以在 [我查看的房源] 中查看房东电话</Text>

                        <TouchableHighlight
                            style={[styles.flex, styles.contactButton, styles.phoneSure]}
                            underlayColor="#04c1ae"
                            onPress={this._closeModal.bind(this, actionType.BA_DETAIL_TAPEFREE_SURE)}
                        >
                            <View>
                                <Text style={styles.contactText}>确定</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
    _closeModal(actionLog) {
        let {phoneInfo, actions} = this.props;

        actionLog && ActionUtil.setAction(actionLog);

        actions.setSellerPhoneVisible(false);
        Toast.show('看房获得' + phoneInfo.get('experience') + '个经验', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER
        });
    }
}

class UserInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {userInfo, navigator, actions, actionsNavigation} = this.props;

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
                            title: '用户' + userInfo.get('input_user_id'),
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
                                <Text style={styles.userName}>用户{userInfo.get('input_user_id')}</Text>
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
                                <Text style={[styles.grayColor, styles.more]}>发房认证</Text>
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
        let errorMsg = (callInfo && callInfo.get('callError') && callInfo.get('callError').get('msg')) ? callInfo.get('callError').get('msg') : '拨打电话失败了,再试一下吧!';

        return (
            <Modal visible={callInfo.get('errorTipVisible')} transparent={true}
                   onRequestClose={actions.setErrorTipVisible}>
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

                        <Text style={[styles.msgTip, styles.baseColor]}>{errorMsg}</Text>

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
                   onRequestClose={actions.setErrorTipVisible}>
                <View style={[styles.flex, styles.justifyEnd, styles.bgWrap]}>
                    <View style={[styles.whiteBg, styles.feedbackBox]}>
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

                        <Text style={styles.scoreTip}>{callInfo.get('isPayed') ? "请反馈本次通话结果" : "本次通话花费了您" + (score || '') + "积分"}</Text>

                        <TouchableHighlight
                            style={styles.feedbackSureBtn}
                            underlayColor="#04c1ae"
                            onPress={this._handlerFeedback.bind(this, actionType.BA_DETAIL_SPENDENSURE)}
                        >
                            <View>
                                <Text style={styles.contactText}>房源在卖</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableWithoutFeedback
                            onPress={this._goBackScore.bind(this)}
                        >
                            <View style={[styles.feedbackSureBtn, styles.feedbackBorderButton]}><Text style={[styles.userName, styles.greenColor]}>房源无效退还积分</Text></View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>
        );
    }

    _handlerFeedback(actionLog) {
        let {callInfo, actions, propertyId} = this.props;

        ActionUtil.setActionWithExtend(actionLog, {"vpid": propertyId});
        actions.callFeedback({
            order_id: callInfo.get('orderId'),
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
            callbackFun: () => {
                actions.setFeedbackVisible(true);
                navigator.pop();
            },
            bp: this.pageId,
            washId: callInfo.get('orderId'),
            propertyId: propertyId
        });
    }
}

class BaseInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {baseInfo, hasBuyed, route} = this.props;
        let houseInfo = route.item;
        let isVertify = houseInfo.get('is_verify') && houseInfo.get('is_verify') == "1"  || baseInfo.get('is_verify') && baseInfo.get('is_verify') == "1";
        let doorNum = '';
        if(houseInfo.get('is_verify') == "1" || houseInfo.get('phone_lock_status') == "1" ||
            baseInfo.get('is_verify') == "1" || baseInfo.get('phone_lock_status') == "1" || hasBuyed) {
            doorNum = (houseInfo.get('door_num') || baseInfo.get('floor')) + '室';
        } else if(houseInfo.get('floor') || baseInfo.get('floor')) {
            doorNum = (houseInfo.get('floor') || baseInfo.get('floor')) + '层';
        }

        return (
            <View>
                <View style={[styles.center, styles.justifyContent, styles.nameBox]}>
                    <Text style={[styles.name, styles.baseColor]}>{houseInfo.get('community_name') || ''}</Text>
                    <View style={[styles.row, styles.justifyContent]}>
                        <Text style={[styles.subName, styles.baseColor]}>
                            {houseInfo.get('building_num') || ''}{houseInfo.get('building_num') && houseInfo.get('building_unit') || ''}{doorNum}
                            {houseInfo.get('is_new') && ' '}
                            {houseInfo.get('is_new') ? <Image style={[styles.tagNew]} source={require("../images/new_tag.png")} />: null}
                            {isVertify && ' '}
                            {isVertify ? <Image style={[styles.tagVerify]} source={require("../images/verify_tag.png")} />: null}
                        </Text>

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
                <View style={[styles.justifyContent, styles.address]}>
                    <Text style={[styles.baseSize, styles.baseColor]}
                          numberOfLines={1}>{isVertify ?
                          "认证时间：" + (houseInfo.get('verify_at') || baseInfo.get('verify_at') || '') :
                          "发布时间：" + (houseInfo.get('created_at') || baseInfo.get('created_at') || '')}
                    </Text>
                </View>

                {
                    baseInfo.get('has_discount') == "1" ?
                    <View style={[styles.row, styles.center, styles.lightGrayBg, styles.priceBox]}>
                        <View style={[styles.justifyContent, styles.center, styles.discountTag]}>
                            <Text style={[styles.orangeColor, styles.more]}>优惠价</Text>
                        </View>

                        <View style={[styles.row, styles.center]}>
                            <Image
                                style={styles.moneyIcon}
                                source={require('../images/money.png')}
                            />
                            <Text style={[styles.greenColor, styles.userName]}><Text style={[styles.greenColor, styles.point]}>{baseInfo.get("cur_point")}</Text>积分</Text>
                        </View>
                        <Text style={[styles.pointSmallTip, styles.grayColor]}>原价：<Text style={[styles.pointSmall, styles.grayColor]}>{baseInfo.get("point")}</Text>积分</Text>
                    </View>
                    :
                    <View style={[styles.row, styles.center, styles.lightGrayBg, styles.priceBox]}>
                        <Image
                            style={styles.moneyIcon}
                            source={require('../images/money.png')}
                        />
                        <Text style={[styles.greenColor, styles.userName]}><Text style={[styles.greenColor, styles.point]}>{baseInfo.get("point")}</Text>积分</Text>
                    </View>
                }
            </View>
        );
    }
}

class ContactList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {properyId, contact, actions} = this.props;
        let pager = contact.get('pager');
        let contactList = contact.get('logs').map((item, index) => {
            return (
                <View key={index} style={[styles.row, styles.contactItem, styles.center]}>
                    <Text style={[styles.grayColor, styles.date]}>{item.get('time')}</Text><Text
                    style={[styles.baseColor, styles.itemSize]}>{item.get('phone')}查看房东电话</Text>
                </View>
            );
        });
        return (
            <View>
                <View style={styles.gap}></View>
                <TitleBar title={"房源查看记录 (" + contact.get('total') + "次)"} />
                <View style={[styles.contactBox]}>
                    {contactList}
                </View>

                {pager.get('current_page') == pager.get('last_page') ? null :
                    <TouchableWithoutFeedback
                        onPress={() => {
                            ActionUtil.setAction(actionType.BA_DETAIL_MORECONTACT);
                            actions.fetchContactLog({
                                property_id: properyId,
                                page: Number(pager.get('current_page')) + 1
                            });
                        }}
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
    justifyEnd: {
        justifyContent: 'flex-end'
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
    whiteColor: {
        color: '#fff'
    },
    orangeColor: {
        color: '#FF6D4B'
    },
    lightGrayBg: {
        backgroundColor: '#f8f8f8'
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
        marginBottom: 60
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
        fontWeight: '500',
        fontSize: 22,
        marginBottom: 10
    },
    subName: {
        fontWeight: '500',
        fontSize: 19
    },
    tagNew: {
        width: 15,
        height: 15
    },
    tagVerify: {
        width: 27,
        height: 15
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
    priceBox: {
        height: 50,
        paddingHorizontal: 15
    },
    baseSize: {
        fontSize: 16
    },
    contactBox: {
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
        height: 55,
        borderTopWidth: 1 / PixelRatio.get(),
        borderStyle: 'solid',
        borderTopColor: '#d9d9d9',
        backgroundColor: '#fff',
        paddingHorizontal: 15
    },
    moneyIcon: {
        width: 8.5,
        height: 11,
        marginRight: 3,
        marginLeft: 14
    },
    scoreVal: {
        marginRight: 18
    },
    contactButton: {
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5
    },
    contactText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    },
    phoneIcon: {
        width: 18,
        height: 18,
        marginRight: 7,
        transform: [
            {rotate: '10deg'}
        ]
    },
    mPhoneIcon: {
        width: 20,
        height: 20,
    },
    bgWrap: {
        backgroundColor: "rgba(0, 0, 0, 0.6)"
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
        width: 18,
        height: 18
    },
    msgTip: {
        marginTop: 14,
        marginBottom: 22,
        textAlign: "center",
        fontSize: 16
    },
    feedbackBox: {
        paddingHorizontal: 37
    },
    scoreTip: {
        flex: 1,
        textAlign: 'center',
        fontSize: 19,
        marginTop: 35,
        marginBottom: 40
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
    feedbackSureBtn: {
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    feedbackBorderButton: {
        backgroundColor: 'transparent',
        borderColor: '#04c1ae',
        borderWidth: 2 / PixelRatio.get(),
        borderStyle: 'solid',
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
    userName: {
        fontSize: 17
    },
    whiteBg: {
        backgroundColor: '#fff'
    },
    orangeBg: {
        backgroundColor: '#FF6D4B'
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
        marginVertical: 10
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
    guideContent: {
        paddingHorizontal: 15,
        marginBottom: 7
    },
    whiteBorder: {
        borderColor: '#fff',
        borderWidth: 3 / PixelRatio.get()
    },
    guideTip: {
        fontSize: 21,
        paddingLeft: 15
    },
    arrow: {
        width: 40,
        height: 56,
        marginLeft: 50,
        marginVertical: 10,
        marginRight: 70
    },
    knowBtn: {
        width: 100,
        height: 30,
        borderRadius: 2,
        marginTop: 20
    },
    voiceBtn: {
        width: 106,
        marginRight: 9
    },
    voiceText: {
        fontSize: 18
    },
    sellerPhone: {
        fontSize: 12,
        marginLeft: 8
    },
    phoneVal: {
        fontSize: 21,
        marginBottom: 32,
        marginTop: 48,
        textAlign: 'center'
    },
    phoneSure: {
        marginHorizontal: 37,
        marginBottom: 30,
        marginTop: 15
    },
    voiceBg: {
        backgroundColor: 'transparent'
    },
    voiceContent: {
        width: 140,
        height: 140,
        borderRadius: 3
    },
    voiceIcon: {
        width: 40,
        height: 53,
        marginTop: 35,
        marginBottom: 18
    },
    discountTag: {
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#FF6D4B',
        width: 54,
        height: 21
    },
    point: {
        fontSize: 20
    },
    pointSmall: {
        fontSize: 14
    },
    pointSmallTip: {
        fontSize: 13,
        marginLeft: 10,
        textDecorationLine: 'line-through',
        marginTop: 4
    }
});
