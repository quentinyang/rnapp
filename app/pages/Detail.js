import React from 'react-native'
import { Component, View, Text, StyleSheet } from 'nuke'

export default class Detail extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View>
                <BaseInfo />

                <View style={[styles.itemContainer, styles.row]}>
                    <Text style={styles.bar}></Text>
                    <Text style={styles.baseSize}>同小区房源</Text>
                </View>
            </View>
        );

    }
}

class BaseInfo extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <View style={[styles.row, styles.name]}>
                        <Text style={{fontSize: 19}}>发动机可开放时间</Text>
                        <Text style={{fontSize: 12, color: '#8d8c92'}}>查看次数:{1}</Text>
                    </View>
                    <Text style={styles.baseSize}>发动机可<Text style={styles.baseSpace}>开放时间</Text></Text>
                </View>

                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>户型:</Text><Text style={[styles.baseSize, styles.baseSpace]}>开放时间</Text></View>
                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>面积:</Text><Text style={[styles.baseSize, styles.baseSpace]}>开放时间</Text></View>
                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>总价:</Text><Text style={[styles.baseSize, styles.baseSpace]}>开放时间</Text></View>
                <View style={[styles.itemContainer, styles.row]}><Text style={styles.baseSize}>单价:</Text><Text style={[styles.baseSize, styles.baseSpace]}>开放时间</Text></View>
                <View style={styles.itemContainer}>
                    <View style={styles.row}><Text style={styles.baseSize}>状态:</Text><Text style={[styles.baseSize, styles.baseSpace, {color: '#ff6d4b'}]}>发动</Text></View>
                    <Text style={styles.statusList}>234345附近的开始发送了房间</Text>
                </View>

                <View style={[styles.itemContainer, styles.row]}>
                    <Text>Icon</Text>
                    <Text style={{fontSize: 15, marginLeft: 6}}>查看房东电话需要消耗 4 积分</Text>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    itemContainer: {
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderBottomColor: '#d9d9d9',
        padding: 15
    },
    baseSize: {
        fontSize: 16
    },
    row: {
        flex: 1,
        flexDirection: 'row'
    },
    name: {
        justifyContent: 'space-between',
        marginBottom: 10
    },
    baseSpace: {
        marginLeft: 12
    },
    statusList: {
        fontSize: 12,
        color: '#8d8c92',
        marginTop: 8
    },
    bar: {
        width: 3,
        height: 15,
        backgroundColor: '#04C1AE',
        marginRight: 8,
        borderRadius: 2
    }
});