import {React, Component, View, Text, TextInput, TouchableHighlight, TouchableOpacity, ScrollView, Alert, Modal, PixelRatio, StyleSheet} from 'nuke';
import WithLabel from '../components/LabelTextInput';
import TouchableSubmit from '../components/TouchableSubmit';
import TouchWebContainer from "../containers/TouchWebContainer";
import TabViewContainer from '../containers/TabViewContainer';
import {withdrawService, alipayLoginService} from '../service/userService';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_MINE_WITHDRAE;
        ActionUtil.setActionWithExtend(actionType.BA_MINE_CASH_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {withdrawInfo, route} = this.props;
        let price = parseInt(withdrawInfo.get('price')),
            minPrice = parseInt(route.data.min_price),
            score = parseInt(route.data.score);

        let isOpacity = (price >= minPrice && price <= score) && (withdrawInfo.get('account') || withdrawInfo.get('alipay_account') && withdrawInfo.get('name')) ? 1 : 0.3;
        return (
            <ScrollView style={styles.container}>
                {(withdrawInfo.get('account') || withdrawInfo.get('has_bound') == 0)?
                <WithLabel
                    label='支付宝'
                    style={styles.bindBox}
                    placeholder={withdrawInfo.get('account') || '暂未绑定'}
                    editable={false}
                    underlineColorAndroid = 'transparent'
                >
                    { !withdrawInfo.get('account') ?
                    <TouchableOpacity onPress={() => this.goBinding()}>
                        <View><Text style={{color: '#04c1ae'}}>去绑定></Text></View>
                    </TouchableOpacity> : null }
                </WithLabel>
                :
                <View style={styles.bindBox}>
                    <WithLabel
                        label='支付宝账号'
                        labelStyle={styles.aliLabelWidth}
                        value={withdrawInfo.get('alipay_account')}
                        placeholder='邮箱/手机号'
                        underlineColorAndroid = 'transparent'
                        onFocus={() => ActionUtil.setAction(actionType.BA_MINE_CASH_ACCOUNTS)}
                        onChangeText={(v) => {this.changeAccount(v)}}
                    />
                    <WithLabel
                        label='真实姓名'
                        labelStyle={styles.aliLabelWidth}
                        value={withdrawInfo.get('name')}
                        maxLength={10}
                        placeholder='该账号对应的真实姓名'
                        underlineColorAndroid = 'transparent'
                        onFocus={() => ActionUtil.setAction(actionType.BA_MINE_CASH_NAME)}
                        onChangeText={(v) => {this.changeName(v)}}
                    />
                    <View style={styles.warnBox}><Text style={styles.warnFont}>姓名和账号决定您的提现能否成功，提交后将不可更改，请谨慎填写！</Text></View>
                </View>
                }
                <View style={styles.withdrawBox}>
                    <Text style={{marginBottom: 10}}>提现金额</Text>
                    <WithLabel
                        label='¥'
                        labelStyle={styles.labelWidth}
                        value={withdrawInfo.get('price')}
                        inputStyle={styles.inputFont}
                        maxLength={6}
                        keyboardType='numeric'
                        style={styles.cancelLabelPadding}
                        underlineColorAndroid = 'transparent'
                        onFocus={() => ActionUtil.setAction(actionType.BA_MINE_CASH_MONEY)}
                        onChangeText={(v) => {this.changePrice(v)}}
                    />
                    { withdrawInfo.get('err_msg') ?
                        <Text style={[styles.mark, styles.colorFFDB]}>{withdrawInfo.get('err_msg')}</Text>
                        :
                        <Text style={styles.mark}>可提金额：{score == minPrice ? score : minPrice + '-' + score}元</Text>
                    }
                </View>
                <View style={styles.submitBox}>
                    <TouchableSubmit
                        opacity={isOpacity}
                        onPress={isOpacity == 1 ? this.handleSubmit : null}
                        submitText='提现'
                    />
                </View>
            </ScrollView>
        );
    }

    componentWillMount() {
        let {actions, route} = this.props,
            {alipay_account, is_binding_alipay} = route.data;

        actions.fromUserFetched(alipay_account, is_binding_alipay);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        let {actions} = this.props;
        actions.priceCleared();
        actions.errMsg('');
    }

    goBinding() {
        ActionUtil.setAction(actionType.BA_MINE_CASH_BIND);
        alipayLoginService()
        .then((oData) => {
            this.props.navigator.push({
                component: TouchWebContainer,
                name: 'shouquan',
                title: '支付宝快捷登录',
                hideNavBar: false,
                callbackFun: this.callbackFn,
                url: oData.url,
                bg: this.pageId,
                noToken: true
            });
        })
        .catch(() => {
        })

    }

    callbackFn = () => {
        let {actions, navigator} = this.props;
        actions.getAlipayStatus();
        navigator.pop();
    };

    verifyName(value) {
        let reg = /^[\u4e00-\u9fa5a-zA-Z]{2,10}$/;
        if(!reg.test(value)) {
            this.props.actions.errMsg('请输入您的真实姓名');
            return false;
        }
        return true;
    }

    changeAccount(value) {
        let {route, actions, withdrawInfo} = this.props;
        actions.aliAccountChanged(value);
    }

    changeName(value) {
        let {route, actions, withdrawInfo} = this.props;
        actions.nameChanged(value);
    }

    changePrice(value) {
        let {route, actions, withdrawInfo} = this.props;
        actions.priceChanged(value);
        if(parseInt(value) > parseInt(route.data.score)) {
            actions.errMsg('输入金额超过可提额度');
        } else {
            withdrawInfo.get('err_msg') && actions.errMsg('');
        }
    }

    handleSubmit = () => {
        let self = this;
        ActionUtil.setAction(actionType.BA_MINE_CASH_SURE);
        let {navigator, actions, actionsUser, withdrawInfo} = this.props,
            data = {};
        if(!withdrawInfo.get('account') && withdrawInfo.get('has_bound')) {
            if(self.verifyName(withdrawInfo.get('name'))) {
                data = {
                    money: withdrawInfo.get('price'),
                    alipay_account: withdrawInfo.get('alipay_account'),
                    name: withdrawInfo.get('name')
                };
            } else {
                return false
            };
        } else {
            data = {
                money: withdrawInfo.get('price')
            };
        }
        withdrawService({body: data})
        .then((oData) => {
            actions.errMsg('');
            ActionUtil.setAction(actionType.BA_MINE_CASH_SUCCESS);
            Alert.alert('', '申请提现成功\n1个工作日内到账',
                [{
                    text: '确定',
                    onPress: () => {
                        navigator.pop();
                        actionsUser.fetchUserProfile({});
                        actions.priceCleared();
                    }
                }]
            );
        })
        .catch((error) => {
            actions.getAlipayStatus();
            actions.errMsg(error.msg);
        })
    };
}

class BindFailedModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let showModal = this.props.msg ? true : false;
        return (
            <Modal visible={showModal} transparent={true} >
                <View style={styles.bindFailedBg}>
                    <View style={styles.bindFailedBox}>
                        <Text style={{marginBottom: 15}}>绑定失败</Text>
                        <Text style={{marginBottom: 25}}>{this.props.msg}</Text>
                        <TouchableHighlight
                             style={styles.sureButton}
                             underlayColor="#04c1ae"
                             onPress={() => {this.props.actions.modalHidden()}}
                        >
                            <View><Text style={{color: "#fff", textAlign: "center"}}>确定</Text></View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    bindBox: {
        marginVertical: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1/PixelRatio.get(),
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9'
    },
    withdrawBox: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1/PixelRatio.get(),
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9'
    },
    cancelLabelPadding: {
        paddingLeft: 0,
        paddingRight: 0
    },
    warnBox: {
        paddingVertical: 5,
        paddingHorizontal: 20
    },
    warnFont: {
        fontSize: 12,
        color: '#ffa251'
    },
    labelWidth: {
        width: 20
    },
    aliLabelWidth: {
        width: 100
    },
    inputFont: {
        fontSize: 30,
        lineHeight: 45
    },
    mark: {
        justifyContent: 'center',
        marginTop: 10,
        height: 20,
        fontSize: 15,
        color: '#8d8c92'
    },
    colorFFDB: {
        color: '#ff6d4b'
    },
    submitBox: {
        marginTop: 15,
        padding: 20
    }
});