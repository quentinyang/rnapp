'use strict';

import {React, Component, Modal, Text, View, Image, StyleSheet, TouchableHighlight, TouchableWithoutFeedback, PixelRatio, Platform} from 'nuke';

export default class BackScore extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cur: -1
        };
        this.submitFlag = false;
        this.reasons = [{select: false, val: "联系不上"}, {select: false, val: "虚假房源"}, {select: false, val: "房东不卖"}, {select: false, val: "房源已卖"}, {select: false, val: "按错了"}];
    }

    render() {
        let self = this;
        let {pageInfo, actions} = this.props;
        let reasonsList = this.reasons.map((item, index) => {
            return (
                <TouchableWithoutFeedback
                    key={index}
                    onPress={self.saveSelectReason.bind(self, index)}
                >
                    <View style={[styles.row, styles.center, styles.item]}>
                        {item.select ?
                            <Image style={styles.radioIcon} source={require('../images/radio_selected.png')} /> :
                            <Image style={styles.radioIcon} source={require('../images/radio_unselected.png')} />
                        }
                        <Text style={[styles.baseColor, styles.baseSize]}>{item.val}</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        });

        return (
            <View style={[styles.flex, styles.wrapper]}>
                <Modal visible={pageInfo.get('visible')} transparent={true} onModalVisibilityChanged={actions.changeSuccessModalVisible}>
                    <View style={styles.bgWrap}>
                        <View style={styles.contentContainer}>
                            <Image
                                style={styles.sucIcon}
                                source={require('../images/white_success.png')}/>
                            <Text style={styles.sucTip}>提交成功</Text>
                        </View>
                    </View>
                </Modal>

                <View style={[styles.titleBox]}>
                    <Text style={styles.title}>请选择原因</Text>
                </View>
                {reasonsList}

                <TouchableHighlight
                    style={[styles.sureBtn, this.state.cur == -1 ? {} : styles.highlight]}
                    underlayColor="#04c1ae"
                    onPress={this.submitReason.bind(this)}
                >
                    <Text style={styles.sureText}>提交</Text>
                </TouchableHighlight>
                <Text style={[styles.baseColor, styles.tip]}>1个工作日内,审核通过立即返还本次积分</Text>
            </View>
        );
    }
    componentDidUpdate() {
        if(this.submitFlag) {
            this.submitFlag = false;
        }
    }
    saveSelectReason(index) {
        let cur = this.state.cur;
        if(cur != index) {
            this.reasons[index].select = true;
            (cur != -1) && (this.reasons[cur].select = false);
            this.setState({
                cur: index
            });
        }
    }
    submitReason() {
        if(!this.submitFlag && this.state.cur != -1) {
            this.submitFlag = true;
            this.props.actions.submitReason({
                wash_id: this.props.route.washId,
                status: this.state.cur + 3
            });
        }
    }
}
const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    center: {
        alignItems: 'center'
    },
    baseColor: {
        color: '#3e3e3e'
    },
    baseSize: {
        fontSize: 16
    },
    wrapper: {
        backgroundColor: '#eee'
    },
    titleBox: {
        height: 30,
        paddingLeft: 15,
        paddingRight: 15,
        justifyContent: 'flex-start'
    },
    title: {
        marginTop: 8,
        fontSize: 15,
        color: '#8D8C92'
    },
    item: {
        height: 47,
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        paddingLeft: 15,
        paddingRight: 15
    },
    radioIcon: {
        width: 14,
        height: 14,
        marginRight: 10
    },
    sureBtn: {
        marginTop: 40,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    highlight: {
        backgroundColor: '#04c1ae',
    },
    sureText: {
        color: '#fff',
        fontSize: 19,
        letterSpacing: 2,
        textAlign: 'center'
    },
    tip: {
        fontSize: 12,
        textAlign: 'center'
    },
    bgWrap: {
        flex: 1,
        alignItems: "center",
        marginTop: -100,
        justifyContent: "center"
    },
    contentContainer: {
        width: 125,
        height: 130,
        borderRadius: 4,
        padding: 20,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    sucIcon: {
        width: 55,
        height: 55
    },
    sucTip: {
        fontSize: 19,
        color: '#fff',
        marginTop: 10
    }
});