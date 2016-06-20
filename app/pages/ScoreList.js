'use strict';

import {
    React,
    Component,
    Text,
    View,
    ListView,
    TouchableHighlight,
    StyleSheet,
    Image,
    InteractionManager,
    PixelRatio,
    Alert,
    TouchableWithoutFeedback
} from 'nuke';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import Immutable, {List} from 'immutable';
import RechargeContainer from '../containers/RechargeContainer'
import WithdrawContainer from '../containers/WithdrawContainer'

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !immutable.is(r1, r2)});

export default class ScoreList extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_MINE_POINTS;
        ActionUtil.setActionWithExtend(actionType.BA_MINE_POINTS_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let { flows } = this.props;
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={ds.cloneWithRows(flows.toArray())}
                    initialListSize={10}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold= {20}
                    pageSize={10}
                    renderHeader={() => this.renderHeader()}
                    renderRow={this.renderRow}
                    renderFooter={() => this.renderFooter()}
                    enableEmptySections={true}
                />
            </View>
        )
    }

    componentDidMount() {
        let {pager, actions} = this.props;
        InteractionManager.runAfterInteractions(() => {
            actions.fetchScoreList({
                page: Number(pager.get('current_page')) + 1
            });
        });
    }

    componentWillUnmount() {
        let {actions} = this.props;
        actions.scoreCleared();
    }

    onEndReached() {
        let {actions, pager} = this.props;

        if (Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchScoreList({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    };

    renderHeader() {
        let {navigator, appConfig, route, money} = this.props;
        let accountData = route.accountData;

        return (
            <View>
                <View style={[styles.totalBox]}>
                    <View style={[styles.justifyContent, styles.alignItems, styles.priceBox]}>
                        <Text style={styles.totalPrice}>{money}<Text style={styles.unit}>分</Text></Text>
                    </View>
                    <CashArea
                        navigator={navigator}
                        accountData = {accountData}
                        appConfig={appConfig}
                    />
                </View>

                <View style={[styles.row, styles.alignItems, styles.titleBox]}>
                    <View style={styles.bar}></View>
                    <Text style={[styles.mediumFont]}>积分明细</Text>
                </View>
            </View>

        );
    }

    renderRow = (rowData: any, sectionID: number, rowID: number) => {
        return (
            <ScoreItem item={rowData} />
        );
    };

    renderFooter() {
        let {pager} = this.props;
        return (
            <Text style={styles.noMore}>
                {Number(pager.get('current_page')) != Number(pager.get('last_page'))?
                    '加载中...':
                    ''
                }
            </Text>
        );
    }
}

class ScoreItem extends Component {
    render() {
        let {item} = this.props;
        return (
            <View style={styles.scoreListBox}>
                <View style={styles.scoreLeft}>
                    <Text style={styles.scoreDesc}>{item.get('method')}</Text>
                    <Text style={styles.scoreTime}>{item.get('time')}</Text>
                </View>
                <View style={styles.scoreRight}>
                    <Text style={styles.scorePrice}>{item.get('money_change')}{parseInt(item.get('money'))}</Text>
                </View>
            </View>
        );
    }
}

class CashArea extends Component {
    render() {
        return (
            <View style={[styles.cashContainer]}>
                <TouchableWithoutFeedback onPress={this._triggerCharge}>
                    <View style={[styles.row, styles.justifyContent, styles.alignItems, styles.flex, styles.cashSplit]}>
                        <Image source={require('../images/recharge.png')} style={[styles.cashImage]}/>
                        <Text style={styles.cashText}>充值</Text>
                    </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={this._triggerWithdraw}>
                    <View style={[styles.row, styles.justifyContent, styles.alignItems, styles.flex]}>
                        <Image source={require('../images/withdraw.png')} style={[styles.cashImage]} />
                        <Text style={styles.cashText} >提现</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }

    _triggerCharge = () => {
        ActionUtil.setAction(actionType.BA_MINE_POINTS_RECHANGE);
        let {navigator, appConfig} = this.props;
        if(appConfig.get('showRecharge')) {
            navigator.push({
                component: RechargeContainer,
                name: 'recharge',
                title: '充值',
                bp: actionType.BA_MINE,
                hideNavBar: false
            });
        } else {
            Alert.alert('温馨提示', '充值功能正在赶过来，敬请期待！', [{text: '忍一忍'}]);
        }
    };

    _triggerWithdraw = () => {
        ActionUtil.setAction(actionType.BA_MINE_POINTS_CASH);
        let {navigator, accountData} = this.props;

        if(parseInt(accountData.score) < parseInt(accountData.min_price)) {
            Alert.alert('', '余额超过' + accountData.min_price + '元才能提现哦', [{text: '知道了'}]);
        } else {
            navigator.push({
                component: WithdrawContainer,
                name: 'withdraw',
                data: accountData,
                title: '提现',
                bp: actionType.BA_MINE,
                backLog: actionType.BA_MINE_CASH_RETURN,
                hideNavBar: false
            });
        }
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    alignItems: {
        alignItems: 'center'
    },
    justifyContent: {
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    totalBox: {
        flexDirection: 'column',
        marginBottom: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff'
    },
    totalTitle: {
        fontSize: 15,
        color: '#8d8c92'
    },
    priceBox: {
        height: 97
    },
    totalPrice: {
        fontSize: 30,
        color: '#04c1ae'
    },
    unit: {
        fontSize: 19,
        color: '#04c1ae'
    },
    titleBox: {
        height: 48,
        padding: 15,
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9',
        backgroundColor: '#fff'
    },
    bar: {
        width: 3,
        height: 15,
        backgroundColor: '#04C1AE',
        marginRight: 8,
        borderRadius: 2
    },
    mediumFont: {
        fontWeight: '500'
    },
    scoreListBox: {
        paddingVertical: 15,
        paddingLeft: 15,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9'
    },
    scoreLeft: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flex: 1
    },
    scoreRight: {
        justifyContent: 'flex-end'
    },
    scoreDesc: {
        marginBottom: 5,
        fontSize: 16,
        color: '#3e3e3e'
    },
    scoreTime: {
        fontSize: 12,
        color: '#8d8c92'
    },
    scorePrice: {
        fontSize: 19,
        fontWeight: '600',
        color: '#3e3e3e'
    },
    noMore: {
        padding: 10,
        fontSize: 12,
        color: '#8d8c92',
        textAlign: 'center'
    },
    // cash area
    cashContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1/PixelRatio.get(),
        borderColor: '#ccc',
        height: 60,
    },
    cashImage: {
        width: 30,
        height: 30,
    },
    cashText: {
        fontSize: 16,
        color: '#3E3E3E',
        marginLeft: 10,
    },
    cashSplit: {
        borderRightWidth: 1/PixelRatio.get(),
        borderColor: '#ccc',
    },
});