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
            maxPrice = parseInt(route.data.max_price),
            maxDayPrice = parseInt(route.data.max_day_price),
            score = parseInt(route.data.score);

        let isOpacity = ((price >= minPrice && price <= maxPrice) || (minPrice > maxPrice && false)) ? 1 : 0.3;
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
                        <Text style={styles.mark}>可提：{maxPrice <= minPrice ? 0 : minPrice + '-' + maxPrice}元<Text style={{color: '#8d8c92', fontSize: 12}}> (每天限提{maxDayPrice}，每笔{minPrice}元起提)</Text></Text>
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
        if(parseInt(value) > parseInt(route.data.max_price)) {
            actions.withdrawErrMsg('每天限额' + parseInt(route.data.max_day_price) + '，您已超过限额');
        } else {
            withdrawInfo.get('err_msg') && actions.withdrawErrMsg('');
        }
    }

    handleSubmit = () => {
        let self = this;
        ActionUtil.setAction(actionType.BA_MINE_CASH_SURE);
        let {navigator, actions, actionsApp, actionsUser, withdrawInfo} = this.props,
            data = {
                money: withdrawInfo.get('price')
            };
        actionsApp.appLoadingChanged(true);
        withdrawService({body: data})
        .then((oData) => {
            actionsApp.appLoadingChanged(false);
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
            if(error && error.type && error.type == "1") {
                actionsApp.verifiedNoticeSet({
                    visible: true,
                    msg: "您的身份未通过认证\n请重新上传身份信息",
                    from: "",
                    hideClose: true
                });
            } else {
                actionsApp.appLoadingChanged(false);
                actions.withdrawErrMsg(error.msg);
            }
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