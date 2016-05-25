import {React, Component, View, Text, TextInput, TouchableHighlight, TouchableOpacity, PixelRatio, StyleSheet} from 'nuke';
import WithLabel from '../components/LabelTextInput';
import TouchableSubmit from '../components/TouchableSubmit';

export default class Withdraw extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let isOpacity = false;

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
                    <TouchableOpacity onPress={() => this.goBinding()}><View><Text style={{color: '#04c1ae'}}>去绑定></Text></View></TouchableOpacity>
                </WithLabel>
                <View style={styles.withdrawBox}>
                    <Text>提现金额</Text>
                    <WithLabel
                        label='¥'
                        value=''
                        style={styles.cancelLabelPadding}
                        underlineColorAndroid = 'transparent'
                        onFocus={() => ActionUtil.setAction(actionType.BA_SEND_ADDBUILDINGNUM)}
                        onChangeText={(v) => {this.singleAction('buildingChanged', v)}}
                    />
                    <Text style={styles.mark}>可提金额：100元</Text>
                </View>
                <View style={styles.submitBox}>
                    <TouchableSubmit
                        opacity={isOpacity ? 1: 0.3}
                        onPress={this.handleSubmit}
                        submitText='提现'
                    />
                </View>
            </View>

        );
    }

    goBinding() {
        console.log('xxxx');
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
    mark: {
        paddingTop: 10,
        fontSize: 15,
        color: '#8d8c92'
    },
    submitBox: {
        padding: 20
    }
});