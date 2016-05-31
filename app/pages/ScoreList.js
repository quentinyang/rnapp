'use strict';

import {
    React,
    Component,
    Text,
    View,
    ListView,
    TouchableHighlight,
    StyleSheet,
    Image,
    InteractionManager,
    PixelRatio
} from 'nuke';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
import Immutable, {List} from 'immutable';

let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !immutable.is(r1, r2)});
export default class ScoreList extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let { flows } = this.props;
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={ds.cloneWithRows(flows.toArray())}
                    initialListSize={10}
                    onEndReached={() => this.onEndReached()}
                    onEndReachedThreshold= {20}
                    pageSize={10}
                    renderHeader={() => this.renderHeader()}
                    renderRow={this.renderRow}
                    renderFooter={() => this.renderFooter()}
                />
            </View>
        )
    }

    componentDidMount() {
        let {pager, actions} = this.props;
        InteractionManager.runAfterInteractions(() => {
            actions.fetchScoreList({
                page: Number(pager.get('current_page')) + 1
            });
        });
    }

    componentWillUnmount() {
        let {actions} = this.props;
        actions.scoreCleared();
    }

    onEndReached() {
        let {actions, pager} = this.props;

        if (Number(pager.get('current_page')) != Number(pager.get('last_page'))) {
            InteractionManager.runAfterInteractions(() => {
                actions.fetchScoreList({
                    page: Number(pager.get('current_page')) + 1
                });
            });
        }
    };


    renderHeader() {
        return (
            <View style={styles.totalBox}>
                <Text style={styles.totalTitle}>账户余额：</Text>
                <Text style={styles.totalPrice}>¥{this.props.money}</Text>
            </View>
        );
    }

    renderRow = (rowData: any, sectionID: number, rowID: number) => {
        return (
            <ScoreItem item={rowData} />
        );
    };

    renderFooter() {
        let {pager} = this.props;
        return (
            <Text style={styles.noMore}>
                {Number(pager.get('current_page')) != Number(pager.get('last_page'))?
                    '加载中...':
                    '没有更多了...'
                }
            </Text>
        );
    }
}

class ScoreItem extends Component {
    render() {
        let {item} = this.props;
        return (
            <View style={styles.scoreListBox}>
                <View style={styles.scoreLeft}>
                    <Text style={styles.scoreDesc}>{item.get('method')}</Text>
                    <Text style={styles.scoreTime}>{item.get('time')}</Text>
                </View>
                <View style={styles.scoreRight}>
                    <Text style={styles.scorePrice}>{item.get('money_change')}{item.get('money')}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },
    totalBox: {
        flexDirection: 'column',
        marginBottom: 10,
        padding: 15,
        backgroundColor: '#fff'
    },
    totalTitle: {
        fontSize: 15,
        color: '#8d8c92'
    },
    totalPrice: {
        marginTop: 10,
        fontSize: 30,
        color: '#04c1ae'
    },
    scoreListBox: {
        paddingVertical: 15,
        paddingLeft: 15,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderBottomWidth: 1/PixelRatio.get(),
        borderColor: '#d9d9d9'
    },
    scoreLeft: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        flex: 1
    },
    scoreRight: {
        justifyContent: 'flex-end'
    },
    scoreDesc: {
        marginBottom: 5,
        fontSize: 16,
        color: '#3e3e3e'
    },
    scoreTime: {
        fontSize: 12,
        color: '#8d8c92'
    },
    scorePrice: {
        fontSize: 19,
        fontWeight: '600',
        color: '#3e3e3e'
    },
    noMore: {
        padding: 10,
        fontSize: 12,
        color: '#8d8c92',
        textAlign: 'center'
    }
});