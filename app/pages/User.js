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
        let {userProfile} = this.props,
            mobile = userProfile.get('mobile'),
            showMobile = mobile ? mobile.slice(0, 3) + '****' + mobile.slice(-4) : '';

        return (
            <View style={styles.container}>
                <Header title='我的' style={styles.bgHeader} fontStyle={styles.whiteText} />
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                >
                    <View style={styles.basicSection}>
                        <Image
                            style={styles.profileAvatar}
                            source={require('../images/profile.jpg')}
                        />
                        <View style={styles.flex}>
                            <Text style={[styles.mobileText, styles.whiteText]}>{showMobile}</Text>
                        </View>
                        <TouchableWithoutFeedback>
                            <View style={styles.level}><Text style={styles.whiteText}>V1会员</Text></View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eee'
    },
    flex: {
        flex: 1
    },
    bgHeader: {
        backgroundColor: '#04c1ae'
    },
    whiteText: {
        color: '#fff'
    },
    basicSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 30,
        paddingLeft: 20,
        backgroundColor: '#04c1ae'
    },
    profileAvatar: {
        marginRight: 15,
        width: 60,
        height: 60
    },
    mobileText: {
        fontSize: 19
    },
    level: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 30,
        backgroundColor: '#ffa251',
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    }
});
