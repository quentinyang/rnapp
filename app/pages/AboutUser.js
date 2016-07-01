'use strict';

import {
    React,
    Component,
    Text,
    View,
    ListView,
    Image,
    Alert,
    TouchableHighlight,
    PixelRatio,
    Platform,
    StyleSheet,
    InteractionManager
} from 'nuke';

import AboutEXPContainer from '../containers/AboutEXPContainer';
import TitleBar from '../components/TitleBar';
import Immutable from 'immutable';
import {formatDate} from '../utils/CommonUtils';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !immutable.is(r1, r2)});

export default class AboutUser extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ListView
                dataSource={ds.cloneWithRows(this.props.properties.toArray())}
                renderHeader={this._renderHeader}
                renderRow={this._renderRow}
                onEndReached={this._onEndReached}
                onEndReachedThreshold={50}
                enableEmptySections={true}
            />
        );
    }

    componentWillMount() {
        let {actions, pager} = this.props;
        this.getHouseList(1);
    }

    componentWillUnmount() {
        this.props.actions.userInputHouseCleared();
    }

    _renderHeader = () => {
        return (
            <View style={styles.container}>
                <UserSection navigator={this.props.navigator} userInfo={this.props.userInfo} />
                <HouseSection />
            </View>
        );
    };

    _renderRow = (rowData, secId, rowId, highlightRow) => {
        let date = formatDate(rowData.get('created_at'));
        return (
            <View style={styles.houseItem}>
                <Text style={{width: 80}}>{date.month}月{date.day}日</Text>
                <View style={styles.flex}>
                    <Text style={{fontWeight: '500'}}>{rowData.get('community_name')} {rowData.get('building_num') + rowData.get('building_unit') + rowData.get('door_num')}室</Text>
                    <Text style={{fontSize: 12, marginTop: 2}}>{rowData.get('bedrooms')}室{rowData.get('living_roooms')}厅{rowData.get('bathrooms')}卫 {rowData.get('area')}平 {rowData.get('price')}万</Text>
                    <Text style={{fontSize: 12, color: '#8d8c92', marginTop: 2}}>{rowData.get('district_name')}-{rowData.get('block_name')} {rowData.get('community_address')}</Text>
                </View>
            </View>
        );
    };

    _onEndReached = () => {
        let {pager, actions} = this.props;
        if(pager.get('total') > pager.get('page')*pager.get('per_page')) {
            this.getHouseList(Number(pager.get('page')) + 1);
        }
    };

    getHouseList = (page) => {
        InteractionManager.runAfterInteractions(() => {
            this.props.actions.fetchUserInputHouse({
                page: page,
                user_id: 3
            });
        });
    };




}

class UserSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.basicBox}>
                <View style={styles.center}>
                    <View style={[styles.avatarBox, styles.center]}>
                        <Image
                            style={styles.avatarImage}
                            source={require('../images/avatar_white.png')}
                        />
                    </View>
                    <Text style={{fontSize: 17}}>155****4568</Text>
                    <View style={[styles.row, styles.resultList]}>
                        <View style={[styles.center, styles.resultItem]}>
                            <Text style={[styles.resultNum]}>{47}</Text>
                            <Text style={styles.smallFont}>累计登录</Text>
                        </View>
                        <View style={styles.vline}></View>
                        <View style={[styles.center, styles.resultItem]}>
                            <Text style={[styles.resultNum]}>{201}</Text>
                            <Text style={styles.smallFont}>已赚积分</Text>
                        </View>
                        <View style={styles.vline}></View>
                        <View style={[styles.center, styles.resultItem]}>
                            <Text style={[styles.resultNum]}>{259}</Text>
                            <Text style={styles.smallFont}>已获经验</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.baseBottom}>
                    <View style={{marginBottom: 6, flexDirection: 'row'}}>
                        <Image source={require('../images/icon/love.png')} style={{width: 17, height: 16, marginRight: 10}} />
                        <Text style={styles.font12} numberOfLines={1}>关注：徐家汇、长寿路、静安寺、中山公园、中山公园、中山公园</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Image source={require('../images/icon/house_light_gray.png')} style={{width: 17, height: 16, marginRight: 10}} />
                        <Text style={styles.font12}>看房：105套</Text>
                    </View>
                </View>
                <TouchableHighlight style={styles.levelBtn} underlayColor='transparent' onPress={() => this.navigatorPush({component: AboutEXPContainer, data: {level: '1', exp: '12', name: 'exp', title: '我的等级'}})}>
                    <View style={[styles.level, styles.center]}><Text style={styles.whiteText}>V1会员</Text></View>
                </TouchableHighlight>
            </View>
        );
    }

    navigatorPush = (opt) => {
        this.props.navigator.push(opt);
    };
}

class HouseSection extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <View style={styles.houseBox}>
                <TitleBar title="Ta发的房源" />
                <View style={styles.inputResult}>
                    <Text>累计发房：47</Text>
                    <Text>发房在卖率：58%</Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8'
    },
    flex: {
        flex: 1
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    font12: {
        flex: 1,
        fontSize: 12
    },
    basicBox: {
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    avatarBox: {
        marginBottom: 12,
        width: 60,
        height: 60,
        backgroundColor: '#04c1ae',
        borderRadius: 30
    },
    avatarImage: {
        width: 36,
        height: 36
    },
    vline: {
        marginTop: 8,
        height: 30,
        width: 1,
        backgroundColor: '#ccc'
    },
    resultList: {
        marginVertical: 20
    },
    resultItem: {
        marginHorizontal: 30
    },
    resultNum: {
        fontSize: 17
    },
    smallFont: {
        fontSize: 12,
        color: '#8d8c92'
    },
    baseBottom: {
        padding: 10,
        backgroundColor: '#fff',
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9',
        borderRadius: 3
    },
    houseBox: {
        backgroundColor: '#fff',
    },
    inputResult: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        paddingHorizontal: 15,
        height: 50,
        backgroundColor: '#f8f8f8',
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9',
        borderRadius: 3
    },
    levelBtn: {
        position: 'absolute',
        top: 30,
        right: 0
    },
    level: {
        width: 80,
        height: 30,
        backgroundColor: '#ffa251',
        borderColor: '#fff',
        borderWidth: 1/PixelRatio.get(),
        borderRightWidth: 0,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    whiteText: {
        color: '#fff'
    },
    houseItem: {
        padding: 15,
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9',
        flexDirection: 'row',
        alignItems: 'flex-start'
    }
});
