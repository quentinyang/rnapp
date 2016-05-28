import {React, Component, View, Text, TextInput, TouchableHighlight, TouchableOpacity, Alert, PixelRatio, StyleSheet} from 'nuke';
import WithLabel from '../components/LabelTextInput';
import TouchableSubmit from '../components/TouchableSubmit';
import TouchWebContainer from "../containers/TouchWebContainer";
import TabViewContainer from '../containers/TabViewContainer';

export default class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errMsg: ''
        };
    }

    render() {
        let {withdrawInfo, route} = this.props;
        let price = parseInt(withdrawInfo.get('price')),
            minPrice = parseInt(route.data.min_price),
            score = parseInt(route.data.score);
        let isOpacity = (price >= minPrice && price <= score) && withdrawInfo.get('account') ? 1 : 0.3;
        return (
            <View style={styles.container}>
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
                <View style={styles.withdrawBox}>
                    <Text style={{marginBottom: 15}}>提现金额</Text>
                    <WithLabel
                        label='¥'
                        labelStyle={styles.labelWidth}
                        value={this.props.withdrawInfo.get('price')}
                        inputStyle={styles.inputFont}
                        maxLength={6}
                        style={styles.cancelLabelPadding}
                        underlineColorAndroid = 'transparent'
                        onFocus={() => {}}
                        onChangeText={(v) => {this.changePrice(v)}}
                    />
                    { this.state.errMsg ?
                        <Text style={[styles.mark, styles.colorFFDB]}>{this.state.errMsg}</Text>
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
            </View>
        );
    }

    componentDidMount() {
        this.props.actions.getAlipayAccount();
    }

    componentWillUnmount() {
        this.props.actions.priceCleared();
    }

    goBinding() {
        this.props.navigator.push({
            component: TouchWebContainer,
            name: 'shouquan',
            title: '支付宝快捷收银台',
            hideNavBar: false,
            url: 'https://mapi.alipay.com/gateway.do?sign=301bf1672544be3fdb7bc9a717f78373&exter_invoke_ip=10.2.40.81&target_service=user.auth.quick.login&sign_type=MD5&service=alipay.auth.authorize&partner=2088911968230519&return_url=http://www.fangyuan360.cn'
        });
    }

    changePrice(value) {
        let {route, actions} = this.props;
        actions.priceChanged(value);
        if(parseInt(value) > parseInt(route.data.score)) {
            this.setState({errMsg: '输入金额超过可提额度'});
        } else {
            this.state.errMsg && this.setState({errMsg: ''});
        }
    }

    handleSubmit = () => {
        let {navigator, actions} = this.props;
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
    };
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
    }
});