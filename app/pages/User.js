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
import LinkSection from '../components/LinkSection';
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
        let {userProfile} = this.props;

        return (
            <View style={styles.container}>
                <Header title='我的' style={styles.bgHeader} fontStyle={styles.whiteText} />
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                >
                    <BasicInfo userProfile={userProfile} />

                    <LinkSection
                        linkStyle={{height: 70, marginBottom: 15}}
                        iconBoxStyle={{marginTop: -12}}
                        icon={{
                            url: require('../images/icon/calendar.png'),
                            style: {width: 12, height: 12},
                            bgColor: '#d883aa'
                        }}
                    >
                        <View style={{flexDirection: 'column'}}>
                            <Text style={{marginTop: 2}}>连续签到：5天</Text>
                            <Text style={styles.signInPrompt}>连续签到2天 赚3积分</Text>
                        </View>
                    </LinkSection>

                    <UserAccount />

                    <LinkSection
                        linkStyle={{borderBottomWidth: 1/PixelRatio.get(), borderColor: '#d9d9d9'}}
                        icon={{
                            url: require('../images/icon/phone.png'),
                            style: {width: 11.5, height: 11.5},
                            bgColor: '#54d89f'
                        }}
                    >
                        <Text style={styles.flex}>联系的房源</Text>
                        <Text>{userProfile.get('contacted')}</Text>
                    </LinkSection>

                    <LinkSection
                        linkStyle={{marginBottom: 15}}
                        icon={{
                            url: require('../images/icon/money.png'),
                            style: {width: 13, height: 12.5},
                            bgColor: '#54d89f'
                        }}
                    >
                        <Text style={styles.flex}>发布的房源</Text>
                        <Text>{userProfile.get('published')}</Text>
                    </LinkSection>

                    <LinkSection
                        linkStyle={{marginBottom: 15}}
                        icon={{
                            url: require('../images/icon/setting.png'),
                            style: {width: 12, height: 12},
                            bgColor: '#66a1e7'
                        }}
                    >
                        <Text>设置</Text>
                    </LinkSection>

                </ScrollView>
            </View>
        );
    }
}

class BasicInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {userProfile} = this.props,
            mobile = userProfile.get('mobile'),
            showMobile = mobile ? mobile.slice(0, 3) + '****' + mobile.slice(-4) : '';

        return (
            <View style={[styles.basicSection, styles.row]}>
                <View style={[styles.profileAvatar, styles.center]}>
                    <Image
                        style={styles.avatarImage}
                        source={require('../images/bureau_avatar.png')}
                    />
                </View>
                <View style={styles.flex}>
                    <Text style={[styles.mobileText, styles.whiteText]}>{showMobile}</Text>
                </View>
                <TouchableWithoutFeedback>
                    <View style={[styles.level, styles.center]}><Text style={styles.whiteText}>V1会员</Text></View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

class UserAccount extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.accountSection}>
                <View style={styles.row}>
                    <View style={[styles.accountIconBox, styles.center]}>
                        <Image
                            style={{width: 12, height: 11}}
                            source={require('../images/icon/account.png')}
                        />
                    </View>
                    <View style={[styles.flex, styles.row]}>
                        <Text style={{marginRight: 10}}>积分账户：234分</Text>
                        <TouchableWithoutFeedback><View><Text style={{color: '#04c1ae'}}>查看</Text></View></TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={[styles.row, {marginTop: 15}]}>
                    <TouchableWithoutFeedback><View style={[styles.flex, styles.center, styles.btnColor, {marginRight: 15}]}><Text style={{color: '#ff6d4b'}}>充值</Text></View></TouchableWithoutFeedback>
                    <TouchableWithoutFeedback><View style={[styles.flex, styles.center, styles.btnColor]}><Text style={{color: '#ff6d4b'}}>提现</Text></View></TouchableWithoutFeedback>
                </View>
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
    center: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    bgHeader: {
        backgroundColor: '#04c1ae'
    },
    whiteText: {
        color: '#fff'
    },
    basicSection: {
        paddingTop: 10,
        paddingBottom: 30,
        paddingLeft: 20,
        backgroundColor: '#04c1ae'
    },
    profileAvatar: {
        marginRight: 15,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff'
    },
    avatarImage: {
        width: 36,
        height: 35.5
    },
    mobileText: {
        fontSize: 19
    },
    level: {
        width: 80,
        height: 30,
        backgroundColor: '#ffa251',
        borderColor: '#fff',
        borderWidth: 1/PixelRatio.get(),
        borderRightWidth: 0,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    signInPrompt: {
        fontSize: 12,
        color: '#8d8c92'
    },
    accountSection: {
        paddingVertical: 17,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        marginBottom: 15
    },
    accountIconBox: {
        marginRight: 10,
        width: 23,
        height: 23,
        borderRadius: 11.5,
        backgroundColor: '#f47e87'
    },
    btnColor: {
        height: 40,
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#ff6d4b',
        borderRadius: 2
    }
});
