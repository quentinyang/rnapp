'use strict';

import {React, Component, Text, View, ListView, StyleSheet, Image,
    TouchableHighlight, Modal, RefreshControl, ActivityIndicator, InteractionManager} from 'nuke';

import ContactItem from '../components/ContactItem';
import DetailContainer from '../containers/DetailContainer';
import BackScoreContainer from '../containers/BackScoreContainer';
import NoNetwork from '../components/NoNetwork';
import Toast from 'react-native-root-toast';
import Immutable, {List} from 'immutable';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});


export default class ContactHouse extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_MINE_CONTACT;
        ActionUtil.setActionWithExtend(actionType.BA_MINE_CONTACT_ONVIEW, {"bp": this.props.route.bp});
        this.state = {
            isRefreshing: false,
            loaded: false
        }
    }

    render() {
        let { houseList, pager, netWork, timeVisible } = this.props;

        return (
            <View style={[styles.flex, styles.bgColor]}>
                {
                    netWork == 'no' && !pager.get('total') ?
                    <NoNetwork onPress={() => {}} />
                    :
                    (Number(pager.get('total')) > 0 ?
                        <ListView
                            style={styles.listViewWrap}
                            dataSource={ds.cloneWithRows(houseList.toArray())}
                            renderRow={this._renderRow}
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
                                tintColor='#ccc'
                                title='松开刷新'
                                colors={['#fff']}
                                progressBackgroundColor='#ccc'
                            />
                        }
                        />
                        :
                        pager.get('total') == 0 ?
                        <View style={[styles.flex, styles.center]}>
                            <Image
                                source={require('../images/no_house_list.png')}
                                style={styles.noHouseList}
                            />
                            <Text style={styles.noHouseListMsg}>暂无数据~~~</Text>
                        </View>:null)
                }
                <TooEarlyModal isVisible={timeVisible} actions={this.props.actions} />
            </View>
        )
    }

    componentDidMount() {
        let {loaded} = this.state;
        let {actions, pager} = this.props;
        if (!loaded) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchContactHouse({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    }

    componentWillUnmount() {
        let {actions} = this.props;
        actions.houseDataCleared();
    }

    _renderRow = (rowData: any, sectionID: number, rowID: number) => {
        let checkStatus = rowData.get('check_status'),
            replyStatus = rowData.get('reply_status'),
            isVerified = rowData.get('is_verify'),
            status = rowData.get('status'),
            past = rowData.get('past'),
            btn,  //'green', 'gray'
            handleBtn,  //'less', 'normal', 'more', 'sell'  'less'小于申诉时间, 'normal'正常, 'more'超时, 'sell'再次确认在卖
            currentStatus;  //'tel', 'score', 'check'

        if(replyStatus == 1) checkStatus = 0;
        if(checkStatus == 1) {  //审核通过，1.隐藏按钮 2.底部显示积分退还
            currentStatus = 'score';
        } else if(checkStatus == 2) {  //审核驳回，1.按钮变灰，弹层提示客服仍确认在卖 2.底部显示手机号
            btn = 'gray';
            handleBtn = 'sell';
            currentStatus = 'tel';
        } else {  //未审核：未提交审核/审核中…，按钮和底部文案需要分开判断
            //按钮
            if(replyStatus != 1) {  //只要没有反馈在卖（包括反馈非在卖状态或者未反馈），申诉按钮都隐藏

            } else {  //反馈在卖
                if(past <= 3) {  //小于申诉时间，按钮绿色，弹层提示小于3天
                    btn = 'green';
                    if(status == 1 || status == 4 || status == 5 || status == 6 || status == 7) {  //房源非在卖
                        handleBtn = 'normal';
                    } else {
                        handleBtn = 'less';
                    }
                } else if(past > 10) {  //超过申诉时间，按钮灰色，弹层提示超过申诉时间
                    btn = 'gray';
                    handleBtn = 'more';
                } else {  //在申诉时间内，按钮绿色，点击跳转
                    btn = 'green';
                    handleBtn = 'normal';
                }
            }

            //底部文案
            if(replyStatus == 0 || replyStatus == 1) {  //底部显示手机号
                currentStatus = 'tel';
            } else {  //底部显示客服审核中
                currentStatus = 'check';
            }
        }

        //房源是否可点

        return (
            <View key={rowID} style={styles.flex}>
                <ContactItem item={rowData} current={currentStatus} onItemPress={this._onItemPress}/>
                {btn == 'green' || btn == 'gray' ?
                <TouchableHighlight style={styles.absolute} onPress={() => {this._applyToRefund(handleBtn, rowData)}} underlayColor="transparent">
                    <View style={[styles.applyBtn, styles.center, btn == 'green' ? styles.greenBorder: styles.grayBorder]}>
                        <Text style={[styles.fontSmall, btn == 'green' ? styles.greenColor : styles.grayColor]}>申请退积分</Text>
                    </View>
                </TouchableHighlight>
                :null}
            </View>
        )
    };

    _onEndReached = () => { // 防止多次重复加载
        let {actions, pager} = this.props;

        if (Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchContactHouse({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    };

    _onRefresh = () => {
        let {actions} = this.props;
        this.setState({isRefreshing: true});

        InteractionManager.runAfterInteractions(() => {
            actions.fetchPrependContactHouse({
                page: 1
            });
        });

        this.setState({isRefreshing: false});
    };

    _onItemPress = (item) => {
        let visible = item.get('visible');

        if(!visible) return;
        ActionUtil.setAction(actionType.BA_MINE_CONTACT_DETAIL);
        let {navigator} = this.props;

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

    _applyToRefund = (status, data) => {
        ActionUtil.setAction(actionType.BA_MINE_CONTACT_CREDIT_BACK);
        let {actions, navigator} = this.props;
        switch(status) {
            case 'less':
                ActionUtil.setAction(actionType.BA_MINE_CONTACT_BOXONVIEW);
                actions.tooEarlyVisibleChanged(true);
                break;
            case 'sell':
                ActionUtil.setAction(actionType.BA_MINE_CONTACT_TOAST_ONE);
                Toast.show('客服已再次确认房源在卖\n不可再退积分', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER
                });
                break;
            case 'more':
                ActionUtil.setAction(actionType.BA_MINE_CONTACT_TOAST_TWO);
                Toast.show('查看房源10天后\n不可再申请退积分', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER
                });
                break;
            case 'normal':
                navigator.push({
                    component: BackScoreContainer,
                    name: 'backScore',
                    title: '申请退积分',
                    from: 'ContactHouse',
                    hideHeader: false,
                    hideNavBar: false,
                    bp: this.pageId,
                    washId: data.get('order_id'),
                    propertyId: data.get('property_id')
                });
                break;
            default:
                console.log('error');
        }
    }
}

class TooEarlyModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isVisible, actions} = this.props;
        return (
            <Modal visible={isVisible} transparent={true} onRequestClose={() => {}}>
                <View style={[styles.flex, styles.center, styles.bgWrap]}>
                    <View style={[styles.contentContainer]}>
                        <View style={styles.center}>
                            <Text style={styles.modalContentWord}>客服已确认房子在卖哦</Text>
                            <Text style={styles.modalContentWord}>再试试联系房东吧</Text>
                            <Text style={styles.modalContentWord}>反馈3天后再来申请退积分</Text>
                        </View>

                        <TouchableHighlight
                                underlayColor="transparent"
                                onPress={() => {actions.tooEarlyVisibleChanged(false)}}
                            >
                            <View style={[styles.knowBtn, styles.center, styles.greenBgColor]}>
                                <Text style={styles.whiteColor}>好的</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}


const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    listViewWrap: {

    },
    bgColor: {
        backgroundColor: "#eee"
    },
    fontSmall: {
        fontSize: 12
    },
    whiteColor: {
        color: '#fff'
    },
    greenColor: {
        color: '#04c1ae'
    },
    greenBgColor: {
        backgroundColor: '#04c1ae'
    },
    greenBorder: {
        borderColor: '#04c1ae'
    },
    grayColor: {
        color: '#ccc'
    },
    grayBorder: {
        borderColor: '#ccc'
    },
    noHouseList: {
        width: 100,
        height: 100,
    },
    noHouseListMsg: {
        fontSize: 15,
        color: '#8d8c92',
        paddingTop: 50
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    absolute: {
        position: 'absolute',
        right: 15,
        bottom: 20,
    },
    applyBtn: {
        width: 75,
        height: 30,
        borderWidth: 1
    },
    knowBtn: {
        marginTop: 15,
        height: 30,
        borderRadius: 5
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
    modalContentWord: {
        fontSize: 15,
        marginTop: 5
    }
});

