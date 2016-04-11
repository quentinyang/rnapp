'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, TouchableWithoutFeedback, PixelRatio} from 'nuke';
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
                <View style={styles.item}>
                    <View style={[styles.row, styles.center]}>
                        <Text numberOfLines={1} style={[styles.flex, styles.headerMsg, styles.headerPadding]}>{item.get('community_name')}{item.get('building_num') + item.get('building_unit') + item.get('door_num')}</Text>
                        <Text style={styles.updatedAt}>{date.month + '月' + date.day + '日发布'}</Text>
                    </View>
                    <View style={[styles.row, styles.bedroomsWrap]}>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('bedrooms') + '室' + item.get('living_rooms') + '厅' + item.get('bathrooms') + '卫'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('area') + '平'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('price') + '万'}</Text>
                    </View>
                    <Text numberOfLines={1} style={[styles.bedrooms, styles.bottom]}>电话: {item.get('seller_phone')}</Text>
                    <View style={[styles.row, styles.alignCenter]}>
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
        this.props.onItemPress(item);
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
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#fff',
        marginBottom: 5
    },
    headerMsg: {
        color: '#3e3e3e',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Heiti SC'
    },
    headerPadding: {
        paddingRight: 12
    },
    updatedAt: {
        color: '#8d8c92',
        fontSize: 12
    },
    bedroomsWrap: {
        alignItems: 'center',
        height: 32
    },
    bedrooms: {
        fontSize: 15,
        color: '#3e3e3e',
        fontFamily: 'Helvetica Neue'
    },
    bedroomsPadding: {
        paddingRight: 10
    },
    bottomMsg: {
        fontSize: 15,
        color: '#9f9ea3'
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