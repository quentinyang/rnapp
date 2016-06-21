import {React, Component, Text, View, ScrollView, TouchableWithoutFeedback, StyleSheet, Image, PixelRatio, Alert, Linking, Platform} from 'nuke';
import TouchWebContainer from "../containers/TouchWebContainer";
import LoginContainer from '../containers/LoginContainer';
import * as common from '../constants/Common';
import AsyncStorageComponent from '../utils/AsyncStorageComponent';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';
import deviceInfo from '../utils/DeviceInfo';


export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_MINE;
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                contentContainerStyle={{flex: 1}}
                automaticallyAdjustContentInsets={false}
            >
                <View style={styles.box}>
                    <LinkBox
                        navigator={this.props.navigator}
                        data={{
                            url:'http://mp.weixin.qq.com/s?__biz=MzAxNDYyMTA0NQ==&mid=401036326&idx=1&sn=45548dc3dfb63021c4e60df9058df5df#rd',
                            title: '积分规则',
                            name: 'score rule',
                            component: TouchWebContainer
                        }}
                    />
                    <LinkBox
                        navigator={this.props.navigator}
                        data={{
                            url:'http://www.fangyuan360.cn/agreement/',
                            title: '第一房源用户协议',
                            name: 'user rule',
                            component: TouchWebContainer
                        }}
                    />
                </View>
                <View style={styles.box}>
                    <LinkBox
                        onPress={this.goAppStore}
                        navigator={this.props.navigator}
                        title='喜欢第一房源吗？鼓励一下吧'
                    />
                </View>
                <TouchableWithoutFeedback onPress={this.loginOut}>
                    <View style={[styles.box, styles.linkBox, styles.center]}>
                        <Text style={{fontSize: 16, color: '#3e3e3e'}}>退出</Text>
                    </View>
                </TouchableWithoutFeedback>
                <Text style={styles.version}>{'V' + deviceInfo.version}</Text>

                <View style={styles.bottomInfo}>
                    <View style={[styles.row, styles.center]}>
                        <Text style={styles.callInfo}>客服电话:</Text>
                        <TouchableWithoutFeedback onPress={this.callCenter}>
                            <View><Text style={[styles.callInfo, styles.callNum]}>13222740214</Text></View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </ScrollView>
        )
    }

    callCenter = () => {
        let url = "tel:13222740214";
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('Don\'t know how to open URI: ' + url);
            }
        });
    };

    goAppStore = () => {
        let url = '';

        if(Platform.OS === 'ios') {
            url = 'https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=1086107243&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8';
        } else {
            url = 'market://details?id=com.xinyi.fy360';
        }
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log('Don\'t know how to open URI: ' + url);
            }
        });
    };

    loginOut = () => {
        let {navigator, actionsApp} = this.props;
        Alert.alert(
            '提示',
            '确定要退出吗？',
            [
            {text: '取消'},
            {text: '确认', onPress: () => {
                actionsApp.deletePush(); // 解绑个推
                AsyncStorageComponent.multiRemove([common.USER_TOKEN_KEY, common.USER_ID]);
                ActionUtil.setUid("");
                gtoken = '';
                AsyncStorageComponent.get('user_phone')
                .then((value) => {
                    navigator.resetTo({
                        component: LoginContainer,
                        name: 'login',
                        title: '登录',
                        phone: value,
                        hideNavBar: true,
                        bp: this.pageId
                    });
                })
            }}
            ]
        );
    };
}

class LinkBox extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {onPress, navigator, data, title} = this.props;
        return (
            <TouchableWithoutFeedback onPress={onPress? onPress:() => navigator.push(data)}>
                <View style={styles.linkBox}>
                    <Text style={styles.linkContent}>{title ? title: data.title}</Text>
                    <Image source={require('../images/next.png')} style={styles.arrowIcon} />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    container: {
      flex: 1,
      backgroundColor: '#eee'
    },
    box: {
        marginTop: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1/PixelRatio.get(),
        borderTopColor: '#ccc'
    },
    linkBox: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 45,
        paddingHorizontal: 10,
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#ccc'
    },
    linkContent: {
        flex: 1,
        fontSize: 16,
        color: '#3e3e3e'
    },
    arrowIcon: {
        width: 8,
        height: 18
    },
    center: {
        justifyContent: 'center'
    },
    version: {
        marginTop: 10,
        color: '#888',
        textAlign: 'center'
    },
    bottomInfo: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0
    },
    callInfo: {
        fontSize: 12,
        color: '#8d8c92'
    },
    callNum: {
        marginLeft: 3,
        textDecorationLine: 'underline'
    }
});
