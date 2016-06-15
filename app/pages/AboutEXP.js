import {
    React,
    Component,
    Text,
    View,
    ScrollView,
    Image,
    PixelRatio,
    Dimensions,
    StyleSheet
} from 'nuke';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class AboutEXP extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView automaticallyAdjustContentInsets={false}>
                <View style={[styles.myExp, styles.center]}>
                    <View style={{marginBottom: 10}}>
                        <View style={[styles.avatarBox, styles.center]}>
                            <Image
                                style={styles.userAvatar}
                                source={require('../images/bureau_avatar.png')}
                            />
                        </View>
                        <View style={[styles.center, styles.vip]}>
                            <Text style={{fontSize: 12, color: '#fff'}}>V1</Text>
                        </View>
                    </View>
                    <Text style={{fontSize: 12, color: '#8d8c92'}}><Text>115 </Text>经验</Text>
                </View>
                <View style={[styles.row, styles.titleBox]}>
                    <View style={styles.titleIcon}></View>
                    <Text>如何获得经验</Text>
                </View>
                <View style={styles.getExpList}>
                    <View style={[styles.getExpItem, styles.row]}>
                        <View style={[styles.expIconBox, styles.center, {backgroundColor: '#f47e87'}]}>
                            <Image style={{width: 15, height: 15}} source={require('../images/icon/calendar.png')} />
                        </View>
                        <Text style={styles.flex}>每日签到</Text>
                        <Text style={styles.expItemValue}>经验<Text style={{color: '#ff6d4b'}}> + <Text style={{color: '#ff6d4b', fontSize: 23}}>3</Text></Text></Text>
                    </View>
                    <View style={[styles.getExpItem, styles.row]}><Image /><Text>看房成功</Text><Text>经验<Text>+5</Text></Text></View>
                    <View style={[styles.getExpItem, styles.row, {borderBottomWidth: 0}]}><Image /><Text>发房成功</Text><Text>经验<Text>+5</Text></Text></View>
                </View>
                <View style={[styles.row, styles.titleBox]}>
                    <View style={styles.titleIcon}></View>
                    <Text>会员俱乐部</Text>
                </View>
                <View style={styles.clubDesc}><Text style={styles.font15}>会员等级一共包括7级，会员等级由经验决定。经验越高，会员等级越高。</Text></View>
                <View style={styles.clubList}>
                    <View style={[styles.row, styles.clubItem]}>
                        <View style={[styles.vipItem, styles.center, {backgroundColor: '#faae6c'}]}><Text style={styles.vipItemText}>V1</Text></View>
                        <View style={[styles.flex, {flexDirection: 'column'}]}>
                            <View style={[styles.progress, {backgroundColor: '#faae6c'}]}></View>
                            <View style={styles.progressDetail}><Text style={styles.font15}>1</Text><Text style={styles.font15}>100</Text></View>
                        </View>
                    </View>
                </View>
            </ScrollView>
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
    font15: {
        fontSize: 15,
    },
    myExp: {
        height: 115,
        flexDirection: 'column'
    },
    avatarBox: {
        width: 50,
        height: 50,
        backgroundColor: '#eee',
        borderRadius: 25
    },
    userAvatar: {
        width: 30.5,
        height: 30
    },
    vip: {
        marginLeft: 32,
        marginTop: -18,
        width: 20,
        height: 20,
        borderColor: '#fff',
        borderWidth: 1/PixelRatio.get(),
        borderRadius: 10,
        backgroundColor: '#faae6c'
    },
    titleBox: {
        paddingHorizontal: 15,
        paddingBottom: 15
    },
    titleIcon: {
        marginRight: 8,
        width: 3,
        height: 15,
        borderRadius: 2,
        backgroundColor: '#04c1ae'
    },
    getExpList: {
        marginHorizontal: 15,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9',
        borderRadius: 2
    },
    getExpItem: {
        height: 55,
        borderBottomWidth: 1,
        borderColor: '#d9d9d9'
    },
    expIconBox: {
        marginRight: 8,
        width: 27,
        height: 27,
        borderRadius: 13.5
    },
    expItemValue: {
        width: 65
    },
    clubDesc: {
        padding: 15,
        backgroundColor: '#f8f8f8'
    },
    clubList: {
        padding: 15
    },
    clubItem: {
        marginBottom: 20
    },
    vipItem: {
        marginRight: 25,
        width: 45,
        height: 45,
        borderRadius: 22.5
    },
    vipItemText: {
        fontSize: 25,
        color: '#fff'
    },
    progress: {
        marginBottom: 10,
        width: (Dimensions.get('window').width - 70)/7,
        height: 12,
        borderRadius: 12,
    },
    progressDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: (Dimensions.get('window').width - 70)/7 + 18,
    }

});