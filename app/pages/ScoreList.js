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
        let { scores } = this.props;
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={ds.cloneWithRows(scores.get('properties').toArray())}
                    initialListSize={10}
                    onChangeVisibleRows={(visibleRows, changedRows) => {}}
                    onEndReachedThreshold= {20}
                    pageSize={10}
                    renderHeader={() => this.renderHeader()}
                    renderRow={this.renderRow}
                    renderFooter={() => <Text style={styles.noMore}>没有更多了...</Text>}
                />
            </View>
        )
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.props.actions.fetchScoreList();
        });
    }

    renderHeader() {
        return (
            <View style={styles.totalBox}>
                <Text style={styles.totalTitle}>账户余额：</Text>
                <Text style={styles.totalPrice}>¥{this.props.scores.get('total')}</Text>
            </View>
        );
    }

    renderRow = (rowData: any, sectionID: number, rowID: number) => {
        return (
            <View style={styles.scoreListBox}>
                <View style={styles.scoreLeft}>
                    <Text style={styles.scoreDesc}>联系房东</Text>
                    <Text style={styles.scoreTime}>05-05 10:45</Text>
                </View>
                <View style={styles.scoreRight}>
                    <Text style={styles.scorePrice}>-¥2</Text>
                </View>
            </View>
        )
    };
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