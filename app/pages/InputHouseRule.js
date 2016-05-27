'use strict';

import {
    React,
    Component,
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
} from 'nuke';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class InputHouseRule extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_SEND_SUCCESS;
        ActionUtil.setActionWithExtend(actionType.BA_SEND_SUCCESS_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        return (
            <View style={[styles.alignItems, styles.justifyContent]}>
                <View style={styles.container}>
                    <Text style={styles.promptTitle}>发布一套房源得<Text style={[styles.fontOrange, styles.fontBold]}>7~15</Text>积分</Text>
                    <Text style={styles.promptTitle}>每人每天最多发布<Text style={[styles.fontOrange, styles.fontBold]}>30</Text>套房源</Text>
                    <TouchableHighlight
                        style={[styles.alignItems, styles.justifyContent, styles.btn]}
                        underlayColor='#04c1ae'
                        onPress={this.continueInput}
                    >
                        <View><Text style={[styles.btnText]}>立即发房</Text></View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    continueInput = () => {
        ActionUtil.setAction(actionType.BA_SEND_SUCCESS_CONTINIUE);
        this.props.navigator.pop();
    };
}

const styles = StyleSheet.create({
    alignItems: {
        alignItems: 'center'
    },
    justifyContent: {
        justifyContent: 'center'
    },
    container: {
        width: 250,
        marginTop: 57
    },
    promptTitle: {
        marginLeft: 3,
        marginTop: 20,
        fontSize: 19,
        fontWeight: '300',
        fontFamily: 'Heiti SC'
    },
    fontBold: {
        fontWeight: '700'
    },
    fontOrange: {
        color: '#FF6D4B'
    },
    btn: {
        marginTop: 64,
        width: 250,
        height: 40,
        borderRadius: 5,
        backgroundColor: '#04c1ae'
    },
    btnText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'Heiti SC'
    }
});