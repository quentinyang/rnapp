'use strict';

import {React, Component, Text, View, StyleSheet, TouchableWithoutFeedback, PixelRatio} from 'nuke';
import {formatDate} from '../utils/CommonUtils';

export default class InputItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item} = this.props;
        return (
            <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, item)} key={item.get('property_id')}>
                <View>
                    <HouseItem item={item} />

                    <View style={[styles.itemBottom, styles.row]}>
                        <Text style={styles.bottomMsg}>获得积分：<Text style={[styles.bottomMsg, styles.tagOrange, styles.fontBold]}>{Number(item.get('money'))}</Text></Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _onHandlePress = (item) => {
        this.props.onItemPress && this.props.onItemPress(item);
    };
}

class HouseItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item} = this.props;
        let date = formatDate(item.get('created_at'));
        let statusStr = ['待审核', '已通过', '未通过'];
        let reason = '';
        switch(Number(item.get('check_status'))) {
            case 0:
                reason = date.month + '月' + date.day + '日发布';
                break;
            case 1:
                reason = date.month + '月' + date.day + '日审核通过';
                break;
            case 2:
                reason = item.get('reason');
                break;
            default:
                reason =  '';
        }

        return (
            <View style={styles.itemTop}>
                <View style={[styles.row, styles.alignCenter]}>
                    <Text style={styles.flex} numberOfLines={1}>
                        {item.get('community_name') + "  "}
                        {item.get('building_num') + (item.get('building_num') && item.get('building_unit')) + item.get('door_num') + (item.get('door_num') && '室 ')}
                    </Text>
                    <View style={[styles.tagWrap, (item.get('check_status') == 1 ? styles.borderGreen : styles.borderOrange)]}>
                        <Text style={[styles.tag, (item.get('check_status') == 1 ? styles.tagGreen : styles.tagOrange)]}>{statusStr[item.get('check_status')]}</Text>
                    </View>
                </View>
                <View style={[styles.row, {marginVertical: 4}]}>
                    <Text style={styles.subInfo}>{item.get('bedrooms') + '室' + item.get('living_rooms') + '厅' + item.get('bathrooms') + '卫'}</Text>
                    <Text style={styles.subInfo}>{item.get('area') + '平'}</Text>
                    <Text style={styles.subInfo}>{item.get('price')}万</Text>
                </View>
                <View style={[styles.row]}>
                    <Text numberOfLines={1} style={[styles.flex, styles.smallFont]}>{item.get('district_name') + '-' + item.get('block_name') + ' ' + item.get('community_address')}</Text>
                    <Text style={styles.smallFont}>{reason}</Text>
                </View>
            </View>
        );
    }
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
    justifyContent: {
        justifyContent: 'center'
    },
    itemTop: {
        height: 90,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderColor: '#d9d9d9',
        backgroundColor: '#fff',
        borderBottomWidth: 1/PixelRatio.get()
    },
    itemBottom: {
        padding: 15,
        backgroundColor: '#fff',
        marginBottom: 10
    },
    bottomMsg: {
        fontSize: 15
    },
    tag: {
        fontSize: 12,
        textAlign: "center"
    },
    tagWrap: {
        borderWidth: 1/PixelRatio.get(),
        paddingHorizontal: 2,
        borderRadius: 1
    },
    tagOrange: {
        color: "#ff6d4b"
    },
    tagGreen: {
        color: "#04c1ae"
    },
    borderOrange: {
        borderColor: "#ff6d4b"
    },
    borderGreen: {
        borderColor: "#04c1ae"
    },
    subInfo: {
        paddingRight: 10,
        fontSize: 15
    },
    smallFont: {
        fontSize: 12,
        color: '#8d8c92'
    },
    fontBold: {
        fontWeight: '500'
    }
});