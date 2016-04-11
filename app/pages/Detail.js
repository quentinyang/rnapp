'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert, Modal, Button, Linking } from 'nuke'
import HouseItem from '../components/HouseItem';
import HouseListContainer from '../containers/HouseListContainer';
import DetailContainer from '../containers/DetailContainer';
import HouseInputContainer from '../containers/HouseInputContainer'
import UserContainer from '../containers/UserContainer'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export default class Detail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {baseInfo, sameCommunityList, callInfo} = this.props;
        let houseList = sameCommunityList.get('properties');
        let info = baseInfo.get("baseInfo");
        let status = Number(info.get('phone_lock_status'));
        let phoneStr = "联系房东" + (status ? ("(" + info.get('seller_phone') + ")") : (callInfo.get('sellerPhone') ? ("(" + callInfo.get('sellerPhone') + ")") : ''));

        return (
            <View style={styles.flex}>
                <Modal visible={callInfo.get('scoreTipVisible')} transparent={true} onModalVisibilityChanged={this.props.actions.setScoreTipVisible}>
                    <View style={styles.bgWrap}>
                        <View style={styles.contentContainer}>
                            <TouchableHighlight
                                style={styles.closeBox}
                                underlayColor="#fff"
                                onPress={this.props.actions.setScoreTipVisible.bind(null, false)}
                            >
                                <Image
                                    style={styles.closeIcon}
                                    source={require("../images/close.png")}
                                />
                            </TouchableHighlight>

                            <Text style={[styles.msgTip, styles.baseColor]}>消耗{info.get('unlock_phone_cost')}积分即可获得房东电话</Text>
                            <Button
                                containerStyle={[styles.btn, styles.btnMarginBottom]}
                                itemStyle={styles.btnSize} label="确认"
                                onPress={this._callSellerPhone.bind(this)} />
                        </View>
                    </View>
                </Modal>

                <Modal visible={callInfo.get('errorTipVisible')} transparent={true} onModalVisibilityChanged={this.props.actions.setErrorTipVisible}>
                    <View style={styles.bgWrap}>
                        <View style={styles.contentContainer}>
                            <TouchableHighlight
                                style={styles.closeBox}
                                underlayColor="#fff"
                                onPress={this.props.actions.setErrorTipVisible.bind(null, false)}
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
                                onPress={this._goPage.bind(this, HouseInputContainer)}
                            >
                                <Text style={{color: "#04C1AE", textAlign: "center"}}>去发房</Text>
                            </TouchableHighlight>
                            {/*
                             <TouchableHighlight
                                 style={[styles.btn, styles.borderBtn, styles.margin]}
                                 underlayColor="#fff"
                                 onPress={this._goPage.bind(this, UserContainer)}
                             >
                                 <Text style={{color: "#04C1AE", textAlign: "center"}}>去充值</Text>
                             </TouchableHighlight>
                            */}

                        </View>
                    </View>
                </Modal>

                <Modal visible={callInfo.get('feedbackVisible')} transparent={true} onModalVisibilityChanged={this.props.actions.setFeedbackVisible}>
                    <View style={styles.bgWrap}>
                        <View style={styles.contentContainer}>
                            <Text style={[styles.modalTitle, styles.baseColor]}>通话反馈</Text>
                            <Text style={[styles.smallTip, styles.baseColor]}>确认在卖后将获得房东电话</Text>

                            <TouchableHighlight
                                style={[styles.btn, styles.borderBtn]}
                                underlayColor="#fff"
                                onPress={this._callFeedback.bind(this, callInfo.get('washId'), 1)}
                            >
                                <Text style={{color: "#04C1AE", textAlign: "center"}}>在卖</Text>
                            </TouchableHighlight>

                            <View style={styles.hLine}></View>

                            <Text style={[styles.smallTip, styles.baseColor]}>联系不上或虚假房源将返还本次积分</Text>

                            <TouchableHighlight
                                style={[styles.btn, styles.borderBtn]}
                                underlayColor="#fff"
                                onPress={this._callFeedback.bind(this, callInfo.get('washId'), 3)}
                            >
                                <Text style={{color: "#04C1AE", textAlign: "center"}}>联系不上</Text>
                            </TouchableHighlight>

                            <TouchableHighlight
                                style={[styles.btn, styles.borderBtn, styles.margin]}
                                underlayColor="#fff"
                                onPress={this._callFeedback.bind(this, callInfo.get('washId'), 2)}
                            >
                                <Text style={{color: "#04C1AE", textAlign: "center"}}>虚假/不卖/已卖</Text>
                            </TouchableHighlight>

                        </View>
                    </View>
                </Modal>

                <ListView
                    dataSource={ds.cloneWithRows(houseList.toArray())}
                    renderRow={this._renderRow}
                    initialListSize={5}
                    pageSize={5}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
                    style={styles.listView}
                />

                <View style={styles.contactWrap}>
                    <TouchableHighlight
                        style={styles.contactButton}
                        underlayColor="#04c1ae"
                        onPress={this._clickPhoneBtn.bind(this, status, info.get('seller_phone'), callInfo.get('sellerPhone'))}
                    >
                        <View style={{flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
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
            </View>
        );
    }

    componentDidMount() {
        let {actions, route, baseInfo} = this.props;
        let propertyId = route.item.get('property_id');
        let info = baseInfo.get("baseInfo");

        InteractionManager.runAfterInteractions(() => {
            actions.fetchBaseInfo({
                property_id: propertyId
            });
            actions.fetchSimilarHouseList({
                property_id: propertyId
            });
            actions.fetchHouseStatus({
                property_id: propertyId
            });

            if(info.get("is_reply") === false) {
                actions.callSellerSuccess(info.get("log_id"));
                actions.setFeedbackVisible(true);
            }
        });
    }

    componentWillUnmount() {
        this.props.actions.clearHouseDetailPage();
    }

    _goPage(component) {
        this.props.actions.setErrorTipVisible(false);

        let {navigator} = this.props;
        navigator.push({
            component: component,
            name: 'publishHouse',
            title: '发布房源',
            hideHeader: true,
            hideNavBar: false
        });
    }

    _clickPhoneBtn(status, phone, hasPhone) {
        if(status || hasPhone) { //1: 已解锁
            let url = "tel:" + phone;

            Linking.canOpenURL(url).then(supported => {
                if (!supported) {
                    Alert.alert('温馨提示', '您的设备不支持打电话功能', [{text: '确定'}]);
                } else {
                    return Linking.openURL(url);
                }
            }).catch(err => console.error('An error occurred', err));
        } else {   //0: 未解锁
            this.props.actions.setScoreTipVisible(true);
        }
    }

    _callSellerPhone() {
        this.props.actions.setScoreTipVisible(false);
        this.props.actions.callSeller(this.props.route.item.get("property_id"));
    }

    _callFeedback(id, status) {
        this.props.actions.callFeedback({
            wash_id: id,
            status: status
        });
    }

    _renderRow = (rowData: any) => {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        );
    };

    _renderFooter = () => {
        let {sameCommunityList} = this.props;
        let houseList = sameCommunityList.get('properties');
        return (
            houseList.size > 0 ?
            <View style={styles.moreWrap}>
                <TouchableHighlight
                    style={styles.moreButton}
                    underlayColor="#fff"
                    onPress={this._handleMoreHouseList}
                >
                    <Text style={styles.moreText}>
                        查看更多
                    </Text>
                </TouchableHighlight>
            </View>
            :
            null
        )
    };

    _renderHeader = () => {
        let { baseInfo, route, sameCommunityList } = this.props;
        let houseList = sameCommunityList.get('properties');
        return (
            <View>
                <BaseInfo info={baseInfo} route={route} />
                {
                    houseList.size > 0 ? <View style={[styles.gap, styles.flex]}></View>: null
                }
                {
                    houseList.size > 0 ?
                    <View style={[styles.itemContainer, styles.row]}>
                        <Text style={styles.bar}></Text>
                        <Text style={[styles.baseSize, styles.baseColor]}>同小区房源</Text>
                    </View>
                    : null
                }
            </View>
        )
    };

    _onItemPress = (item) => {
        let {navigator} = this.props;

        navigator.replace({
            component: DetailContainer,
            name: 'houseDetail',
            title: '房源详情',
            hideNavBar: false,
            item
        });
    };

    _handleMoreHouseList = () => {
        let {route, navigator, actionsHouseList} = this.props;
        let {item} = route, routeArr = navigator.getCurrentRoutes(), preRoute = routeArr[routeArr.length - 2];

        actionsHouseList.filterCommunityNameChanged(item.get('community_id'), item.get('community_name'));
        actionsHouseList.fetchHouseList({
             page: 1,
             community_id: item.get('community_id')
         });
        if(preRoute.name && preRoute.name == "houseList") {
            navigator.pop();
        } else {
            navigator.push({
                component: HouseListContainer,
                name: 'houseList',
                title: '房源列表',
                hideNavBar: true,
                communityName: item.get('community_name'),
                communityId: item.get('community_id')
            });
        }
    };
}

class BaseInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {info, route} = this.props;
        let houseInfo = route.item;
        let baseInfo = info.get('baseInfo');
        let status = info.get('status');

        let statusList = status.map((s, i) => {
            return (
                <Text key={i} style={styles.statusList}>{s.get('time')} {s.get('name')}{s.get('status')}</Text>
            );
        });
        return (
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <View style={[styles.row, styles.name]}>
                        <Text numberOfLines={1} style={[styles.baseColor, {fontSize: 19, flex: 1}]}>{houseInfo.get('community_name') || ''} {houseInfo.get('building_num') || ''}{houseInfo.get('building_unit') || ''}{houseInfo.get('door_num') || ''}室</Text>
                        <Text style={{fontSize: 12, width: 68, color: '#8d8c92'}}>查看次数:{baseInfo.get('see_count')}</Text>
                    </View>
                    <Text style={[styles.baseSize, styles.baseColor]}>{houseInfo.get('district_name') || baseInfo.get('district_name') || ''}-{houseInfo.get('block_name') || baseInfo.get('block_name') || ''}<Text style={styles.baseSpace}>{houseInfo.get('community_address') || baseInfo.get('community_address') || ''}</Text></Text>
                </View>

                <View style={[styles.itemContainer, styles.row]}>
                    <Text style={[styles.baseSize, styles.baseColor]}>户型:</Text>
                    <Text style={[styles.baseSize, styles.baseColor, styles.baseSpace]}>{houseInfo.get('bedrooms') || ''}室{houseInfo.get('living_rooms') || ''}厅{houseInfo.get('bathrooms') || ''}卫</Text>
                </View>
                <View style={[styles.itemContainer, styles.row]}>
                    <Text style={[styles.baseSize, styles.baseColor]}>面积:</Text>
                    <Text style={[styles.baseSize, styles.baseColor, styles.baseSpace]}>{houseInfo.get('area') || ''}m²</Text>
                </View>
                <View style={[styles.itemContainer, styles.row]}><Text style={[styles.baseSize, styles.baseColor]}>总价:</Text><Text style={[styles.baseSize, styles.baseColor, styles.baseSpace]}>{houseInfo.get('price') || ''}万</Text></View>
                <View style={[styles.itemContainer, styles.row]}><Text style={[styles.baseSize, styles.baseColor]}>单价:</Text><Text style={[styles.baseSize, styles.baseColor, styles.baseSpace]}>{baseInfo.get('avg_price') || ''}元/m²</Text></View>
                <View style={styles.itemContainer}>
                    <View style={styles.row}><Text style={[styles.baseSize, styles.baseColor]}>状态:</Text><Text style={[styles.baseSize, styles.baseSpace, {color: '#ff6d4b'}]}>{baseInfo.get('status') || ''}</Text></View>
                    {statusList}
                </View>

                <View style={[styles.itemContainer, styles.row]}>
                    <Image style={styles.money_icon} source={require('../images/money.png')}/>
                    <Text style={[styles.baseColor, {fontSize: 15, marginLeft: 6}]}>查看房东电话需要消耗 {baseInfo.get('unlock_phone_cost')} 积分</Text>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    listView: {
        marginBottom: 70
    },
    container: {
        flex: 1
    },
    itemContainer: {
        borderBottomWidth: 1/PixelRatio.get(),
        borderStyle: 'solid',
        borderBottomColor: '#d9d9d9',
        padding: 15
    },
    baseColor: {
        color: "#3e3e3e"
    },
    baseSize: {
        fontSize: 16
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center"
    },
    flex: {
        flex: 1
    },
    name: {
        justifyContent: 'space-between',
        marginBottom: 10
    },
    baseSpace: {
        marginLeft: 12
    },
    statusList: {
        fontSize: 12,
        color: '#8d8c92',
        marginTop: 8
    },
    money_icon: {
        width: 18,
        height: 18
    },
    bar: {
        width: 3,
        height: 15,
        backgroundColor: '#04C1AE',
        marginRight: 8,
        borderRadius: 2
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
    },
    contactButton: {
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5,
        position: 'absolute',
        bottom: 10,
        left: 15,
        right: 15,
    },
    contactText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    },
    moreWrap: {
        padding: 15,
        paddingBottom: 0
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
    gap: {
        height: 15,
        backgroundColor: '#eee'
    },
    phoneIcon: {
        width: 20,
        height: 20
    },
    bgWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    contentContainer: {
        width: 270,
        borderRadius: 5,
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
        fontSize: 16
    },
    btn: {
        width: 170,
        height: 30,
        justifyContent: "center",
        borderRadius: 5
    },
    btnMarginBottom: {
        marginBottom: 18
    },
    btnSize: {
        fontSize: 16
    },
    borderBtn: {
        borderWidth: 1,
        borderColor: "#d9d9d9",
        marginBottom: 10
    },
    modalTitle: {
        fontSize: 19
    },
    smallTip: {
        fontSize: 12,
        marginTop: 13,
        marginBottom: 13
    },
    hLine: {
        width: 230,
        borderBottomWidth: 1,
        borderColor: "#d9d9d9"
    }
});