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
import WithLabel from '../components/LabelTextInput';
import {tradeService, resultService, realNameService} from '../service/payService';
import Toast from 'react-native-root-toast';

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
        let {route, aliInfo, actions} = this.props;
        return (
            <ScrollView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
            >
                {
                    aliInfo.get('step') == 1 ?
                    <ChargeToBind price={this.bindPrice} /> //未绑定支付宝
                    :null
                }
                {
                    aliInfo.get('step') == 2 ?
                    <TypeName
                        name={aliInfo.get('name')}
                        account={aliInfo.get('alipay_account') || route.data.alipay_account}
                        actions={actions}
                        error={aliInfo.get('err_msg')}
                    /> //绑定成功但未填写真实姓名
                    :null
                }
                {
                    aliInfo.get('step') == 3 ?
                    <AccountRepeated
                        account={aliInfo.get('alipay_account')}
                    /> //绑定支付宝重复
                    :null
                }

                <TouchableHighlight underlayColor='transparent' style={styles.submitButton} onPress={this.handleSubmit}>
                    <View style={[styles.submitBox, styles.center]}>
                        <Text style={styles.submitFont}>确定</Text>
                    </View>
                </TouchableHighlight>
            </ScrollView>
        );
    }

    componentWillMount() {
        let self = this;
        let eventEmitter = Platform.OS === 'ios' ? NativeAppEventEmitter : DeviceEventEmitter;
        let {actions, route} = this.props;
        this.results = eventEmitter.addListener(
            'BindEventReminder',
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
                    Alert.alert('', '绑定失败，请稍后重试',
                        [{
                            text: '确定', onPress: () => {
                                ActionUtil.setAction(actionType.BA_DEPOSIT_KNOW);
                            }
                        }]
                    );
                } else {
                    Toast.show('充值成功', {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER
                    });
                    this.results && this.results.remove();
                    actions.getAlipayStatus({
                        out_trade_no: self.tradeId,
                        resultStatus: result.resultStatus
                    });
                }
            }
        );
        if(route.data.alipay_account) {
            actions.bindStepChanged(2);
        } else {
            actions.bindStepChanged(1);
        }
    }

    componentWillUnmount() {
        this.results && this.results.remove();
        this.props.actionsUser.fetchUserProfile({});
    }

    handleSubmit = () => {
        if(!this.submitStatus) return;
        switch(this.props.aliInfo.get('step')) {
            case 1:
                this.submitPrice();
                break;
            case 2:
                this.submitName();
                break;
            case 3:
                this.goUsercenter();
                break;
            default:
                return null;
        }
    };

    submitPrice = () => {
        this.submitStatus = false;
        ActionUtil.setAction(actionType.BA_DEPOSIT_GO);
        let data = {
            subject: '绑定支付宝',
            body: '第一房源绑定支付宝',
            total_fee: 10,
            pay_type: 1
        };

        tradeService({body:data})
        .then((oData) => {
            this.tradeId = oData.out_trade_no;
            Alipay.addEvent(oData.data, 'Bind');
        })
        .catch((data) => {
            Toast.show(data.msg, {
                duration: Toast.durations.SHORT,
                position: Toast.positions.CENTER
            });
            this.submitStatus = true;
        })
    };

    submitName = () => {
        this.submitStatus = false;
        let {aliInfo, route, navigator, actions} = this.props;
        if(this.verifyName(aliInfo.get('name'))) {
            realNameService({body: {name: aliInfo.get('name')}})
            .then(() => {
                let data = {
                    alipay_account: aliInfo.get('alipay_account'),
                    min_price: route.data.min_price,
                    score: route.data.score
                };
                navigator.replace({
                    component: WithdrawContainer,
                    name: 'withdraw',
                    title: '提现',
                    data: data,
                    bp: this.pageId,
                    hideNavBar: false
                });
            })
            .catch((data) => {
                actions.alipayErrMsg(data.msg);
            })

        } else {
            this.submitStatus = true;
        }
    };

    goUsercenter = () => {
        this.submitStatus = false;
        this.props.navigator.pop();
    };

    verifyName(value) {
        let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,10}$/;
        if(!reg.test(value)) {
            this.props.actions.alipayErrMsg('请输入您的真实姓名');
            return false;
        }
        return true;
    }
}

class ChargeToBind extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <View style={[styles.bindInstruction, styles.center]}>
                    <Text style={styles.instructFont}>充值<Text style={[styles.instructFont, styles.colorOrange]}>{this.props.price}</Text>积分</Text>
                    <Text style={styles.instructFont}>已绑定提现支付宝账号</Text>
                </View>

                <PaySection price={this.props.price} style={{marginBottom: 35}} />
            </View>
        );
    }
}

class TypeName extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View>
                <View style={{padding: 20, paddingTop: 0}}>
                    <Text style={styles.typeNamePrompt}>您已绑定支付宝账号: {this.props.account}</Text>
                    <Text style={styles.instructFont}>请填写真实姓名以完成绑定</Text>
                </View>
                <WithLabel
                    style={styles.typeNameBox}
                    label='真实姓名'
                    defaultValue=''
                    placeholder='该账号对应的真实姓名'
                    underlineColorAndroid = 'transparent'
                    onFocus={() => ActionUtil.setAction(actionType.BA_MINE_CASH_ACCOUNTS)}
                    onChangeText={(v) => {this.changeAccount(v)}}
                />
                <View style={styles.nameWarningBox}>
                    <Text style={styles.typeNameWarning}>{this.props.error || '姓名和账户决定提现能否成功，提交后不可更改'}</Text>
                </View>
            </View>
        );
    }

    changeAccount(value) {
        let {actions} = this.props;
        actions.alipayNameChanged(value);
        actions.alipayErrMsg('');
    }
}

class AccountRepeated extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[styles.center, {height: 170}]}>
                <Text style={{marginBottom: 10, fontSize: 19}}>支付宝账号：{this.props.account}</Text>
                <Text style={styles.instructFont}>已被别人绑定</Text>
            </View>
        );
    }
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
        marginTop: 0
    },
    submitBox: {
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5
    },
    submitFont: {
        color: '#fff',
        fontSize: 19
    },
    typeNamePrompt: {
        marginVertical: 15,
        fontSize: 15,
        color: '#8d8c92'
    },
    typeNameBox: {
        backgroundColor:'#fff',
        borderTopWidth: 1/PixelRatio.get(),
        borderTopColor: '#d9d9d9'
    },
    nameWarningBox: {
        paddingHorizontal: 20,
        paddingTop: 9,
        paddingBottom: 28
    },
    typeNameWarning: {
        fontSize: 12,
        color: '#ff6d4b'
    }
});
