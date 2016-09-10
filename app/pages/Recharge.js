import {
    React, Component,
    Text, View, ScrollView, Image,
    TouchableWithoutFeedback, TouchableHighlight,
    StyleSheet, PixelRatio, Platform,
    Alert
} from 'nuke';

var Alipay = require('react-native').NativeModules.Alipay;

import { NativeAppEventEmitter, DeviceEventEmitter, ToastAndroid } from 'react-native';

import RechargeSuccessContainer from "../containers/RechargeSuccessContainer";
import {tradeService, resultService} from '../service/payService';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class Recharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 50
        };

        this.pageId = actionType.BA_DEPOSIT;
        this.tradeId = '';
        this.submitStatus = true;
        this.points = [{price: 50, action: 'BA_DEPOSIT_TEN'}, {price: 100, action: 'BA_DEPOSIT_TWENTY'}, {price: 200, action: 'BA_DEPOSIT_FIFTY'}];
        ActionUtil.setActionWithExtend(actionType.BA_DEPOSIT_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let priceBox = [];
        for(let i = 0; i < this.points.length; i++) {
            let obj = this.points[i];
            priceBox.push(
                <TouchableWithoutFeedback key={i} onPress={() => this.choosePrice(obj.price, actionType[obj.action])}>
                    <View style={[styles.priceItem, this.state.price == obj.price ? styles.selectedBorder: null, i == this.points.length - 1 ? {marginRight: 0} : null]}>
                        <Text style={this.state.price == obj.price ? styles.selectedFont: null}>{obj.price}积分</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        return (
            <ScrollView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
            >
                <View style={styles.choiceBox}>
                    <Text>选择充值面额</Text>
                    <View style={styles.priceBox}>
                        {priceBox}
                    </View>
                </View>
                <View style={styles.payWay}>
                    <View style={styles.payLeft}>
                        <Image source={require('../images/alipaylogo.png')} style={styles.aliImage} />
                        <Text>支付宝支付: <Text style={styles.colorRed}>{this.state.price}元</Text></Text>
                    </View>
                    <Image source={require('../images/paySelected.png')} style={styles.payWayImage} />
                </View>
                <TouchableHighlight underlayColor='transparent' style={styles.submitButton} onPress={this.submitPrice}>
                    <View style={styles.submitBox}>
                        <Text style={styles.submitFont}>立即充值</Text>
                    </View>
                </TouchableHighlight>

            </ScrollView>
        )
    }

    componentWillMount() {
        let self = this;
        let eventEmitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
        this.results = eventEmitter.addListener(
            'ChargeEventReminder',
            (data) => {
                let result = {};
                self.submitStatus = true;
                if(Platform.OS != 'ios') {
                    let splitResults = data.split(';');
                    let resultsToJson = {};
                    for(var i = 0; i < splitResults.length; i++) {
                        let item = splitResults[i].split('=');
                        resultsToJson[item[0]] = item[1].replace(/\{|\}/g, "");
                    }
                    result = resultsToJson;
                } else {
                    result = data.resultDic;
                }
                let notifyData = Object.assign({}, result, {out_trade_no: self.tradeId});
                resultService({body:notifyData}).then(() => {}).catch(() => {});

                if(result.resultStatus != 9000) {
                    Alert.alert('', '支付失败，请稍后重试',
                        [{
                            text: '确定', onPress: () => {
                                ActionUtil.setAction(actionType.BA_DEPOSIT_KNOW);
                            }
                        }]
                    );
                } else {
                    this.results && this.results.remove();
                    this.props.navigator.push({
                        component: RechargeSuccessContainer,
                        name: 'success',
                        price: this.state.price,
                        title: '充值成功',
                        bp: this.pageId,
                        hideNavBar: true
                    });
                }
            }
        );
    }

    componentWillUnmount() {
        this.results && this.results.remove();
    }

    choosePrice(score, log) {
        this.setState({price: score});
        ActionUtil.setAction(log);
    }

    submitPrice = () => {
        if(!this.submitStatus) return;
        this.submitStatus = false;
        let self = this;
        let {actionsApp} = this.props;
        actionsApp.appLoadingChanged(true);
        ActionUtil.setAction(actionType.BA_DEPOSIT_GO);
        let data = {
            subject: '第一房源积分充值',
            body: '第一房源'+this.state.price+'积分充值',
            total_fee: this.state.price,
            pay_type: 1
        };

        tradeService({body:data})
        .then((oData) => {
            actionsApp.appLoadingChanged(false);
            self.tradeId = oData.out_trade_no;
            Alipay.addEvent(oData.data, 'Charge');
        })
        .catch((data) => {
            if(data && data.type && data.type == "1") {
                actionsApp.verifiedNoticeSet({
                    visible: true,
                    msg: "您的身份未通过认证\n请重新上传身份信息",
                    from: "detail",
                    hideClose: true
                });
            } else if (data && data.codeStatus == 401) {
                data.visible = true;
                actionsApp.webAuthentication(data);
            } else {
                actionsApp.appLoadingChanged(false);
                ToastAndroid.show('操作太频繁，请重试', ToastAndroid.LONG);
                this.submitStatus = true;
            }
        })

    };
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee',
    },
    choiceBox: {
        padding: 15
    },
    priceBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    priceItem: {
        flex: 1,
        marginRight: 8,
        height: 50,
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#ccc',
        backgroundColor: '#fff',
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedBorder: {
        borderColor: '#04c1ae'
    },
    selectedFont: {
        color: '#04c1ae'
    },
    payWay: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#d9d9d9'
    },
    payLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    colorRed: {
        color: '#ff6d4b'
    },
    aliImage: {
        marginRight: 8,
        width: 27,
        height: 27
    },
    payWayImage: {
        width: 21,
        height: 21
    },
    submitButton: {
        margin: 20,
        marginTop: 45
    },
    submitBox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5
    },
    submitFont: {
        color: '#fff',
        fontSize: 19
    }
});
