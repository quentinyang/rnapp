import {
    React, Component,
    Text, View, ScrollView, Image,
    TouchableWithoutFeedback, TouchableHighlight,
    StyleSheet, PixelRatio,
    Alert
} from 'nuke';

var Alipay = require('react-native').NativeModules.Alipay;
var { NativeAppEventEmitter } = require('react-native');
import RechargeSuccessContainer from "../containers/RechargeSuccessContainer";
import {tradeService} from '../service/payService';

export default class Recharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            price: 10
        };
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
            >
                <View style={styles.choiceBox}>
                    <Text>选择充值面额</Text>
                    <View style={styles.priceBox}>
                        <TouchableWithoutFeedback onPress={() => this.choosePrice(10)}>
                            <View style={[styles.priceItem, this.state.price == 10? styles.selectedBorder: null]}>
                                <Text style={this.state.price == 10? styles.selectedFont: null}>10积分</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.choosePrice(20)}>
                            <View style={[styles.priceItem, this.state.price == 20? styles.selectedBorder: null]}>
                                <Text style={this.state.price == 20? styles.selectedFont: null}>20积分</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={() => this.choosePrice(50)}>
                            <View style={[styles.priceItem, {marginRight: 0}, this.state.price == 50? styles.selectedBorder: null]}>
                                <Text style={this.state.price == 50? styles.selectedFont: null}>50积分</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={styles.payWay}>
                    <View style={styles.payLeft}>
                        <Image source={require('../images/alipaylogo.png')} style={styles.aliImage} />
                        <Text>支付宝支付: <Text style={styles.colorRed}>{this.state.price}元</Text></Text>
                    </View>
                    <Image source={require('../images/paySelected.png')} style={styles.payWayImage} />
                </View>
                <TouchableHighlight style={styles.submitButton} onPress={this.submitPrice}>
                    <View style={styles.submitBox}>
                        <Text style={styles.submitFont}>立即充值</Text>
                    </View>
                </TouchableHighlight>

            </ScrollView>
        )
    }

    componentWillMount() {
        this.results = NativeAppEventEmitter.addListener(
            'EventReminder',
            (data) => {
                if(data.status != 9000) {
                    Alert.alert('', '支付失败，请稍后重试', [{text: '确定'}]);
                } else {
                    this.props.navigator.push({
                        component: RechargeSuccessContainer,
                        name: 'success',
                        price: this.state.price,
                        title: '充值成功',
                        hideNavBar: true
                    });
                }
            }
        );
    }

    componentWillUnmount() {
        this.results.remove();
    }

    choosePrice(score) {
        this.setState({price: score});
    }

    submitPrice = () => {
        let data = {
            subject: '房源360积分充值',
            body: '房源360'+this.state.price+'积分充值',
            total_fee: this.state.price,
            pay_type: 1
        };

        tradeService({body:data})
        .then((oData) => {
            Alipay.addEvent(oData.data);
        })
        .catch((data) => {

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
        margin: 20
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
