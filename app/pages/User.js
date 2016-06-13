'use strict';

import {
    React,
    Component,
    Text,
    View,
    ScrollView,
    ListView,
    Image,
    TouchableWithoutFeedback,
    Alert,
    PixelRatio,
    StyleSheet
} from 'nuke';

import Header from '../components/Header';
import ContactHouseContainer from '../containers/ContactHouseContainer'
import InputHouseContainer from '../containers/InputHouseContainer'
import RechargeContainer from '../containers/RechargeContainer'
import WithdrawContainer from '../containers/WithdrawContainer'
import SettingContainer from '../containers/SettingContainer'
import ScoreListContainer from '../containers/ScoreListContainer'
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class User extends Component {
    constructor(props) {
        super(props);

        this.pageId = actionType.BA_MINE;
        ActionUtil.setActionWithExtend(actionType.BA_MINE_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        return (
            <View style={styles.container}>
                <Header title='我的' style={styles.bgHeader} fontStyle={styles.whiteText} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee'
    },
    bgHeader: {
        backgroundColor: '#04c1ae'
    },
    whiteText: {
        color: '#fff'
    }
});
