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
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !immutable.is(r1, r2)});

export default class Welfare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0
        };
        if(this.props.route.callbackFun) {
            this.props.route.callbackFun = () => {
                this.props.navigator.pop();
                this.props.homeActions.setRuleModalVisible(true);
            }
        }
        this.tabs = ['未使用', '已使用', '已过期'];
    }

    render() {
        return (
            <ListView
                style={styles.container}
                dataSource={ds.cloneWithRows(this.props.welfareInfo.get('list').toArray())}
                renderHeader={this._renderHeader}
                renderRow={this._renderRow}
                enableEmptySections={true}
            />
        );
    }

    _renderHeader = () => {
        return (
            <Wtabs current={this.state.current} tabs={this.tabs} onPress={this.tabClick} />
        )
    };

    _renderRow = (rowData, secId, rowId, highlightRow) => {
        return (
            <View style={styles.cardSection}>
                {/*<NoCoupon current={this.state.current} tabs={tabs} />*/}
                <Card item={rowData} />
            </View>
        );
    }

    componentWillMount() {
        let {actions, welfareInfo} = this.props;
        let pager = welfareInfo.get('pager');

        InteractionManager.runAfterInteractions(() => {
            actions.fetchWelfareList({
                page: 1,
                status: 1
            });
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    tabClick = (index) => {
        if(index != this.state.current) {
            this.setState({current: index});
        }
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
                        <TouchableHighlight onPress={() => this.props.onPress(index)} key={index} underlayColor='transparent'>
                            <View style={[styles.tabsItem, styles.center, this.props.current == index ? styles.tabsActive:{}]}>
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
                <Image source={require('../images/coupon.png')}  style={styles.coupon} />
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