'use strict';

import {React, Component, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableHighlight, PixelRatio, Linking, Alert} from 'nuke';
import {formatDate} from '../utils/CommonUtils';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class ContactItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item} = this.props;
        let date = formatDate(item.get('reply_at'));
        let statusStr = ['未反馈', '确认在卖', '反馈虚假', '联系不上'];
        return (
            <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, item)} key={item.get('property_id')}>
                <View style={styles.item}>
                    <View style={[styles.row, styles.center]}>
                        <Text numberOfLines={1} style={[styles.flex, styles.headerMsg, styles.headerPadding]}>{item.get('community_name')}  {item.get('building_num') + item.get('building_unit') + item.get('door_num')}</Text>
                        <Text style={styles.updatedAt}>{date.month + '月' + date.day + '日' + statusStr[item.get('reply_status')]}</Text>
                    </View>
                    <View style={[styles.row, styles.top]}>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('bedrooms') + '室' + item.get('living_rooms') + '厅' + item.get('bathrooms') + '卫'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('area') + '平'}</Text>
                        <Text style={[styles.bedrooms, styles.bedroomsPadding]}>{item.get('price') + '万'}</Text>
                    </View>
                    {
                        item.get('reply_status') == 1
                            ? <View style={[styles.row, styles.top]}>
                                  <Text numberOfLines={1} style={styles.bottomMsg}>电话:</Text>
                                  <TouchableHighlight underlayColor="#fff" onPress={this._callSeller.bind(null, item.get('seller_phone'))}>
                                      <View><Text style={[styles.bottomMsg, styles.green]}>{item.get('seller_phone')}</Text></View>
                                  </TouchableHighlight>
                                  <Text style={styles.bottomMsg}>{'(' + item.get('seller_name') + ')'}</Text>
                              </View>
                            : null
                    }
                </View>
            </TouchableWithoutFeedback>
        );
    }
    _callSeller = (phone) => {
        ActionUtil.setAction(actionType.BA_MINE_CONTACT_CONTACTLANDLORD);
        let url = "tel:" + phone;

        Linking.canOpenURL(url).then(supported => {
            if (!supported) {
                Alert.alert('温馨提示', '您的设备不支持打电话功能', [{text: '确定'}]);
            } else {
                return Linking.openURL(url);
            }
        }).catch(err => console.error('An error occurred', err));
    };

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
    top: {
        marginTop: 5
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
        fontFamily: 'Helvetica Neue'
    },
    center: {
        alignItems: 'center',
    },
    green: {
        color: "#04C1AE",
        fontSize: 16,
        marginRight: 10
    }
});