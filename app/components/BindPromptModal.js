'use strict';

import {
    React,
    Component,
    View,
    Text,
    Image,
    Modal,
    TouchableHighlight,
    StyleSheet
} from 'nuke';

import BindAlipayContainer from '../containers/BindAlipayContainer';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class BindPromptModal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {controller, actions} = this.props;
        return (
            <Modal visible={controller.get('visible')} transparent={true} onRequestClose={() => {}}>
                <View style={[styles.flex, styles.center, styles.bgWrap]}>
                    <View style={[styles.center, styles.contentContainer]}>
                        <TouchableHighlight
                            style={[styles.flex, styles.center, styles.closeBox]}
                            underlayColor="transparent"
                            onPress={() => {actions.setBindPromptVisible(false); ActionUtil.setAction(actionType.BA_MINE_ZHIFUBAO_BOXONVIEW_DELETE);}}
                        >
                            <Image
                                style={styles.closeIcon}
                                source={require("../images/close.png")}
                            />
                        </TouchableHighlight>

                        <Text style={styles.msgTip}>提现请先绑定支付宝</Text>

                        <TouchableHighlight
                            style={[styles.btn, styles.sureBtn]}
                            underlayColor="#04c1ae"
                            onPress={this.pushToBind.bind(this)}
                        >
                            <View>
                                <Text style={{color: "#fff", textAlign: "center"}}>去绑定</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }

    pushToBind() {
        let {navigator, actions, withdrawData} = this.props;
        ActionUtil.setAction(actionType.BA_MINE_ZHIFUBAO_BOXONVIEW_SURE);
        actions.setBindPromptVisible(false);
        navigator.push({
            component: BindAlipayContainer,
            name: 'bindAlipay',
            data: withdrawData,
            title: '绑定支付宝',
            hideNavBar: false,
            backLog: actionType.BA_MINE_ZHIFUBAO_BACK,
        });
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    bgWrap: {
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    contentContainer: {
        width: 270,
        borderRadius: 5,
        padding: 20,
        backgroundColor: "#fff"
    },
    closeBox: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 50,
        height: 30
    },
    closeIcon: {
        width: 15,
        height: 13
    },
    msgTip: {
        marginTop: 14,
        marginBottom: 22,
        textAlign: "center",
        fontSize: 16
    },
    btn: {
        width: 170,
        height: 30,
        justifyContent: "center",
        borderRadius: 5
    },
    sureBtn: {
        height: 35,
        width: 195,
        backgroundColor: '#04c1ae',
        marginBottom: 20
    }
});