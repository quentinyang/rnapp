import {React, Component, Text, View, ScrollView, TouchableWithoutFeedback, StyleSheet, Image, PixelRatio, Alert, Linking, Platform, InteractionManager} from 'nuke';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog';

export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_MINE;
    }

    render() {
        return (
            <ScrollView
                style={styles.container}
                automaticallyAdjustContentInsets={false}
            >
                <View style={[styles.alignItems, styles.justifyContent, styles.box]}>
                    <Text style={[styles.topTip]}>已连续签到</Text>
                    <View>
                        <Image source={require("../images/calendar_panel.png")} style={styles.panel} />
                        <Text style={[styles.h5, styles.days]}><Text style={styles.h1}>5</Text>天</Text>
                    </View>
                    <Text style={[styles.bottomTip]}>每天签到 经验<Text style={[styles.mediumFont, styles.green, styles.add]}> + </Text><Text style={styles.green}>3</Text></Text>
                </View>

                <View style={[styles.row, styles.alignItems, styles.titleBox]}>
                    <View style={styles.bar}></View>
                    <Text style={[styles.mediumFont]}>待领取积分</Text>
                </View>

                <View style={styles.unsignList}>
                    <View style={[styles.row, styles.alignItems, styles.unsignItem, styles.unsignFirst]}>
                        <View>
                            <Image source={require('../images/s_calendar_panel.png')} style={styles.sPanel} />
                            <Text style={styles.totalDays}>15</Text>
                        </View>
                        <Text style={styles.unsignTip}>连续签到15天</Text>
                        <Text>积分<Text style={styles.orange}> + </Text><Text style={[styles.h2, styles.orange]}>6</Text></Text>
                        <View style={styles.vline}></View>
                        <Text style={styles.grey}>未达成</Text>
                    </View>
                </View>

                <View style={[styles.row, styles.alignItems, styles.titleBox]}>
                    <View style={styles.bar}></View>
                    <Text style={[styles.mediumFont]}>已领取积分</Text>
                </View>

                <View>
                    <View style={[styles.row, styles.alignItems, styles.signItem, styles.signFirst]}>
                        <View>
                            <Text>连续签到7天</Text>
                            <Text style={[styles.grey, styles.h6]}>05-05 10:45</Text>
                        </View>
                        <Text style={styles.h3}>+ 3</Text>
                    </View>
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
        backgroundColor: '#f8f8f8'
    },
    topTip: {
        marginTop: 17,
        marginBottom: 12
    },
    panel: {
        width: 93,
        height: 81
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
        marginTop: 15,
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
        paddingHorizontal: 15,
        paddingVertical: 16,
        shadowColor: "#000",
        shadowRadius: 4,
        shadowOffset: {
            height: 1,
            width: 0
        }
    },
    sPanel: {
        width: 22,
        height: 25
    },
    totalDays: {
        position: 'absolute',
        bottom: 3,
        left: 3,
        fontSize: 13,
        backgroundColor: 'transparent'
    },
    vline: {
        width: 1,
        height: 37,
        backgroundColor: '#D9D9D9',
        marginLeft: 15,
        marginRight: 20
    },
    unsignTip: {
        marginLeft: 8,
        marginRight: 40
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

