'use strict';

import {
    React, Component,
    View, Text, Image, TextInput,
    StyleSheet, PixelRatio,
} from 'nuke';
import WithLabel from '../LabelTextInput';

export default class MoreInfoComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {houseForm, controller, communityData} = this.props;

        return (
            <View>
                <WithLabel
                    label='户型'
                    rightText='室'
                    inputStyle={styles.alignCenter}
                    underlineColorAndroid = 'transparent'
                    keyboardType='numeric'
                    maxLength={2}
                    value={houseForm.get('bedrooms')}
                    onFocus={() => this.inputFocused(actionType.BA_SEND_ADDHOUSETYPE, 'areaBox', 55)}
                    onBlur={() => this.inputBlur()}
                    onChangeText={(v) => {this.singleAction('bedroomsChanged', v)}}
                >
                    <TextInput
                        keyboardType='numeric'
                        style={[styles.inputBox, styles.alignCenter]}
                        maxLength={1}
                        underlineColorAndroid = 'transparent'
                        value={houseForm.get('living_rooms')}
                        onFocus={() => this.inputFocused(actionType.BA_SEND_ADDHOUSETYPE, 'areaBox', 55)}
                        onBlur={() => this.inputBlur()}
                        onChangeText={(v) => {this.singleAction('livingroomsChanged', v)}}
                    />
                    <Text>厅</Text>
                    <TextInput
                        keyboardType='numeric'
                        style={[styles.inputBox, styles.alignCenter]}
                        maxLength={1}
                        underlineColorAndroid = 'transparent'
                        value={houseForm.get('bathrooms')}
                        onFocus={() => this.inputFocused(actionType.BA_SEND_ADDHOUSETYPE, 'areaBox', 55)}
                        onBlur={() => this.inputBlur()}
                        onChangeText={(v) => {this.singleAction('bathroomsChanged', v)}}
                    />
                    <Text>卫</Text>
                </WithLabel>
                <WithLabel
                    label='面积'
                    ref='area'
                    rightText='平米'
                    maxLength={8}
                    keyboardType='numeric'
                    value={houseForm.get('area')}
                    placeholder='输入面积'
                    underlineColorAndroid = 'transparent'
                    onFocus={() => this.inputFocused(actionType.BA_SEND_ADDAREA,'areaBox', 55)}
                    onBlur={() => this.inputBlur()}
                    onChangeText={(v) => {this.singleAction('areaChanged', v)}}
                />
                <WithLabel
                    label='价格'
                    ref='price'
                    rightText='万'
                    maxLength={6}
                    underlineColorAndroid = 'transparent'
                    keyboardType='numeric'
                    value={houseForm.get('price')}
                    placeholder='输入价格'
                    onFocus={() => this.inputFocused(actionType.BA_SEND_ADDPRICE, 'priceBox',55)}
                    onBlur={() => this.inputBlur()}
                    onChangeText={(v) => {this.singleAction('priceChanged', v)}}
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