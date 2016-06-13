'use strict';
import {React, Component, ListView, View, Text, Image, TouchableWithoutFeedback, PixelRatio, StyleSheet} from 'nuke'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export class SearchHistory extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {history, renderRow} = this.props;

        return (
            <ListView
                dataSource={ds.cloneWithRows(history.toArray())}
                renderRow={renderRow}
                initialListSize={10}
                pageSize={10}
                keyboardShouldPersistTaps={true}
                renderFooter={this._renderFooter.bind(this)}
                renderHeader={this._renderHeader}
                enableEmptySections={true}
            />
        );
    }
    _renderFooter() {
        return (
            <TouchableWithoutFeedback
                onPress={this.props.clearHistory}
            >
                <View style={[styles.justifyContent, styles.center, styles.bottomTop]}>
                    <Text style={[styles.grayColor]}>清空搜索历史</Text>
                </View>
            </TouchableWithoutFeedback>
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

export class SearchHistoryItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item, index, onPress} = this.props;

        return (
            <TouchableWithoutFeedback
                key={index}
                onPress={onPress.bind(null, item)}
            >
                <View style={[styles.item, styles.row, styles.justifyBetween, styles.center]}>
                    <Text style={styles.baseColor}>{item.get('name')}</Text>
                    {/*<Text style={[styles.grayColor, styles.smallFont]}>约{item.get('count')}套在售</Text>*/}
                </View>
            </TouchableWithoutFeedback>
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
        paddingLeft: 15,
        paddingRight: 15,
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