'use strict';
/*
    initialListSize: 性能
    removeClippedSubviews: 给每一行(row)的布局添加over:'hidden'样式
 */
import React, {
    Component,
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl
} from 'react-native';

export default class RefreshControlDemo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isRefreshing: false,
            loaded: 0,
            rowData: Array.from(new Array(20)).map(
            (val, i) => ({text: '初始行 ' + i}))
        }

        this._onRefresh = this._onRefresh.bind(this)
    }

    render() {
        let rows = this.state.rowData.map((row, ii) => {
            return <Row key={ii} data={row}/>;
        });

        return (
            <ScrollView
                style={styles.scrollview}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh}
                        colors={['#ff0000', '#00ff00', '#0000ff','#3ad564']}
                        progressBackgroundColor="#ffffff"
                    />
                }
            >
                {rows}
            </ScrollView>
        )
    }

    _onRefresh() {
        this.setState({isRefreshing: true});

        setTimeout(() => {
            // 准备下拉刷新的5条数据
            const rowData = Array.from(new Array(5)).map((val, i) => ({
                text: '刷新行 ' + (+this.state.loaded + i)
            })).concat(this.state.rowData);

            this.setState({
                loaded: this.state.loaded + 5,
                isRefreshing: false,
                rowData: rowData,
            });
        }, 5000);
    }
}

class Row extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.row}>
                <Text style={styles.text}>
                    {this.props.data.text}
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    row: {
        borderColor: 'red',
        borderWidth: 5,
        padding: 20,
        backgroundColor: '#3a5795',
        margin: 5,
    },
    text: {
        alignSelf: 'center',
        color: '#fff',
    },
    scrollview: {
        flex: 1,
    },
});