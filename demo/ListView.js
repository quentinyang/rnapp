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
    AlertIOS,
    RefreshControl
} from 'react-native';

export default class ListViewDemo extends Component {
    constructor(props) {
        super(props);

        let ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => {
                return r1 != r2;
            }
        });

        this.state = {
            dataSource: ds.cloneWithRows([
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13',
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13',
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13',
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13',
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13',
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13',
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13',
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13',
                'Row 1', 'Row 2','Row 3','Row 4','Row 5','Row 6','Row 7','Row 8','Row 9','Row 10','Row 11','Row 12','Row 13'
            ]),
            rowData: Array.from(new Array(20)).map(
                        (val, i) => ({text: '初始行 ' + i}))
        };
    }

    render() {
        return (
            <ListView
                style={styles.container}
                dataSource={this.state.dataSource}
                initialListSize={1}
                onChangeVisibleRows={this._onChangeVisibleRows}
                onEndReached={this._onEndReached}
                onEndReachedThreshold={100}
                renderRow={this._renderRow}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._onRefresh}
                        colors={['#ff0000', '#00ff00', '#0000ff','#3ad564']}
                        progressBackgroundColor="#ffffff"
                    />
                }
            />
        );
    }

    _renderRow(rowData: any, sectionID: number, rowID: number) {
        let imgSource = rowID > 15 ? 'http://b.hiphotos.baidu.com/album/pic/item/caef76094b36acafe72d0e667cd98d1000e99c5f.jpg?psign=e72d0e667cd98d1001e93901213fb80e7aec54e737d1b867': 
                                     'http://cdn.duitang.com/uploads/item/201505/29/20150529200613_T2cKW.jpeg';

        return (
            <TouchableOpacity>
                <View>
                    <View style={styles.row}>
                        <Image style={styles.thumb} source={{uri: imgSource}}/>
                        <Text style={{flex: 1, fontSize: 16, color: 'blue', alignSelf: 'center'}}>
                            {rowData + '我正在测试呢～～～'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    _onChangeVisibleRows() {

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

    _onEndReached(a, b) {
        AlertIOS.alert(
            'Foo Title',
            'My Alert Msg',
            [
                {text: 'Foo', onPress: () => {

                }},
                {text: 'Bar', onPress: () => {

                }},
            ]
        )
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#F6F6F6'
    },
    thumb: {
        width: 50,
        height: 50
    },
    container: {
        backgroundColor: 'orange',
        marginTop: 15
    },
});