'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, TouchableWithoutFeedback, PixelRatio} from 'nuke';
import HouseItem from './HouseItem';
import {formatDate} from '../utils/CommonUtils';

export default class InputItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item} = this.props;
        let date = formatDate(item.get('created_at'));
        let statusStr = ['待审核', '已通过', '未通过'],
            statusInfoStr = ['客服将在24小时内审核房源', '获得' + Number(item.get('money')) + '积分', item.get('reason')];
        return (
            <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, item)} key={item.get('property_id')}>
                <View>
                    <HouseItem
                        item={item}
                        dateKey="created_at"
                        operator={'发布'}
                        onItemPress={this._onHandlePress}
                    />

                    <View style={[styles.item, styles.row, styles.alignCenter]}>
                        <View style={[styles.tagWrap, (item.get('check_status') == 1 ? styles.borderGreen : styles.borderOrange)]}>
                            <Text style={[styles.tag, (item.get('check_status') == 1 ? styles.tagGreen : styles.tagOrange)]}>{statusStr[item.get('check_status')]}</Text>
                        </View>
                        <Text style={styles.bottomMsg}>{statusInfoStr[item.get('check_status')]}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _onHandlePress = (item) => {
        this.props.onItemPress && this.props.onItemPress(item);
    };
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    },
    alignCenter: {
        alignItems: "center"
    },
    item: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 5
    },
    bottomMsg: {
        fontSize: 15
    },
    center: {
        alignItems: 'center',
    },
    tag: {
        fontSize: 12,
        textAlign: "center"
    },
    tagWrap: {
        borderWidth: 1,
        marginRight: 8,
        paddingLeft: 2,
        paddingRight: 2
    },
    tagOrange: {
        color: "#FF6D4B"
    },
    tagGreen: {
        color: "#04C1AE"
    },
    borderOrange: {
        borderColor: "#FF6D4B"
    },
    borderGreen: {
        borderColor: "#04C1AE"
    },
    bottom: {
        marginBottom: 8
    }
});