'use strict';

import {React, Component, Text, View, Image, ScrollView, StyleSheet, TouchableWithoutFeedback, PixelRatio, Platform} from 'nuke';
import {formatDate} from '../utils/CommonUtils';

export default class HouseItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item, dateKey, operator} = this.props;
        let date = formatDate(dateKey ? item.get(dateKey) : item.get('updated_at'));
        return (
            <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, item)} key={item.get('property_id')}>
                <View style={styles.item}>
                    {
                        item.get('is_contact') ?
                        <Image
                            style={styles.contactIcon}
                            source={require('../images/contact.png')}
                        /> :
                        null
                    }

                    <View>
                        <Text style={[styles.flex, styles.row, styles.headerMsg, item.get('is_click') ? styles.gray : {}]} numberOfLines={1}>
                            {item.get('community_name') + "  "}
                            {item.get('building_num') + (item.get('building_num') && item.get('building_unit')) + item.get('door_num') + (item.get('door_num') && '室')}
                            {item.get('is_new') && ' '}
                            {item.get('is_new') ? <Image style={[styles.tagNew]} source={require("../images/new_tag.png")} />: null}
                            {item.get('is_verify') && item.get('is_verify') == "1" && ' '}
                            {item.get('is_verify') && item.get('is_verify') == "1" ? <Image style={[styles.tagVerify]} source={require("../images/verify_tag.png")} />: null}
                        </Text>

                    </View>
                    <View style={[styles.row, styles.bedroomsWrap]}>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding, item.get('is_click') ? styles.gray : {}]}>{item.get('bedrooms') + '室' + item.get('living_rooms') + '厅' + item.get('bathrooms') + '卫'}</Text>
                        <Text style={[styles.bedrooms, item.get('is_click') ? styles.gray : {}]}>{item.get('area') + '平'}</Text>
                        <Text style={[styles.flex, styles.price, styles.fontMedium]}>{item.get('price')}万</Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text numberOfLines={1} style={[styles.flex, styles.bottomMsg]}>{item.get('district_name') + '-' + item.get('block_name') + ' ' + item.get('community_address')}</Text>
                        <Text style={[styles.bottomMsg, styles.updatedAt]}>{date.month + '月' + date.day + '日'}{operator}</Text>
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
    item: {
        height: 90,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 15,
        borderColor: '#d9d9d9',
        backgroundColor: '#fff',
        borderBottomWidth: 1/PixelRatio.get()
    },
    contactIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 35,
        height: 35
    },
    headerMsg: {
        height: 20,
        lineHeight: 20,
        color: '#3e3e3e',
        fontSize: 16,
        fontWeight: '500',
        backgroundColor: 'transparent'
    },
    headerPadding: {
        paddingRight: 12
    },
    tagNew: {
        width: 15,
        height: 15
    },
    tagVerify: {
        width: 27,
        height: 15
    },
    updatedAt: {
        textAlign: 'right'
    },
    bedroomsWrap: {
        alignItems: 'center',
        height: 32
    },
    bedrooms: {
        fontSize: 15,
        color: '#3e3e3e'
    },
    bedroomsPadding: {
        paddingRight: 10
    },
    price: {
        textAlign: 'right',
        fontSize: 16,
        color: '#FF6D4B'
    },
    fontMedium: {
        fontWeight: "500",
        color: '#ff6d4b'
    },
    bottomMsg: {
        fontSize: 12,
        color: '#9f9ea3'
    },
    center: {
        alignItems: 'center',
    },
    justifyContent: {
        justifyContent: 'center'
    },
    gray: {
        color: '#8d8c92'
    }
});