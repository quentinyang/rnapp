import {React, Component, Text, View, ScrollView, StyleSheet, Image, PixelRatio, InteractionManager} from 'nuke';
import WelfareCard from '../components/WelfareCard';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        ActionUtil.setActionWithExtend(actionType.BA_MINE_CREDIT_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {signIn, route} = this.props;
        let signInfo = route.signInfo, unsignArr = signIn.get('future_welfare_cards'), signArr = signIn.get('collected_welfare_cards');

        let unsignList = unsignArr.map((item, index) => {
            return (
                <View style={styles.wfBox} key={index}>
                    <Text style={{marginBottom: 10}}><Text style={styles.orange}>{item.get('sign_in_days')}天</Text>签到获得{item.get('total')}张</Text>
                    {item.get('welfare_cards').map((card, ins) => {
                        return <WelfareCard
                                    item={card}
                                    key={ins}
                                    leftFlex={4}
                                    icon={require('../images/welfare/welfare_white_available.png')}
                                    wrapStyle={ins != (item.get('welfare_cards').size - 1) ? {marginBottom: 10}:null}
                                />
                    })}
                </View>
            );
        });

        let signList = signArr.get('total') > 0 ?
            (
                <View style={styles.wfBox}>
                    {signArr.get('welfare_cards').map((item, index) => {
                        return <WelfareCard
                                    item={item}
                                    key={index}
                                    leftFlex={4}
                                    icon={require('../images/welfare/welfare_white.png')}
                                    source={require('../images/welfare/got.png')}
                                    wrapStyle={index != (signArr.get('welfare_cards').size - 1) ?{marginBottom: 10}:null}
                                />
                    })}
                </View>
            ):null;

        return (
            <ScrollView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
            >
                <View style={[styles.alignItems, styles.row, styles.box]}>
                    <View style={[styles.flex, styles.row, styles.alignItems]}><Text>连续签到：</Text><Text style={[styles.h1, styles.orange, {marginTop: -6}]}>{signInfo.get('sign_in_days')} </Text><Text>天</Text></View>
                    <Text style={[styles.h6, styles.grey]}>每天签到 经验 + {signInfo.get('experience')}</Text>
                </View>

                <View style={[styles.row, styles.alignItems, styles.titleBox]}>
                    <View style={styles.bar}></View>
                    <Text style={[styles.mediumFont]}>待领取礼包</Text>
                </View>

                <View style={styles.unsignList}>
                    {unsignList}
                </View>

                {signArr.get('welfare_cards') && signArr.get('welfare_cards').size ?
                    <View style={[styles.row, styles.alignItems, styles.titleBox]}>
                        <View style={styles.bar}></View>
                        <Text style={[styles.mediumFont]}>已领取礼包<Text style={styles.h5}>（共获{signArr.get('total')}张）</Text></Text>
                    </View>
                : null }

                <View style={styles.unsignList}>
                    {signList}
                </View>
            </ScrollView>
        )
    }

    componentDidMount() {
        let {actions} = this.props;
        InteractionManager.runAfterInteractions(() => {
            actions.fetchSignInfo();
        });
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    alignItems: {
        alignItems: "center"
    },
    justifyContent: {
        justifyContent: "center"
    },
    container: {
        flex: 1,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    mediumFont: {
        fontWeight: '500'
    },
    h1: {
        fontSize: 30
    },
    h2: {
        fontSize: 20
    },
    h3: {
        fontSize: 19
    },
    h5: {
        fontSize: 15
    },
    h6: {
        fontSize: 12
    },
    green: {
        color: '#04C1AE'
    },
    orange: {
        color: '#FF6D4B'
    },
    grey: {
        color: '#8D8C92'
    },
    box: {
        paddingHorizontal: 20,
        height: 75,
        backgroundColor: '#f8f8f8'
    },
    topTip: {
        marginTop: 17,
    },
    panel: {
        width: 93,
        height: 75
    },
    days: {
        position: 'absolute',
        bottom: 16,
        left: 31,
        letterSpacing: 2
    },
    add: {
        lineHeight: 20,
        textAlignVertical: 'top'
    },
    bottomTip: {
        marginBottom: 22
    },
    titleBox: {
        height: 51,
        padding: 15
    },
    bar: {
        width: 3,
        height: 15,
        backgroundColor: '#04C1AE',
        marginRight: 8,
        borderRadius: 2
    },
    unsignList: {
        paddingHorizontal: 15
    },
    unsignFirst: {
        marginBottom: 15
    },
    unsignItem: {
        height: 70,
        backgroundColor: '#F8F8F8',
        paddingLeft: 10,
        marginBottom: 1,
        paddingVertical: 16,
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
            width: 0
        }
    },
    wfBox: {
        marginBottom: 15,
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 2
    },
    sPanel: {
        width: 22,
        height: 25
    },
    totalDays: {
        position: 'absolute',
        bottom: 3,
        left: 0,
        right: 0,
        fontSize: 13,
        textAlign: "center",
        backgroundColor: 'transparent'
    },
    unsignTip: {
        marginLeft: 8
    },
    vline: {
        width: 1,
        height: 37,
        backgroundColor: '#D9D9D9',
        marginLeft: 15
    },
    undone: {
        width: 70,
        textAlign: "center"
    },
    signItem: {
        justifyContent: 'space-between',
        borderColor: '#D9D9D9',
        borderBottomWidth: 1/PixelRatio.get(),
        padding: 15
    },
    signFirst: {
        borderTopWidth: 1/PixelRatio.get()
    }
});

