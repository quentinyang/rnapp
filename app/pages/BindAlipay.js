import {
    React, Component,
    Text, View, ScrollView, Image,
    TouchableHighlight,
    StyleSheet, PixelRatio, Platform,
    Alert
} from 'nuke';

var Alipay = require('react-native').NativeModules.Alipay;

import { NativeAppEventEmitter, DeviceEventEmitter, ToastAndroid } from 'react-native';

import WithdrawContainer from '../containers/WithdrawContainer';
import PaySection from '../components/PaySection';
import {tradeService, resultService} from '../service/payService';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class BindAlipay extends Component {
    constructor(props) {
        super(props);

        this.submitStatus = true;
        this.bindPrice = 1;
        this.tradeId = '';
    }

    render() {

        return (
            <ScrollView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
            >
                <View style={[styles.bindInstruction, styles.center]}>
                    <Text style={styles.instructFont}>充值<Text style={[styles.instructFont, styles.colorOrange]}>{this.bindPrice}</Text>积分</Text>
                    <Text style={styles.instructFont}>已绑定提现支付宝账号</Text>
                </View>

                <PaySection price={this.bindPrice} />

                <TouchableHighlight underlayColor='transparent' style={styles.submitButton} onPress={this.submitPrice}>
                    <View style={styles.submitBox}>
                        <Text style={styles.submitFont}>确定</Text>
                    </View>
                </TouchableHighlight>

            </ScrollView>
        )
    }

    componentWillMount() {
        let self = this;
        let eventEmitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
        this.results = eventEmitter.addListener(
            'EventReminder',
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
                    this.props.navigator.replace({
                        component: WithdrawContainer,
                        name: 'withdraw',
                        price: this.bindPrice,
                        title: '提现',
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

    submitPrice = () => {
        if(!this.submitStatus) return;
        this.submitStatus = false;
        ActionUtil.setAction(actionType.BA_DEPOSIT_GO);
        let data = {
            subject: '绑定支付宝',
            body: '第一房源绑定支付宝',
            total_fee: this.bindPrice,
            pay_type: 1
        };

        tradeService({body:data})
        .then((oData) => {
            this.tradeId = oData.out_trade_no;
            Alipay.addEvent(oData.data);
        })
        .catch((data) => {
            ToastAndroid.show('操作太频繁，请重试', ToastAndroid.LONG);
            this.submitStatus = true;
        })
    };
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee',
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    bindInstruction: {
        paddingHorizontal: 15,
        paddingTop: 40,
        paddingBottom: 35
    },
    instructFont: {
        fontSize: 19
    },
    colorOrange: {
        color: '#ff6d4b'
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
