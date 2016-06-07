import {React, Component, Text, View, TouchableWithoutFeedback, StyleSheet, Image, PixelRatio} from 'nuke';
import RechargeContainer from "../containers/RechargeContainer";
import TabViewContainer from '../containers/TabViewContainer';
import Header from '../components/Header';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class RechargeSuccess extends Component {
    constructor(props) {
        super(props);
        ActionUtil.setAction(actionType.BA_DEPOSIT_SUCCESS);
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title='充值成功'></Header>
                <View style={[styles.flex, styles.alignBox]}>
                    <Image source={require('../images/success.png')} style={styles.successImage} />
                    <Text style={styles.promptTitle}><Text style={styles.redColor}>{this.props.route.price}</Text>积分已入账</Text>
                    <TouchableWithoutFeedback onPress={this.sucPress}>
                        <View style={[styles.continueButton, styles.alignBox]}><Text style={styles.btnFont}>完成</Text></View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

    sucPress = () => {
        let {navigator} = this.props;
        ActionUtil.setAction(actionType.BA_DEPOSIT_WATCH);

        navigator.push({
            component: TabViewContainer,
            from: 'reCharge',
            name: 'user',
            bp: actionType.BA_DEPOSIT,
            title: '我的',
            hideNavBar: true
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    flex: {
        flex: 1
    },
    alignBox: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    successImage: {
        width: 80,
        height: 80
    },
    promptTitle: {
        marginTop: 30,
        marginBottom: 50,
        fontSize: 19
    },
    redColor: {
        color: '#ff6d4b',
        fontSize: 19
    },
    continueButton: {
        marginBottom: 120,
        width: 250,
        height: 40,
        backgroundColor: '#04c1ae',
        borderWidth: 1,
        borderColor: '#04c1ae',
        borderRadius: 5
    },
    btnFont: {
        fontSize: 18,
        color: '#fff'
    }
});
