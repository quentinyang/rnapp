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

        let isOpacity = (price >= minPrice && price <= score) ? 1 : 0.3;
        return (
            <ScrollView style={styles.container}>
                <View style={styles.aliTitle}>
                <Text style={styles.aliTitleFont}>提现到支付宝：{route.data.alipay_account}</Text>
                </View>
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
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        let {actions} = this.props;

        actions.withdrawPriceCleared();
        actions.withdrawErrMsg('');
    }

    changePrice(value) {
        let {route, actions, withdrawInfo} = this.props;
        actions.withdrawPriceChanged(value);
        if(parseInt(value) > parseInt(route.data.score)) {
            actions.withdrawErrMsg('输入金额超过可提额度');
        } else {
            withdrawInfo.get('err_msg') && actions.withdrawErrMsg('');
        }
    }

    handleSubmit = () => {
        let self = this;
        ActionUtil.setAction(actionType.BA_MINE_CASH_SURE);
        let {navigator, actions, actionsUser, withdrawInfo} = this.props,
            data = {
                money: withdrawInfo.get('price')
            };

        withdrawService({body: data})
        .then((oData) => {
            actions.withdrawErrMsg('');
            ActionUtil.setAction(actionType.BA_MINE_CASH_SUCCESS);
            Alert.alert('', '申请提现成功\n1个工作日内到账',
                [{
                    text: '确定',
                    onPress: () => {
                        navigator.pop();
                        actionsUser.fetchUserProfile({});
                        actions.withdrawPriceCleared();
                    }
                }]
            );
        })
        .catch((error) => {
            actions.withdrawErrMsg(error.msg);
        })
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    aliTitle: {
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    aliTitleFont: {
        fontSize: 15,
        color: '#8d8c92'
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