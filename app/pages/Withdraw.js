import {React, Component, View, Text, TextInput, TouchableHighlight, TouchableOpacity, Alert, Modal, PixelRatio, StyleSheet} from 'nuke';
import WithLabel from '../components/LabelTextInput';
import TouchableSubmit from '../components/TouchableSubmit';
import TouchWebContainer from "../containers/TouchWebContainer";
import TabViewContainer from '../containers/TabViewContainer';
import {withdrawService, alipayLoginService} from '../service/userService';

export default class Withdraw extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {withdrawInfo, route} = this.props;
        let price = parseInt(withdrawInfo.get('price')),
            minPrice = parseInt(route.data.min_price),
            score = parseInt(route.data.score);

        let isOpacity = (price >= minPrice && price <= score) && withdrawInfo.get('alipay_account') ? 1 : 0.3;
        return (
            <View style={styles.container}>
                {(withdrawInfo.get('alipay_account') || withdrawInfo.get('has_bound') == 0)?
                <WithLabel
                    label='支付宝'
                    style={styles.bindBox}
                    placeholder={withdrawInfo.get('alipay_account') || '暂未绑定'}
                    editable={false}
                    underlineColorAndroid = 'transparent'
                >
                    { !withdrawInfo.get('alipay_account') ?
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
                    />
                    <WithLabel
                        label='真实姓名'
                        labelStyle={styles.aliLabelWidth}
                        value={withdrawInfo.get('name')}
                        placeholder='该账号对应的真实姓名'
                        underlineColorAndroid = 'transparent'
                    />
                </View>
                }
                <View style={styles.withdrawBox}>
                    <Text style={{marginBottom: 15}}>提现金额</Text>
                    <WithLabel
                        label='¥'
                        labelStyle={styles.labelWidth}
                        value={withdrawInfo.get('price')}
                        inputStyle={styles.inputFont}
                        maxLength={6}
                        style={styles.cancelLabelPadding}
                        underlineColorAndroid = 'transparent'
                        onFocus={() => {}}
                        onChangeText={(v) => {this.changePrice(v)}}
                    />
                    { withdrawInfo.get('err_msg') ?
                        <Text style={[styles.mark, styles.colorFFDB]}>{withdrawInfo.get('err_msg')}</Text>
                        :
                        <Text style={styles.mark}>可提金额：{score}元</Text>
                    }
                </View>
                <View style={styles.submitBox}>
                    <TouchableSubmit
                        opacity={isOpacity}
                        onPress={isOpacity == 1 ? this.handleSubmit : null}
                        submitText='提现'
                    />
                </View>
                <BindFailedModal msg={withdrawInfo.get('bound_failed')} actions={this.props.actions} />
            </View>
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
        this.props.actions.priceCleared();
    }

    goBinding() {
        alipayLoginService()
        .then((oData) => {
            this.props.navigator.push({
                component: TouchWebContainer,
                name: 'shouquan',
                title: '支付宝快捷收银台',
                hideNavBar: false,
                callbackFun: this.callbackFn,
                url: oData.url
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
        let {navigator, actions, withdrawInfo} = this.props;
        if(!withdrawInfo.get('alipay_account') && withdrawInfo.get('is_binding_alipay')) {
            let data = {
                money: withdrawInfo.get('price'),
                alipay_account: withdrawInfo.get('alipay_account'),
                name: withdrawInfo.get('name')
            };
        } else {
            let data = {
                money: withdrawInfo.get('price')
            };
        }

        withdrawService({body: data})
        .then((oData) => {
            Alert.alert('', '申请提现成功\n1个工作日内到账',
                [{
                    text: '确定',
                    onPress: () => {
                        navigator.push({
                            component: TabViewContainer,
                            from: 'withdrawSuccess',
                            name: 'user',
                            title: '我的',
                            hideNavBar: true
                        });
                        actions.priceCleared();
                    }
                }]
            );
        })
        .catch((error) => {
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
        borderTopColor: '#d9d9d9'
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
    labelWidth: {
        width: 20
    },
    aliLabelWidth: {
        width: 100
    },
    inputFont: {
        fontSize: 35,
        height: 35,
        marginVertical: 5
    },
    mark: {
        marginTop: 10,
        height: 16,
        fontSize: 15,
        color: '#8d8c92'
    },
    colorFFDB: {
        color: '#ff6d4b'
    },
    submitBox: {
        padding: 20
    },
    bindFailedBg: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    bindFailedBox: {
        alignItems: 'center',
        justifyContent: "center",
        width: 250,
        height: 160,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    sureButton: {
        justifyContent: "center",
        width: 190,
        height: 30,
        backgroundColor: '#04c1ae',
        borderRadius: 5
    }
});