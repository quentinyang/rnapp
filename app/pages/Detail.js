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
let ActionUtil = require( '../utils/ActionLog');
import {callUp} from '../utils/CommonUtils';
import * as actionType from '../constants/ActionLog';
import TitleBar from '../components/TitleBar';

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.flag = false;
        this.isCall = false;
        this.pageId = actionType.BA_DETAIL;
        ActionUtil.setActionWithExtend(actionType.BA_DETAIL_ONVIEW, {"vpid": this.props.route.item.get('property_id'), "bp": this.props.route.bp});
    }

    render() {
        let {baseInfo, sameCommunityList, callInfo, actions, navigator, route} = this.props;
        let houseList = sameCommunityList.get('properties');
        let info = baseInfo.get("baseInfo");
        let status = Number(info.get('phone_lock_status'));
        let phoneStr = "联系房东" + (status ? ("(" + info.get('seller_phone') + ")") : (callInfo.get('sellerPhone') ? ("(" + callInfo.get('sellerPhone') + ")") : ''));


        return (
            <View style={styles.flex}>
                <View style={[styles.contactWrap, styles.row, styles.center]}>
                    {
                        (status || !status && callInfo.get('sellerPhone')) ?
                            null :
                            <Image
                                style={styles.moneyIcon}
                                source={require("../images/money.png")}
                            />
                    }
                    {
                        (status || !status && callInfo.get('sellerPhone')) ?
                            null :
                            <Text style={[styles.greenColor, styles.baseSize]}>{route.item.get('unlock_phone_cost') || 0}积分</Text>
                    }

                    <TouchableHighlight
                        style={[styles.flex, styles.contactButton]}
                        underlayColor="#04c1ae"
                        onPress={this._clickPhoneBtn.bind(this, status, info.get('seller_phone'), callInfo.get('sellerPhone'))}
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
                <CouponModal />
                <TelModal />
                <ErrorTipModal callInfo={callInfo} actions={actions} navigator={navigator} />
                <CostScoreModal
                    propertyId={route.item.get('property_id')}
                    callInfo={callInfo}
                    actions={actions}
                    navigator={navigator}
                    score={route.item.get('unlock_phone_cost') || 0}
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
        });

        if(Platform.OS === 'ios') {
            this.callSubscription =  NativeAppEventEmitter.addListener('callIdle', () => {
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

        if(status || !status && callInfo.get('sellerPhone')) {
        } else {
            if(this.isCall) {
                ActionUtil.setAction(actionType.BA_DETAIL_SPEND);
                actions.setFeedbackVisible(true);
            }
        }
    }
    componentDidUpdate() {
        if(!this.props.callInfo.get('feedbackVisible') && this.flag) {
            this.flag = false;
        }
    }

    componentWillUnmount() {
        let {route, actions, actionsNavigation} = this.props;
        actions.clearHouseDetailPage();
        if(route.from == 'houseDetail') {
            actionsNavigation.detailPopRoute();
        } else if(route.from == 'houseList') {
            actionsNavigation.listPopRoute();
        }

        if(Platform.OS === 'ios') {
            this.callSubscription.remove();
        } else {
            DeviceEventEmitter.removeAllListeners('callIdle');
        }
    }

    _clickPhoneBtn(status, phone, hasPhone) {
        let {actions, actionsNavigation, actionsHome, route} = this.props;
        let propertyId = route.item.get("property_id");


        ActionUtil.setAction(actionType.BA_DETAIL_CLICK_CALL);
        if(status || hasPhone) { //1: 已解锁 或 已反馈在卖
            callUp(phone);
        } else {   //0: 未解锁
            this.isCall = true;
            actions.callSeller({
                property_id: propertyId
            });
        }
    }

    _renderRow = (rowData: any) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        );
    };

    _renderHeader = () => {
        let {baseInfo, sameCommunityList, route, actions} = this.props;
        let houseList = sameCommunityList.get('properties');
        return (
            <View>
                <BaseInfo baseInfo={baseInfo.get('baseInfo')} route={route} />
                <UserInfo />

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
                    houseList.size > 0 ? <TitleBar title="周边房源" />  : null
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
        ActionUtil.setAction(actionType.BA_DETAIL_SAMECOM_DETAIL);
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
 
class TelModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal visible={false} transparent={true}
                   onRequestClose={()=>{}}>
                <View style={[styles.flex, styles.center, styles.justifyContent, styles.bgWrap]}>
                    <View style={[styles.center, styles.justifyContent, styles.contentContainer]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.center, styles.justifyContent, styles.closeBox]}
                            underlayColor="#fff"
                            onPress={() => {ActionUtil.setAction(actionType.BA_DETAIL_CASHRECHACLOSE);}}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={styles.saleTel}>房东电话：123437545456</Text>
                        <Text style={styles.expMsg}>同时您获得了5经验</Text>
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
        return (
            <Modal visible={true} transparent={true} onRequestClose={() => {}}>
                <View style={[styles.flex, styles.bgWrap]}>
                    <View style={styles.flex}></View>

{/*

                    
                    <View style={[styles.flex, styles.couponWrap]}>
                        <View style={styles.couponHeader}>
                            <TouchableWithoutFeedback onPress={()=>{}}>
                                <View style={styles.touchBox}>
                                    <Image style={styles.closeIcon} source={require('../images/close.png')} />
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={styles.center}>
                                <Text style={styles.subName}>是否要使用看房卡</Text>
                                <Text style={[styles.itemSize, styles.grayColor]}>未成功卡可退回</Text>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>{}}>
                                <View style={styles.touchBox}>
                                    <Text style={[styles.greenColor, styles.couponSure]}>确定</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>

                        <ListView
                            contentContainerStyle={styles.touchBox}
                            dataSource={ds.cloneWithRows([{}, {}, {}, {}])}
                            renderRow={this._renderRow}
                            renderFooter={this._renderFooter}
                            enableEmptySections={true}
                            showsVerticalScrollIndicator={false}                          
                        />

                    </View>
*/}
                    <View style={[styles.flex, styles.justifyBetween, styles.couponWrap, styles.voiceWrap]}>
                        <TouchableHighlight 
                            style={[styles.closeBox, styles.center, styles.justifyContent]} 
                            onPress={()=>{}}
                            underlayColor="#fff"
                        >                            
                            <Image style={styles.closeIcon} source={require('../images/close.png')} />                            
                        </TouchableHighlight>
                        <View style={[styles.justifyContent, styles.center]}>
                            <Text style={[styles.subName]}>今日已有2通电话确认房子在卖</Text>
                            <Text style={styles.subName}>请听通话录音</Text>
                        </View>

                        <View>
                            <View style={[styles.row, styles.justifyContent, styles.center, {marginBottom: 28}]}>
                                <Text>通话1</Text>
                                <View style={[styles.flex, styles.center, styles.justifyContent, styles.voiceBox]}>
                                    <Image style={styles.voice} source={require('../images/voice.png')} />
                                    <Image style={styles.boxArrow} source={require('../images/next.png')} />
                                    <Text style={styles.greenColor}>点击播放</Text>
                                </View>
                                <Text style={[styles.grayColor, styles.itemSize]}>09:34</Text>
                            </View>
                            <View style={[styles.row, styles.justifyContent, styles.center]}>
                                <Text>通话1</Text>
                                <View style={[styles.flex, styles.center, styles.justifyContent, styles.voiceBox]}>
                                    <Image style={styles.voice} source={require('../images/voice.png')} />
                                    <Image style={styles.boxArrow} source={require('../images/next.png')} />
                                    <Text style={styles.greenColor}>点击播放</Text>
                                </View>
                                <Text style={[styles.grayColor, styles.itemSize]}>09:34</Text>
                            </View>
                        </View>

                        <TouchableHighlight
                            style={[styles.contactButton]}
                            onPress={()=>{}}
                            underlayColor="#04C1AE"
                        >
                            <View style={[styles.justifyContent, styles.center]}>
                                <Text style={styles.contactText}>
                                    4积分 获取房东电话
                                </Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
    _renderFooter() {
        return (
            <TouchableWithoutFeedback onPress={()=> {}}>
                <View style={[styles.center, styles.justifyContent, styles.couponFooter]}>
                    <Text style={[styles.greenColor, styles.more]}>不使用看房卡</Text>
                </View>
            </TouchableWithoutFeedback>            
        );
    }
    _renderRow() {
        return (
            <View style={[styles.row, styles.center, styles.couponItem]}>
                <TouchableWithoutFeedback onPress={() => {}}>                    
                    <View style={[styles.markBg, styles.greenBg, styles.center, styles.justifyContent]}>
                        {1 ? <Image style={styles.mark} source={require('../images/mark_white.png')} /> : null}
                    </View>
                </TouchableWithoutFeedback>
                <View style={{height: 78, width: 305, backgroundColor: '#eee'}}>

                </View>
            </View>
        );
    }
}

class UserInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <View style={styles.gap}></View>
                <TitleBar title="发房用户" />
                
                <TouchableWithoutFeedback onPress={() => { }}>
                    <View>
                        <View style={[styles.row, styles.center]}>
                            <View style={styles.avatarBox}>
                                <View style={[styles.avatarBg, styles.center, styles.justifyContent]}>
                                    <Image
                                        style={styles.avatarImage}
                                        source={require('../images/avatar_white.png')}
                                    />
                                </View>

                                <View style={[styles.levelBg, styles.center, styles.justifyContent]}>
                                    <Text style={[styles.levelText]}>{"V1"}</Text>
                                </View>
                            </View>
                            <Text style={styles.subName}>123</Text>
                        </View>                        

                        <View style={[styles.info, styles.row]}>
                            <View style={[styles.flex, styles.center, styles.justifyContent]}>
                                <Text style={styles.userVal}>{47}</Text>
                                <Text style={[styles.grayColor, styles.more]}>累计登录</Text>
                            </View>
                            <View style={styles.vline}></View>
                            <View style={[styles.flex, styles.center, styles.justifyContent]}>
                                <Text style={styles.userVal}>{47}</Text>
                                <Text style={[styles.grayColor, styles.more]}>已赚积分</Text>
                            </View>
                            <View style={styles.vline}></View>
                            <View style={[styles.flex, styles.center, styles.justifyContent]}>
                                <Text style={styles.userVal}>{47}</Text>
                                <Text style={[styles.grayColor, styles.more]}>发房</Text>
                            </View>
                            <View style={styles.vline}></View>
                            <View style={[styles.flex, styles.center, styles.justifyContent]}>
                                <Text style={styles.userVal}>{47}</Text>
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
                            underlayColor="#fff"
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
        if(title == '房源基本信息') {
            navigator.push({
                component: component,
                name: 'publishInventory',
                title: title,
                right: {msg: "发房规则", route: {component: InputHouseRule, name: 'InputHouseRule', title: '发房规则', hideNavBar: false, backLog: actionType.BA_SENDRULE_RETURN}},
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
                            underlayColor="#fff"
                            onPress={this._handlerFeedback.bind(this, actionType.BA_DETAIL_SPENDCANCEL)}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={[styles.msgTip, styles.baseColor]}>本次通话您消耗了{score}积分</Text>

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
                            <View><Text style={styles.backScore}>找回积分</Text></View>
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
                        <Text style={[styles.subName, styles.flex, styles.baseColor]}>{houseInfo.get('building_num') || ''}{houseInfo.get('building_num') && houseInfo.get('building_unit') || ''}{houseInfo.get('door_num') || ''}{houseInfo.get('door_num') && '室'}</Text>
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
                        <Text style={[styles.attrVal, styles.fontMedium]}>{houseInfo.get('bedrooms') || ''}室{houseInfo.get('living_rooms') || ''}厅{houseInfo.get('bathrooms') || ''}卫</Text>
                    </View>
                    <View style={styles.vline}></View>
                    <View style={[styles.flex, styles.center, styles.justifyContent]}>
                        <Text style={[styles.attr, styles.baseColor]}>面积</Text>
                        <Text style={[styles.attrVal, styles.fontMedium]}>{houseInfo.get('area') || ''}平米</Text>
                    </View>
                </View>
                <View style={[styles.justifyContent, styles.address]}>
                    <Text style={[styles.baseSize, styles.baseColor]} numberOfLines={1}>地址: {houseInfo.get('district_name') || baseInfo.get('district_name') || ''}{houseInfo.get('block_name') || baseInfo.get('block_name') || ''}  {houseInfo.get('community_address') || baseInfo.get('community_address') || ''}</Text>
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
                    <Text style={[styles.grayColor, styles.date]}>{item.get('time')}</Text><Text style={[styles.baseColor, styles.itemSize]}>{item.get('phone')}联系了房东</Text>
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
                                source={require('../images/dropDown.png')} />
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
        if(contact.get('logs').size < 5 && pager.get('current_page') < pager.get('last_page')) {
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
        borderBottomWidth: 1/PixelRatio.get(),
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
        borderLeftWidth: 1/PixelRatio.get(),
        borderLeftColor: '#d9d9d9',
        width: 1,
        marginTop: 28
    },
    address: {
        height: 50,
        marginLeft: 15,
        marginRight: 15,
        borderStyle: 'solid',
        borderTopWidth: 1/PixelRatio.get(),
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
        borderBottomWidth: 1/PixelRatio.get(),
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
        borderTopWidth: 1/PixelRatio.get(),
        borderStyle: 'solid',
        borderTopColor: '#d9d9d9',
        backgroundColor :'#fff'
    },
    moneyIcon: {
        width: 11,
        height: 15,
        marginRight: 4,
        marginLeft :13
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
        borderWidth: 2/PixelRatio.get(),
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
    avatarBg: {
        marginRight: 15,
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#04c1ae'
    },
    avatarImage: {
        width: 30,
        height: 30
    },
    levelBg: {
        position: 'absolute',
        bottom: 2,
        right: -6,
        width: 19,
        height: 19,
        borderRadius: 10,
        backgroundColor: '#FAAE6C',
        borderWidth: 1/PixelRatio.get(),
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
        borderWidth: 1/PixelRatio.get(),
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
        left: -5,
        width: 5,
        height: 10,
        backgroundColor: '#F8F8F8',
        transform:[
            {rotate: '180deg'}
        ]
    },
});
