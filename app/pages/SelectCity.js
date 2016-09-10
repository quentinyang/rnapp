'use strict';

import {
    React,
    Component,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    TouchableWithoutFeedback,
    StyleSheet,
    Image,
    InteractionManager,
    PixelRatio
} from 'nuke';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import AttentionBlockSetContainer from '../containers/AttentionBlockSetContainer';
import TabViewContainer from '../containers/TabViewContainer';
import {setCityService} from '../service/blockService';

export default class SelectCity extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        this.props.actions.curCityChanged({});
    }
    render() {
        let { cityInfo } = this.props;
        let cityList = cityInfo.get('cityList'), curCity = cityInfo.get('curCity');

        let listView = null;
        listView = cityList.map((item, index) => {
            return (
                <CityItem
                    key={index}
                    item={item}
                    isCur={item.get('id') == curCity.get('id')}
                    changeCity={this._changeCity.bind(this)}
                />
            );
        });

        return (
            <ScrollView style={styles.container}>
                {listView}

                <TouchableHighlight
                    style={[styles.btn]}
                    underlayColor='#04C1AE'
                    onPress={this._citySubmit.bind(this)}
                >
                    <View style={[styles.flex, styles.alignItems, styles.justifyContent]}>
                        <Text style={styles.btnText}>确定</Text>
                    </View>
                </TouchableHighlight>
            </ScrollView>
        )
    }

    componentDidMount() {
        let {pager, actions} = this.props;
        InteractionManager.runAfterInteractions(() => {
            actions.getCityList();
        });
    }

    _citySubmit() {
        let {cityInfo, userData, actionsApp, navigator} = this.props;
        let curCity = cityInfo.get('curCity');
        setCityService({
            id: curCity.get('id')
        }).then(() => {
            ActionUtil.setActionWithExtend(actionType.BA_LOGIN_CITY, {"ccid": curCity.get("id")});

            actionsApp.curCityChanged(curCity);
            if(!userData.get('setAttention')) {
                navigator.push({
                    component: AttentionBlockSetContainer,
                    name: 'attentionBlock',
                    title: '',
                    hideNavBar: false
                });
            } else {
                navigator.push({
                    component: TabViewContainer,
                    name: 'home',
                    title: '首页',
                    hideNavBar: true,
                    index: 0
                });
            }
        }).catch(() => {
            if(!userData.get('setAttention')) {
                navigator.push({
                    component: AttentionBlockSetContainer,
                    name: 'attentionBlock',
                    title: '',
                    hideNavBar: false
                });
            } else {
                navigator.push({
                    component: TabViewContainer,
                    name: 'home',
                    title: '首页',
                    hideNavBar: true,
                    index: 0
                });
            }
        });
    }
    _changeCity(item) {
        this.props.actions.curCityChanged(item);
    }
}

class CityItem extends Component {
    render() {
        let {item, isCur, changeCity} = this.props;
        return (
            <TouchableWithoutFeedback
                onPress={() => {changeCity(item)}}
            >
                <View style={[styles.row, styles.alignItems, styles.justifyBetween, styles.itemBox]}>
                    <Text style={isCur ? styles.orange : {}}>{item.get('name')}</Text>
                    {
                        isCur ? 
                        <Image
                            style={styles.mark}
                            source={require("../images/mark.png")}
                        /> : null
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    }
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
    justifyBetween: {
        justifyContent: 'space-between'
    },
    orange: {
        color: '#FF6D4B'
    },
    container: {
        paddingVertical: 15,
        backgroundColor: '#EEEEEE'
    },
    itemBox: {
        height: 47,
        paddingLeft: 15,
        paddingRight: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#D9D9D9'
    },
    mark: {
        width: 17,
        height: 12
    },
    btn: {
        height: 40,
        borderRadius: 5,
        marginHorizontal: 22,
        marginTop: 40,
        backgroundColor: '#04C1AE'
    },
    btnText: {
        fontSize: 19,
        color: '#fff',
        letterSpacing: 5
    }
});