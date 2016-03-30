'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, TouchableWithoutFeedback, PixelRatio} from 'nuke';

export default class HouseItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item} = this.props;

        return (
            <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, item.get('property_id'), item.get('community_id'), item.get('community_name'))} key={item.get('property_id')}>
                <View style={styles.item}>
                    <View style={[styles.row]}>
                        <View style={[styles.row, styles.flex]}>
                            <Text style={[styles.headerMsg, styles.headerPadding]}>{item.get('community_name')}</Text>
                            <Text style={[styles.headerMsg, styles.headerPadding]}>{item.get('building_num') + item.get('building_unit') + item.get('door_num')}</Text>
                            <Text style={styles.tagNew}>新上</Text>
                            <Text style={[styles.tagNew, styles.tagAuth]}>已认证</Text>
                        </View>
                        <Text style={styles.updatedAt}>{item.get('updated_at')}</Text>
                    </View>
                    <View style={[styles.row, styles.bedroomsWrap]}>
                        <Text style={styles.bedrooms}>{item.get('bedrooms') + '室'}</Text>
                        <Text style={styles.bedrooms}>{item.get('living_rooms') + '厅'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('bathrooms') + '卫'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('area') + '平'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('price') + '万'}</Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text style={styles.bottomMsg}>{item.get('district_name') + '-' + item.get('block_name')}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _onHandlePress = (propertyId, communityId, communityName) => {
        this.props.onItemPress(propertyId, communityId, communityName);
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
        paddingTop: 15,
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
        padding: 2,
        fontWeight: '500',
        marginRight: 10
    },
    tagAuth: {
        backgroundColor: '#45c7c9'
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
        paddingRight: 14
    },
    bottomMsg: {
        fontSize: 12,
        color: '#9f9ea3',
        fontFamily: 'Helvetica Neue'
    }
});