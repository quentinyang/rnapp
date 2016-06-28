'use strict';

import {
    React,
    Component,
    Text,
    View,
    ScrollView,
    Image,
    Alert,
    PixelRatio,
    Platform,
    StyleSheet
} from 'nuke';

import Header from '../components/Header';
import LinkSection from '../components/LinkSection';
import BindPromptModal from '../components/BindPromptModal';
import SignInContainer from '../containers/SignInContainer';
import AboutEXPContainer from '../containers/AboutEXPContainer';
import ContactHouseContainer from '../containers/ContactHouseContainer';
import InputHouseContainer from '../containers/InputHouseContainer';
import RechargeContainer from '../containers/RechargeContainer';
import WithdrawContainer from '../containers/WithdrawContainer';
import BindAlipayContainer from '../containers/BindAlipayContainer';
import SettingContainer from '../containers/SettingContainer';
import ScoreListContainer from '../containers/ScoreListContainer';
import WelfareContainer from '../containers/WelfareContainer';
import Immutable from 'immutable';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class AboutUser extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.container}>
                <UserSection />
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                >
                    <HouseSection />
                </ScrollView>
            </View>
        );
    }
}

class UserSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.basicBox}>
                <View style={styles.center}>
                    <View style={[styles.avatarBox, styles.center]}>
                        <Image
                            style={styles.avatarImage}
                            source={require('../images/bureau_avatar.png')}
                        />
                    </View>
                    <Text style={{fontSize: 17}}>155****4568</Text>
                    <View style={[styles.row, styles.flex, styles.resultList]}>
                        <View style={[styles.flex, styles.center, styles.resultItem]}>
                            <Text style={[styles.resultNum]}>{47}</Text>
                            <Text style={styles.smallFont}>累计登录</Text>
                        </View>
                        <View style={styles.vline}></View>
                        <View style={[styles.flex, styles.center, styles.resultItem]}>
                            <Text style={[styles.resultNum]}>{201}</Text>
                            <Text style={styles.smallFont}>已赚积分</Text>
                        </View>
                        <View style={styles.vline}></View>
                        <View style={[styles.flex, styles.center, styles.resultItem]}>
                            <Text style={[styles.resultNum]}>{259}</Text>
                            <Text style={styles.smallFont}>已获经验</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.baseBottom}>
                    <Text>关注&看房</Text>
                </View>
            </View>
        );
    }
}

class HouseSection extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.houseBox}>
                <Text>Ta发的房源</Text>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f8f8'
    },
    flex: {
        flex: 1
    },
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    basicBox: {
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    avatarBox: {
        marginBottom: 12,
        width: 60,
        height: 60,
        backgroundColor: '#04c1ae',
        borderRadius: 30
    },
    avatarImage: {
        width: 36,
        height: 36
    },
    vline: {
        marginTop: 8,
        height: 30,
        width: 1,
        backgroundColor: '#ccc'
    },
    resultList: {
        marginVertical: 20
    },
    resultItem: {
        marginHorizontal: 30
    },
    resultNum: {
        fontSize: 17
    },
    smallFont: {
        fontSize: 12,
        color: '#8d8c92'
    },
    baseBottom: {
        backgroundColor: '#fff',
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9',
        borderRadius: 3
    },
    houseBox: {
        backgroundColor: '#fff',
        padding: 15
    }
});
