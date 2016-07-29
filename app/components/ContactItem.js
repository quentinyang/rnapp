'use strict';

import {React, Component, Text, View, StyleSheet, TouchableWithoutFeedback, TouchableHighlight, PixelRatio, Linking, Alert} from 'nuke';
import HouseItem from './HouseItem';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class ContactItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item, current} = this.props;
        let statusStr = ['未反馈', '确认在卖', '反馈虚假', '联系不上', '反馈虚假', '确认不卖', '确认已卖', '按错了'];

        return (
            <TouchableWithoutFeedback onPress={this._onHandlePress.bind(null, item)} key={item.get('property_id')}>
                <View style={styles.item}>
                    <HouseItem
                        item={item}
                        dateKey="reply_at"
                        operator={item.get('check_status') == 2 ? '客服确认在卖' : statusStr[item.get('reply_status')]}
                        onItemPress={this._onHandlePress}
                    />


                    {current == 'tel' ?
                        <View style={[styles.status, styles.row, styles.center]}>
                            <Text style={styles.bottomMsg}>电话:</Text>

                            <TouchableHighlight
                                underlayColor="#fff"
                                onPress={this._callSeller.bind(null, item.get('seller_phone'))}
                            >
                                <View>
                                    <Text style={[styles.bottomMsg, styles.green]}>{item.get('seller_phone')}</Text>
                                </View>
                            </TouchableHighlight>

                            <Text style={styles.bottomMsg}>{'(' + item.get('seller_name') + ')'}</Text>
                        </View>
                            :
                        <View style={[styles.status, styles.row, styles.center]}>
                            <Text style={styles.bottomMsg}>{current == 'score' ? item.get('unlock_phone_cost') + '积分已返还' : '客服审核中'}</Text>
                        </View>
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
        marginBottom: 10
    },
    status: {
        padding: 15,
        backgroundColor: '#fff',
    },
    bottomMsg: {
        fontSize: 15
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