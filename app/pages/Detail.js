'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, TouchableWithoutFeedback, Alert, Modal, Button, Linking, Platform } from 'nuke'
import HouseItem from '../components/HouseItem';
import HouseListContainer from '../containers/HouseListContainer';
import DetailContainer from '../containers/DetailContainer';
import HouseInputContainer from '../containers/HouseInputContainer'
import RechargeContainer from '../containers/RechargeContainer'
import BackScoreContainer from '../containers/BackScoreContainer'
let ActionUtil = require( '../utils/ActionLog');
import {callUp} from '../utils/CommonUtils'
import * as actionType from '../constants/ActionLog'

var {
    NativeAppEventEmitter
    } = React;

var { DeviceEventEmitter } = require('react-native');

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export default class Detail extends Component {
    constructor(props) {
        super(props);
        this.flag = false;
        this.pageId = actionType.BA_DETAIL;
        ActionUtil.setActionWithExtend(actionType.BA_DETAIL_ONVIEW, {"vpid": this.props.route.item.get('property_id'), "bp": this.props.route.bp});
    }

    render() {
        let {baseInfo, sameCommunityList, callInfo, actions, navigator, route} = this.props;
        let houseList = sameCommunityList.get('properties');
        let info = baseInfo.get("baseInfo");
        let status = Number(route.item.get('phone_lock_status'));
        let phoneStr = "联系房东" + (status ? ("(" + route.item.get('seller_phone') + ")") : (callInfo.get('sellerPhone') ? ("(" + callInfo.get('sellerPhone') + ")") : ''));


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
            ActionUtil.setAction(actionType.BA_DETAIL_SPEND);
            actions.setFeedbackVisible(true);
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
        let {actions, actionsHome, actionsHouseList, route} = this.props;
        let propertyId = route.item.get("property_id");

        ActionUtil.setAction(actionType.BA_DETAIL_CLICK_CALL);
        if(status || hasPhone) { //1: 已解锁 或 已反馈在卖
            callUp(phone);
        } else {   //0: 未解锁
            actionsHome.setContactStatus({"property_id": propertyId});
            actionsHouseList.setContactStatus({"property_id": propertyId});

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
                    houseList.size > 0 ?
                        <View style={[styles.itemContainer, styles.row, styles.center, styles.padding, styles.titleBox]}>
                            <Text style={styles.bar}></Text>
                            <Text style={[styles.baseSize, styles.baseColor]}>同小区房源</Text>
                        </View>
                        : null
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
        if(!item.get('is_click')) {
            actions.setLookStatus({
                property_id: item.get('property_id')
            });
            actionsHouseList.setLookStatus({
                property_id: item.get('property_id')
            });
            actionsHome.setLookStatus({
                property_id: item.get('property_id')
            });
        }
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
    };

    _handleMoreHouseList = () => {
        ActionUtil.setAction(actionType.BA_DETAIL_COMMUNITYHOUSE);
        let {route, navigator, actionsHouseList, actionsNavigation} = this.props,
            {item} = route;

        actionsHouseList.filterCommunityNameChanged(item.get('community_id'), item.get('community_name'));
        actionsHouseList.fetchHouseList({
            page: 1,
            community_id: item.get('community_id')
        });

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
                            onPress={this._goPage.bind(this, HouseInputContainer, '发布房源', actionType.BA_DETAIL_CASH)}
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
        navigator.push({
            component: component,
            name: '',
            title: title,
            hideHeader: true,
            hideNavBar: false,
            bp: this.pageId
        });
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
                            <Text style={styles.backScore}>房源信息有误,找回积分</Text>
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
        });
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
            <View style={[styles.itemContainer, styles.baseBox]}>
                <View style={[styles.center, styles.justifyContent, styles.nameBox]}>
                    <Text style={[styles.name]}>{houseInfo.get('community_name') || ''}</Text>
                    <View style={[styles.row, styles.justifyContent]}>
                        <Text style={[styles.subName, styles.flex]}>{houseInfo.get('building_num') || ''}{houseInfo.get('building_unit') || ''}{houseInfo.get('door_num') || ''}</Text>
                        {
                            houseInfo.get('is_new') ? <Text style={[styles.tagNew, styles.flex]}>新</Text> : null
                        }
                        {
                            houseInfo.get('is_verify') ? <Text style={[styles.tagNew, styles.tagAuth, styles.flex]}>认</Text> : null
                        }
                    </View>
                </View>

                <View style={[styles.info, styles.row]}>
                    <View style={[styles.flex, styles.center, styles.justifyContent]}>
                        <Text style={styles.attr}>总价</Text>
                        <Text style={styles.attrVal}>{houseInfo.get('price') || ''}万</Text>
                    </View>
                    <View style={styles.vline}></View>
                    <View style={[styles.flex, styles.center, styles.justifyContent]}>
                        <Text style={styles.attr}>户型</Text>
                        <Text style={styles.attrVal}>{houseInfo.get('bedrooms') || ''}室{houseInfo.get('living_rooms') || ''}厅{houseInfo.get('bathrooms') || ''}卫</Text>
                    </View>
                    <View style={styles.vline}></View>
                    <View style={[styles.flex, styles.center, styles.justifyContent]}>
                        <Text style={styles.attr}>面积</Text>
                        <Text style={styles.attrVal}>{houseInfo.get('area') || ''}平米</Text>
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
                <View style={[styles.itemContainer, styles.row, styles.center, styles.padding, styles.titleBox]}>
                    <Text style={styles.bar}></Text>
                    <Text style={[styles.baseSize, styles.baseColor]}>联系房东记录 ({contact.get('total')}次)</Text>
                </View>
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
    baseColor: {
        color: "#3e3e3e"
    },
    grayColor: {
        color: '#8D8C92'
    },
    greenColor: {
        color: '#04C1AE'
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
    itemContainer: {
        borderStyle: 'solid',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        borderTopWidth: 1/PixelRatio.get(),
        borderTopColor: '#d9d9d9'
    },
    baseBox: {
        borderTopWidth: 0
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
    titleBox: {
        height: 42
    },
    bar: {
        width: 3,
        height: 15,
        backgroundColor: '#04C1AE',
        marginRight: 8,
        borderRadius: 2
    },
    contactBox: {
        marginTop: 8,
        paddingLeft: 15,
        paddingRight: 15
    },
    contactItem: {
        height: 30
    },
    date: {
        fontSize: 15,
        paddingRight: 25
    },
    itemSize: {
        fontSize: 15
    },
    moreBox: {
        borderStyle: 'solid',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        paddingBottom: 17,
        paddingTop: 5
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
        height: 20
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
        width: 15,
        height: 11
    },
    msgTip: {
        marginTop: 16,
        marginBottom: 20,
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
        backgroundColor: '#04c1ae',
        marginBottom: 10
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
        fontSize: 12,
        color: '#04c1ae',
        marginBottom: 5
    },
    borderBtn: {
        borderWidth: 1,
        borderColor: "#d9d9d9",
        marginBottom: 10
    },
});