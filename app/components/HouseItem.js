'use strict';

import {React, Component, Text, View, Image, ScrollView, StyleSheet, TouchableWithoutFeedback, PixelRatio, Platform} from 'nuke';
import {formatDate} from '../utils/CommonUtils';

export default class HouseItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item} = this.props;
        let date = formatDate(item.get('updated_at'));

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

                    <View style={[styles.row, styles.center]}>
                        <View style={[styles.row, styles.flex, styles.center]}>

                            <Text style={[styles.headerMsg, styles.headerPadding, styles.flex, item.get('is_click') ? styles.gray : {}]} numberOfLines={1}>{item.get('community_name')}  {item.get('building_num') + item.get('building_unit') + item.get('door_num')}</Text>

                            {
                                item.get('is_new') ? <Text style={[styles.tagNew]}>新</Text> : null
                            }
                            {
                                item.get('is_verify') ? <Text style={[styles.tagNew, styles.tagAuth]}>认</Text> : null
                            }
                        </View>
                    </View>
                    <View style={[styles.row, styles.bedroomsWrap]}>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding, item.get('is_click') ? styles.gray : {}]}>{item.get('bedrooms') + '室' + item.get('living_rooms') + '厅' + item.get('bathrooms') + '卫'}</Text>
                        <Text style={[styles.bedrooms, item.get('is_click') ? styles.gray : {}]}>{item.get('area') + '平'}</Text>
                        <Text style={[styles.flex, styles.price]}><Text style={styles.fontMedium}>{item.get('price')}</Text>万</Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text numberOfLines={1} style={[styles.flex, styles.bottomMsg]}>{item.get('district_name') + '-' + item.get('block_name') + ' ' + item.get('community_address')}</Text>
                        <Text style={[styles.bottomMsg, styles.updatedAt]}>{date.month + '月' + date.day + '日'}</Text>
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
        color: '#3e3e3e',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Heiti SC',
        backgroundColor: 'transparent'
    },
    headerPadding: {
        paddingRight: 12
    },
    tagNew: {
        backgroundColor: '#ffa251',
        color: '#fff',
        fontSize: 12,
        padding: (Platform.OS === 'ios') ? 2 : 0,
        fontWeight: '500',
        marginRight: 10,
        width: 16,
        textAlign: 'center',
        textAlignVertical: 'top'
    },
    tagAuth: {
        backgroundColor: '#45c7c9'
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
        color: '#3e3e3e',
        fontFamily: 'Helvetica Neue'
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
        fontWeight: "500"
    },
    bottomMsg: {
        fontSize: 12,
        color: '#9f9ea3',
        fontFamily: 'Helvetica Neue'
    },
    center: {
        alignItems: 'center',
    },
    gray: {
        color: '#8d8c92'
    }
});