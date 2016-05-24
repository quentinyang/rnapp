'use strict';
import {React, Component, ListView, View, Text, Image, PixelRatio, StyleSheet} from 'nuke'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export default class SearchHistory extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <ListView
                dataSource={ds.cloneWithRows([{"id": "1", "name": "ddd"}, {"id": "2", "name": "dddcc"}])}
                renderRow={this._renderRow}
                initialListSize={10}
                pageSize={10}
                renderFooter={this._renderFooter}
                renderHeader={this._renderHeader}
            />
        );
    }
    _renderRow(rowDate) {
        return (
            <View style={[styles.item, styles.row, styles.justifyBetween]}>
                <Text style={styles.baseColor}>反馈房间打开</Text>
                <Text style={[styles.grayColor, styles.smallFont]}>约8套在售</Text>
            </View>
        );
    }
    _renderFooter() {
        return (
            <View style={[styles.justifyContent, styles.center, styles.bottomTop]}>
                <Text style={[styles.grayColor]}>清空搜索历史</Text>
            </View>
        );
    }
    _renderHeader() {
        return (
            <View style={[styles.row, styles.title]}>
                <Image style={styles.history} source={require("../images/history.png")} />
                <Text style={styles.grayColor}>搜索历史</Text>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row'
    },
    center: {
        alignItems: 'center',
    },
    justifyContent: {
        justifyContent: 'center'
    },
    justifyBetween: {
        justifyContent: 'space-between'
    },
    baseColor: {
        color: "#3e3e3e"
    },
    grayColor: {
        color: '#8D8C92'
    },
    history: {
        width: 17,
        height: 15,
        marginRight: 10
    },
    item: {
        height: 44,
        padding: 15,
        borderStyle: 'solid',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9'
    },
    smallFont: {
        fontSize: 12
    },
    bottomTop: {
        marginTop: 14
    },
    title: {
        padding: 15,
        paddingBottom: 0
    }
});