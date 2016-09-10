'use strict';

import {
    React,
    Component,
    Text,
    View,
    ScrollView,
    Image,
    TouchableWithoutFeedback,
    Alert,
    PixelRatio,
    Platform,
    StyleSheet,
    InteractionManager
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
import WelfareModal from '../components/WelfareModal';
import MessageNoticeModal from '../components/MessageNoticeModal';
import Toast from 'react-native-root-toast';
import Immutable from 'immutable';
let ActionUtil = require('../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class User extends Component {
    constructor(props) {
        super(props);

        this.pageId = actionType.BA_MINE;
        ActionUtil.setActionWithExtend(actionType.BA_MINE_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {userProfile, userControlData, signInInfo, appUserConfig, navigator, actions} = this.props;
        let signInData = Immutable.fromJS({
            sign_in_days: userProfile.get('sign_in_days'),
            experience: userProfile.get('sign_in_experience')
        });
        let withdrawData = {
            score: userProfile.get('score'),
            min_price: userProfile.get('min_withdrawals_money'),
            max_price: userProfile.get('user_max_withdrawals_money'),
            max_day_price: userProfile.get('max_withdrawals_money'),
            name: userProfile.get('name'),
            alipay_account: userProfile.get('alipay_account'),
            identity_card_number: userProfile.get('identity_card_number'),
            is_binding_alipay: userProfile.get('is_binding_alipay')
        };
        let welfareCards = signInInfo.get('sign_in_result').get('welfare_cards');
        let welfareModal = null;
        if(welfareCards) {
            welfareModal =
                <WelfareModal
                    title={"连续签到" + signInInfo.get('sign_in_result').get('sign_in_days') + "天"}
                    subTitle={welfareCards.size}
                    isVisible={signInInfo.get('visible')}
                    welfareData={welfareCards}
                    closeModal={()=>this.closeWelfareModal(signInInfo.get('sign_in_result').get('experience'))}
                    goPage={() => {
                        this.navigatorPush({
                            component: WelfareContainer,
                            name: 'welfare',
                            title: '看房卡',
                            actionLog: actionType.BA_MINE_SIGN,
                            bp: this.pageId,
                            backLog: actionType.BA_MINE_WELFARE_BACK
                        });
                        actions.signInVisibleChanged(false);
                        actions.signInBtnVisibleChanged("1");
                        ActionUtil.setAction(actionType.BA_MINE_SIGN_FIND);
                    }}
                    goTitle='看房卡怎么用'
                />
        } else {
            welfareModal =
                <WelfareModal
                    title={"连续签到" + signInInfo.get('sign_in_result').get('sign_in_days') + "天"}
                    icon={{url: require("../images/gift.png"), style: {width: 34, height: 34}}}
                    isVisible={signInInfo.get('visible')}
                    closeModal={()=>{ActionUtil.setAction(actionType.BA_MINE_SIGN_DELETE);actions.signInVisibleChanged(false);actions.signInBtnVisibleChanged("1");}}
                    goPage={() => {
                        this.navigatorPush({
                            component: SignInContainer,
                            signInfo: signInData,
                            name: 'signin',
                            title: '签到礼包',
                            actionLog: actionType.BA_MINE_SIGN,
                            bp: this.pageId,
                            ackLog: actionType.BA_MINE_CREDIT_BACK
                        });
                        actions.signInVisibleChanged(false);
                        actions.signInBtnVisibleChanged("1");
                        ActionUtil.setAction(actionType.BA_MINE_SIGN_FIND);
                    }}
                >
                    <Text style={[styles.h5, styles.modalContent]}>
                        <Text style={[styles.h2, styles.addNum]}>+</Text>
                        <Text style={[styles.h1, styles.scoreNum]}>{ signInInfo.get('sign_in_result').get('experience')}</Text>
                        经验
                    </Text>
                </WelfareModal>
        }
        return (
            <View style={styles.container}>
                {welfareModal}

                <Header title='我的' style={styles.bgHeader} fontStyle={styles.whiteText}>
                    <TouchableWithoutFeedback
                        onPress={() => this.navigatorPush({component: SettingContainer, name: 'settings', title: '设置', actionLog: actionType.BA_MINE_SET})}>
                        <Image
                            source={require('../images/icon/setting.png')}
                            style={[styles.settingIcon, styles.center]}
                        />
                    </TouchableWithoutFeedback>
                </Header>
                <ScrollView
                    bounces={false}
                    style={styles.scrollBox}
                    automaticallyAdjustContentInsets={false}
                >
                    <BasicInfo userProfile={userProfile} navigatorPush={this.navigatorPush}/>

                    <UserAccount navigatorPush={this.navigatorPush} withdrawData={withdrawData} {...this.props} />

                    <LinkSection
                        linkStyle={{height: 70, marginBottom: 15}}
                        iconBoxStyle={{marginTop: -12}}
                        icon={{
                            url: require('../images/icon/calendar.png'),
                            style: {width: 12, height: 12},
                            bgColor: '#d883aa'
                        }}
                        onPress={() => this.navigatorPush({component: SignInContainer, signInfo: signInData, name: 'signin', title: '签到礼包', actionLog: actionType.BA_MINE_SIGN, bp: this.pageId, backLog: actionType.BA_MINE_CREDIT_BACK})}
                    >
                        <View style={{flexDirection: 'column', flex: 1}}>
                            <View style={{flexDirection: 'row', height: 22}}>
                                <Text style={{marginRight: 6, lineHeight: 22}}>连续签到：{userProfile.get('sign_in_days')}天</Text>
                                {userProfile.get('is_signed_in') == "0" ?<Image source={require('../images/red_dot.png')} style={{width: 8, height: 8}} />:null}
                            </View>
                            <Text style={styles.signInPrompt}>再签到{userProfile.get('go_on_sign_in_day')}天
                                领签到礼包</Text>
                        </View>
                        {
                            !appUserConfig.get('isSignIn') || userProfile.get('is_signed_in') == "0" ?
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        ActionUtil.setActionWithExtend(actionType.BA_MINE_SIGN_INPUT, {'signDays': (Number(userProfile.get('sign_in_days')) + 1 ) + ""});
                                        actions.fetchSignInInfo();
                                        }}
                                >
                                    <View style={styles.signInWarp}><Text style={styles.signInBtn}>签到</Text></View>
                                </TouchableWithoutFeedback>
                                :
                                <Text style={styles.signInPrompt}>今日已签到</Text>
                        }
                    </LinkSection>

                    <LinkSection
                        linkStyle={{marginBottom: 15}}
                        icon={{
                            url: require('../images/icon/welfare.png'),
                            style: {width: 13.5, height: 11},
                            bgColor: '#66a1e7'
                        }}
                        onPress={() => this.navigatorPush({component: WelfareContainer, name: 'welfare', title: '看房卡', actionLog: actionType.BA_MINE_WELFARE_INPUT, backLog: actionType.BA_MINE_WELFARE_BACK})}
                    >
                        <Text style={styles.flex}>看房卡</Text>
                        <Text>{userProfile.get('welfare_card_count')}</Text>
                    </LinkSection>

                    <LinkSection
                        linkStyle={{borderBottomWidth: 1/PixelRatio.get(), borderColor: '#d9d9d9'}}
                        icon={{
                            url: require('../images/icon/phone.png'),
                            style: {width: 11.5, height: 11.5},
                            bgColor: '#54d89f'
                        }}
                        onPress={() => this.navigatorPush({component: ContactHouseContainer, name: 'contactHouse', title: '查看的房源', actionLog: actionType.BA_MINE_CONNECT, backLog: actionType.BA_MINE_CONTACT_RETURN})}
                    >
                        <Text style={styles.flex}>查看的房源</Text>
                        <Text>{userProfile.get('contacted')}</Text>
                    </LinkSection>

                    <LinkSection
                        linkStyle={{marginBottom: 15}}
                        icon={{
                            url: require('../images/icon/money.png'),
                            style: {width: 13, height: 12.5},
                            bgColor: '#54d89f'
                        }}
                        onPress={() => this.navigatorPush({component: InputHouseContainer, name: 'inputHouse', title: '发布的房源', actionLog: actionType.BA_MINE_RELEASED, backLog: actionType.BA_MINE_RELEASE_RETURN})}
                    >
                        <Text style={styles.flex}>发布的房源</Text>
                        <Text>{userProfile.get('published')}</Text>
                    </LinkSection>

                </ScrollView>
                <BindPromptModal
                    actions={actions}
                    controller={userControlData}
                    navigator={navigator}
                    withdrawData={withdrawData}
                />
            </View>
        );
    }

    componentDidMount() {
        let {userProfile, actions} = this.props;
        if(!userProfile.get('uid')) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchUserProfile();
            });
        }
    }

    navigatorPush = (value) => {
        let {actionLog, ...ops} = value;
        ActionUtil.setAction(actionLog);

        this.props.navigator.push({
            bp: actionType.BA_MINE,
            hideNavBar: false,
            ...ops
        })
    }

    closeWelfareModal = (exp) => {
        let {actions} = this.props;
        ActionUtil.setAction(actionType.BA_MINE_SIGN_DELETE);
        actions.signInVisibleChanged(false);
        actions.signInBtnVisibleChanged("1");
        Toast.show('签到成功得' + exp + '个经验', {
            duration: Toast.durations.SHORT,
            position: Toast.positions.CENTER
        });
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
                <Image
                    style={styles.profileAvatar}
                    source={require('../images/avatar.png')}
                />
                <View style={styles.flex}>
                    <Text style={[styles.mobileText, styles.whiteText]}>{showMobile}</Text>
                </View>
                <TouchableWithoutFeedback
                    onPress={() => this.props.navigatorPush({component: AboutEXPContainer, data: {level: userProfile.get('level'), exp: userProfile.get('user_experience')}, name: 'exp', title: '我的等级', actionLog: actionType.BA_MINE_MEMBER, backLog: actionType.BA_MINE_GRADE_BACK})}>
                    <View style={[styles.level, styles.center]}><Text
                        style={styles.whiteText}>V{userProfile.get('level')}会员</Text></View>
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
        let {userProfile, withdrawData, messageNotice, navigator} = this.props;

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
                        <Text style={{marginRight: 10}}>积分账户：{userProfile.get('score')}分</Text>
                        <TouchableWithoutFeedback
                            onPress={() => this.props.navigatorPush({component: ScoreListContainer, name: 'scoreList', title: '积分明细', backLog: actionType.BA_MINE_POINTS_RETURN, accountData: withdrawData})}>
                            <View><Text style={{color: '#04c1ae'}}>查看</Text></View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={[styles.row, {marginTop: 15}]}>
                    <TouchableWithoutFeedback onPress={() => this.goCharge()}>
                        <View style={[styles.flex, styles.center, styles.btnColor, {marginRight: 15}]}><Text
                            style={{color: '#ff6d4b'}}>充值</Text></View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => this.goWithdraw(withdrawData)}>
                        <View style={[styles.flex, styles.center, styles.btnColor]}><Text
                            style={{color: '#ff6d4b'}}>提现</Text></View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        );
    }

    goCharge() {
        ActionUtil.setAction(actionType.BA_MINE_RECHANGE);
        let {navigator, appConfig, appUserConfig, actionsApp} = this.props;

        if(appUserConfig.get('isNew') && appUserConfig.get('verifiedStatus') == "0") {
            ActionUtil.setActionWithExtend(actionType.BA_MINE_RECHANGE_ENSURE, {"uid": global.guid});
            actionsApp.verifiedNoticeSet({
                visible: true,
                msg: "充值请先进行身份认证",
                from: "charge"
            });
        } else if (appConfig.get('showRecharge')) {
            navigator.push({
                component: RechargeContainer,
                name: 'recharge',
                title: '充值',
                bp: actionType.BA_MINE,
                hideNavBar: false
            });
        } else {
            Alert.alert('温馨提示', '充值功能正在赶过来，敬请期待！', [{text: '忍一忍'}]);
        }
    }

    goWithdraw(value) {
        ActionUtil.setAction(actionType.BA_MINE_CASH);
        let {navigator, actions, appUserConfig, actionsApp} = this.props;
        let verfifiedStatus = appUserConfig.get('verifiedStatus');

        if(verfifiedStatus != "2") {
            if(verfifiedStatus == "0") {
                ActionUtil.setActionWithExtend(actionType.BA_MINE_IDENTITY_REVIEWBOX, {"uid": global.guid});
            } else if(verfifiedStatus == "1") {
                ActionUtil.setActionWithExtend(actionType.BA_MINE_IDENTITY_NOREVIEWBOX, {"uid": global.guid});
            }
            
            actionsApp.verifiedNoticeSet({
                visible: true,
                msg: verfifiedStatus == "0" ? "提现请先进行身份认证" : (verfifiedStatus == "1" ? "您的身份信息审核中\n暂不可提现" : "认证失败\n请重新认证"),
                from: verfifiedStatus == "0" ? "noVerify" : (verfifiedStatus == "1" ? "inVerify" : "")
            });
        } else if (parseInt(value.score) < parseInt(value.min_price)) {
            Alert.alert('', '余额超过' + value.min_price + '元才能提现哦', [{text: '知道了'}]);
        } else if (value.name && value.alipay_account && value.identity_card_number) {
            navigator.push({
                component: WithdrawContainer,
                name: 'withdraw',
                data: value,
                title: '提现',
                bp: actionType.BA_MINE,
                backLog: actionType.BA_MINE_CASH_RETURN,
                hideNavBar: false
            });
        } else if (value.alipay_account) {
            navigator.push({
                component: BindAlipayContainer,
                name: 'bindAlipay',
                data: value,
                title: '绑定支付宝',
                hideNavBar: false,
                backLog: actionType.BA_MINE_ZHIFUBAO_BACK
            })
        } else {
            ActionUtil.setAction(actionType.BA_MINE_ZHIFUBAO_BOXONVIEW);
            actions.setBindPromptVisible(true);
        }
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
        paddingHorizontal: 15,
        backgroundColor: '#04c1ae',
        borderBottomWidth: 0
    },
    whiteText: {
        color: '#fff'
    },
    settingIcon: {
        marginLeft: -20,
        width: 20,
        height: 20
    },
    scrollBox: {
        marginBottom: (Platform.OS == 'ios') ? 60 : 0
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
        borderWidth: 2,
        borderColor: '#fff'
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
        borderWidth: 1 / PixelRatio.get(),
        borderRightWidth: 0,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },
    signInPrompt: {
        fontSize: 12,
        color: '#8d8c92'
    },
    signInWarp: {
        position: 'absolute',
        right: 0,
        top: 3,
        height: 35,
        width: 100,
        borderRadius: 17.5,
        backgroundColor: '#FF6D4B',
        alignItems: 'center',
        justifyContent: 'center'
    },
    signInBtn: {
        color: '#fff'
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
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#ff6d4b',
        borderRadius: 2
    },
    addNum: {
        letterSpacing: 6,
        marginTop: -3
    },
    scoreNum: {
        letterSpacing: 1
    },
    h1: {
        fontSize: 30
    },
    h2: {
        fontSize: 27
    },
    h5: {
        fontSize: 15
    },
    modalContent: {
        marginTop: -5,
        marginBottom: 20
    }
});
