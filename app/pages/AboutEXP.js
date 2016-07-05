import {
    React,
    Component,
    Text,
    View,
    ScrollView,
    Image,
    PixelRatio,
    Dimensions,
    StyleSheet,
    InteractionManager
} from 'nuke';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class AboutEXP extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_MINE_GRADE;
        ActionUtil.setActionWithExtend(actionType.BA_MINE_GRADE_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {route, expLevel} = this.props;
        let expListData = expLevel.get('get_experience_way') || null,
            levelListData = expLevel.get('level_rule') || null;

        return (
            <ScrollView automaticallyAdjustContentInsets={false}>
                <View style={[styles.myExp, styles.center]}>
                    <View style={{marginBottom: 10}}>                        
                        <Image
                            style={styles.avatarBox}
                            source={require('../images/avatar.png')}
                        />                        
                        <View style={[styles.center, styles.vip]}>
                            <Text style={{fontSize: 12, color: '#fff'}}>V{route.data.level}</Text>
                        </View>
                    </View>
                    <Text style={{fontSize: 12, color: '#8d8c92'}}><Text>{route.data.exp} </Text>经验</Text>
                </View>

                <View style={[styles.row, styles.titleBox]}>
                    <View style={styles.titleIcon}></View>
                    <Text>如何获得经验</Text>
                </View>
                <ExpSection expListData={expListData} />

                <View style={[styles.row, styles.titleBox]}>
                    <View style={styles.titleIcon}></View>
                    <Text>会员俱乐部</Text>
                </View>
                <View style={styles.clubDesc}>
                    <Text style={styles.font15}>会员等级一共包括7级，会员等级由经验决定。经验越高，会员等级越高。</Text>
                </View>
                <LevelSection levelListData={levelListData} />

            </ScrollView>
        );
    }

    componentWillMount() {
        let {actions} = this.props;
        InteractionManager.runAfterInteractions(() => {
            actions.fetchExpLevel();
        });
    }
}

class ExpSection extends Component {
    expConfig = {
        'daily_sign_in': {
            name: '每日签到',
            url: require('../images/icon/calendar.png'),
            style: {
                width: 15,
                height: 15
            },
            bgColor: {backgroundColor: '#f47e87'}
        },
        'see_house': {
            name: '看房成功',
            url: require('../images/icon/house.png'),
            style: {
                width: 16,
                height: 14.5
            },
            bgColor: {backgroundColor: '#65dda9'}
        },
        'input_house': {
            last: true,
            name: '发房成功',
            url: require('../images/icon/money.png'),
            style: {
                width: 16,
                height: 15.5
            },
            bgColor: {backgroundColor: '#faae6c'}
        }
    };

    constructor(props) {
        super(props);
    }

    render() {
        let {expListData} = this.props;
        let expList = expListData && expListData.map((item, index) => {
            let expItem = this.expConfig[item.get('action')];
            return (
                <View style={[styles.getExpItem, styles.row, expItem.last?{borderBottomWidth: 0}:null]} key={index}>
                    <View style={[styles.expIconBox, styles.center, expItem.bgColor]}>
                        <Image style={expItem.style} source={expItem.url} />
                    </View>
                    <Text style={styles.flex}>{expItem.name}</Text>
                    <Text style={styles.expItemValue}>经验<Text style={{color: '#ff6d4b'}}> + <Text style={{color: '#ff6d4b', fontSize: 23}}>{item.get('experience')}</Text></Text></Text>
                </View>
            );
        });

        return (
            <View style={styles.getExpList}>
                {expList}
            </View>
        );
    }
}

class LevelSection extends Component {
    levelConfig = ['#faae6c','#e78734','#fb5727', '#ff184f', '#ff2b98', '#ba2bff', '#6b2bff'];

    constructor(props) {
        super(props);
    }

    render() {
        let {levelListData} = this.props;
        let size = levelListData && levelListData.size;
        let levelList = levelListData && levelListData.map((item, index) => {
            let progressWidth = (Dimensions.get('window').width - 100)/size*(index+1),
                progressDetailWidth = (index != size-1) ? (progressWidth + 18) : progressWidth;

            return (
                <View style={[styles.row, styles.clubItem]} key={index}>
                    <View style={[styles.vipItem, styles.center, {backgroundColor: this.levelConfig[index]}]}>
                        <Text style={styles.vipItemText}>V{item.get('level')}</Text>
                    </View>
                    <View style={[styles.flex, {flexDirection: 'column'}]}>
                        <View style={[styles.progress, {width: progressWidth}, {backgroundColor: this.levelConfig[index]}]}></View>
                        <View style={[styles.progressDetail, {width: progressDetailWidth}]}>
                            <Text style={styles.font15}>{item.get('min')}</Text><Text style={styles.font15}>{item.get('max')}</Text>
                        </View>
                    </View>
                </View>
            );
        });

        return (
            <View style={styles.clubList}>
                {levelList}
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
    font15: {
        fontSize: 15,
    },
    myExp: {
        height: 115,
        flexDirection: 'column'
    },
    avatarBox: {
        width: 50,
        height: 50
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
        marginTop: 7,
        marginBottom: 10,
        height: 12,
        borderRadius: 12
    },
    progressDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});