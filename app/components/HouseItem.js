'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, TouchableWithoutFeedback, PixelRatio, Platform} from 'nuke';
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
                    <View style={[styles.row, styles.center]}>
                        <View style={[styles.row, styles.flex, styles.center]}>

                            <Text style={[styles.headerMsg, styles.headerPadding, styles.flex]} numberOfLines={1}>{item.get('community_name')}  {item.get('building_num') + item.get('building_unit') + item.get('door_num')}</Text>

                            {
                                item.get('is_new') ? <Text style={[styles.tagNew]}>新上</Text> : null
                            }
                            {
                                item.get('is_verify') ? <Text style={[styles.tagNew, styles.tagAuth]}>已认证</Text> : null
                            }
                        </View>
                        <Text style={styles.updatedAt}>{date.month + '月' + date.day + '日更新'}</Text>
                    </View>
                    <View style={[styles.row, styles.bedroomsWrap]}>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('bedrooms') + '室' + item.get('living_rooms') + '厅' + item.get('bathrooms') + '卫'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('area') + '平'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('price') + '万'}</Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text numberOfLines={1} style={styles.bottomMsg}>{item.get('district_name') + '-' + item.get('block_name') + ' ' + item.get('community_address')}</Text>
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
    headerMsg: {
        color: '#3e3e3e',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'Heiti SC'
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
        width: 30,
        textAlign: 'center',
        textAlignVertical: 'top'
    },
    tagAuth: {
        backgroundColor: '#45c7c9',
        width: 44
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
        flex: 1,
        fontSize: 12,
        color: '#9f9ea3',
        fontFamily: 'Helvetica Neue'
    },
    center: {
        alignItems: 'center',
    }
});