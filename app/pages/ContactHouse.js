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
        return (
            <View key={rowID}>
                <ContactItem item={rowData} onItemPress={this._onItemPress}/>
                <TouchableHighlight onPress={() => {this._applyToRefund(1)}} underlayColor="transparent">
                    <View style={[styles.applyBtn, styles.center]}>
                        <Text style={[styles.fontSmall, styles.greenColor]}>申请退积分</Text>
                    </View>
                </TouchableHighlight>
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

    _applyToRefund = (status, id = '') => {
        let {actions, navigator} = this.props;
        switch(status) {
            case 1:
                actions.tooEarlyVisibleChanged(true);
                break;
            case 2:
                Toast.show('客服已再次确认房源在卖\n不可再退积分', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER
                });
                break;
            case 3:
                Toast.show('查看房源10天后\n不可再申请退积分', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER
                });
                break;
            case 4:
                navigator.push({
                    component: BackScoreContainer,
                    name: 'backScore',
                    title: '申请退积分',
                    hideHeader: false,
                    hideNavBar: false,
                    bp: this.pageId,
                    washId: id,
                    propertyId: ''
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
                            <Text style={styles.modalContentWord}>{3}天后再来申请退积分</Text>
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
    applyBtn: {
        position: 'absolute',
        right: 15,
        bottom: 20,
        width: 75,
        height: 30,
        borderWidth: 1,
        borderColor: '#04c1ae',
        textAlign: 'center'
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

