'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, TouchableWithoutFeedback} from 'nuke';

export default class HouseItem extends Component {
    constructor(props) {
        super(props);

        this._onHandlePress = this._onHandlePress.bind(this);
    }

    render() {
        let {item} = this.props;

        return (
            <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, item.get('property_id'))} key={item.get('property_id')}>
                <View style={styles.item}>
                    <View style={[styles.row]}>
                        <View style={[styles.row, styles.flex]}>
                            <Text>{item.get('community_name')}</Text>
                            <Text>{item.get('building_num')}</Text>
                            <Text>{item.get('building_unit')}</Text>
                            <Text>{item.get('door_num')}</Text>
                        </View>
                        <Text>{item.get('updated_at')}</Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text>{item.get('bedrooms') + '室'}</Text>
                        <Text>{item.get('living_rooms') + '厅'}</Text>
                        <Text>{item.get('bathrooms') + '卫'}</Text>
                        <Text>{item.get('area') + '平'}</Text>
                        <Text>{item.get('price') + '万'}</Text>
                    </View>
                    <View style={[styles.row]}>
                        <Text>{item.get('district_name') + '-' + item.get('block_name')}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    _onHandlePress(propertyId) {
        this.props.onItemPress(propertyId);
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    },
    item: {
        height: 80,
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: '#D9D9D9',
        borderBottomWidth: 1
    }
});