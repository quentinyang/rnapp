'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke';
import WithLabel from '../LabelTextInput';

export default class LandlordInfoComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {houseForm, controller, communityData} = this.props;

        return (
            <View>
                <WithLabel
                    label='称呼'
                    ref='alias'
                    value={houseForm.get('seller_alias')}
                    placeholder='(选填)如张先生'
                    onFocus={() => this.inputFocused(actionType.BA_SEND_ADDNAME, 'aliasBox', 380)}
                    onBlur={() => this.inputBlur()}
                    underlineColorAndroid = 'transparent'
                    onChangeText={(v) => {this.singleAction('aliasChanged', v)}}
                />
                <WithLabel
                    label='电话'
                    ref='phone'
                    keyboardType='numeric'
                    value={houseForm.get('seller_phone')}
                    placeholder='输入联系电话'
                    underlineColorAndroid = 'transparent'
                    maxLength={11}
                    onFocus={() => this.inputFocused(actionType.BA_SEND_ADDHPHONE, 'phoneBox', 380)}
                    onBlur={() => this.inputBlur()}
                    onChangeText={(v) => {this.singleAction('phoneChanged', v)}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    }
});