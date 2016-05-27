import {React, Component, View, Text, TextInput, TouchableHighlight, TouchableOpacity, PixelRatio, StyleSheet} from 'nuke';
import WithLabel from '../components/LabelTextInput';
import TouchableSubmit from '../components/TouchableSubmit';
import TouchWebContainer from "../containers/TouchWebContainer";

export default class Withdraw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            errMsg: ''
        };
    }

    render() {
        const minPrice = 2;
        let {withdrawInfo, route} = this.props;
        let price = parseInt(withdrawInfo.get('price'));
        let isOpacity = price >= minPrice && price <= parseInt(route.data.score) ? 1 : 0.3;

        return (
            <View style={styles.container}>
                <WithLabel
                    label='支付宝'
                    value=''
                    style={styles.bindBox}
                    placeholder='暂未绑定'
                    editable={false}
                    underlineColorAndroid = 'transparent'
                >
                    <TouchableOpacity onPress={() => this.goBinding()}>
                        <View><Text style={{color: '#04c1ae'}}>去绑定></Text></View>
                    </TouchableOpacity>
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
                        <Text style={styles.mark}>可提金额：{this.props.route.data.score}元</Text>
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

    handleSubmit() {
        console.log('yyyy');
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