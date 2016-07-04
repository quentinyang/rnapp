import {
    React,
    Component,
    View,
    Text,
    TouchableHighlight,
    ListView,
    Image,
    StyleSheet,
    InteractionManager
} from 'nuke';

import Card from '../components/WelfareCard';
let ActionUtil = require('../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !immutable.is(r1, r2)});

export default class Welfare extends Component {
    constructor(props) {
        super(props);

        if (this.props.route.callbackFun) {
            this.props.route.callbackFun = () => {
                this.props.navigator.pop();
                this.props.homeActions.setRuleModalVisible(true);
            }
        }
        this.tabs = ['未使用', '已使用', '已过期'];
        this.status = [1, 2, 3];

        this.pageId = actionType.BA_MINE_WELFARE;
    }

    render() {
        return (
            <ListView
                style={styles.container}
                dataSource={ds.cloneWithRows(this.props.list.toArray())}
                renderHeader={this._renderHeader}
                renderRow={this._renderRow}
                renderFooter={this._renderFooter}
                onEndReached={this._onEndReached}
                onEndReachedThreshold={50}
                enableEmptySections={true}
            />
        );
    }

    componentWillMount() {
        let {actions, pager} = this.props;
        this.getWelfareList(1, 1);
    }

    componentWillUnmount() {
        this.props.actions.welfareListCleared();
    }

    _renderHeader = () => {
        return (
            <Wtabs current={this.props.current} tabs={this.tabs} onPress={this.tabClick}/>
        )
    };

    _renderRow = (rowData, secId, rowId, highlightRow) => {
        return (
            <View style={styles.cardSection}>
                <Card item={rowData}/>
            </View>
        );
    };

    _renderFooter = () => {
        let {pager, current} = this.props;
        if (pager.get('total') == 0) {
            return <NoCoupon current={current} tabs={this.tabs}/>
        } else if (pager.get('total') > pager.get('page') * pager.get('per_page')) {
            return <Text style={{textAlign: 'center'}}>加载中...</Text>
        }
    };

    _onEndReached = () => {
        let {pager, current, actions} = this.props;

        if (pager.get('total') > pager.get('page') * pager.get('per_page')) {
            this.getWelfareList(Number(pager.get('page')) + 1, this.status[current]);
        }
    };

    tabClick = (index) => {
        let {actions, current} = this.props;

        if (index != current) {
            switch (this.status[index]) {
                case 1:
                    ActionUtil.setAction(actionType.BA_MINE_WELFARE_NOUSE_ONVIEW);
                    break;
                case 2:
                    ActionUtil.setAction(actionType.BA_MINE_WELFARE_USED_ONVIEW);
                    break;
                case 3:
                    ActionUtil.setAction(actionType.BA_MINE_WELFARE_OVERDUE_ONVIEW);
                    break;
            }
            actions.welfareStatusChanged(index);
            this.getWelfareList(1, this.status[index]);
        }
    };

    getWelfareList = (page, status) => {
        InteractionManager.runAfterInteractions(() => {
            this.props.actions.fetchWelfareList({
                page: page,
                status: status
            });
        });
    };
}

class Wtabs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.tabSection, styles.center]}>
                {this.props.tabs.map((value, index) => {
                    return (
                        <TouchableHighlight onPress={() => this.props.onPress(index)} key={index}
                                            underlayColor='transparent'>
                            <View
                                style={[styles.tabsItem, styles.center, this.props.current == index ? styles.tabsActive:{}]}>
                                <Text style={this.props.current == index ? styles.tabsFontActive: {}}>{value}</Text>
                            </View>
                        </TouchableHighlight>
                    );
                })}
            </View>
        );
    }
}

class NoCoupon extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.noCouponBox, styles.center]}>
                <Image source={require('../images/coupon.png')} style={styles.coupon}/>
                <Text>您当前没有{this.props.tabs[this.props.current]}的福利卡</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardSection: {
        paddingHorizontal: 19,
        paddingBottom: 19
    },
    tabSection: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
        paddingHorizontal: 25,
        height: 48,
        backgroundColor: '#f8f8f8'
    },
    tabsItem: {
        marginHorizontal: 25,
        paddingHorizontal: 5,
        height: 48
    },
    tabsActive: {
        height: 46,
        borderBottomWidth: 2,
        borderColor: '#ff6d4b',
    },
    tabsFontActive: {
        marginTop: 1,
        color: '#ff6d4b'
    },
    noCouponBox: {
        paddingVertical: 90
    },
    coupon: {
        marginBottom: 25,
        width: 100,
        height: 67
    }
});