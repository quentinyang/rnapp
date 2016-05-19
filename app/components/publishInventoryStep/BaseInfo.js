'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke';
import WithLabel from '../LabelTextInput';
import Attached from '../Attached';

export default class BaseInfoComponent extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {houseForm, controller, communityData} = this.props;

        return (
            <View style={styles.flex}>
                <WithLabel
                    label='小区'
                    special={true}
                    specialText1={houseForm.get('community_name')}
                    specialText2={houseForm.get('address')}
                    arrow={true}
                    onClick={() => {ActionUtil.setAction(actionType.BA_SEND_ADDCOM); this.singleAction('searchChanged', true)}}
                />
                <WithLabel
                    label='楼栋'
                    rightText='号/座'
                    rightStyle={controller.get('single')? {color: '#fff'}: {}}
                    value={houseForm.get('building_num')}
                    placeholder={controller.get('single')?'':'输入楼/座号'}
                    editable={controller.get('single')? false: true}
                    underlineColorAndroid = 'transparent'
                    onFocus={() => ActionUtil.setAction(actionType.BA_SEND_ADDBUILDINGNUM)}
                    onChangeText={(v) => {this.singleAction('buildingChanged', v)}}
                >
                    <Attached
                        isSelected={controller.get('single')}
                        attachedText='独栋'
                        toggleAttach={() => this.toggleAttach(actionType.BA_SEND_SINGLEBUILDING, 'singleChanged', !controller.get('single'), 'buildingChanged', 'attachBuildingChanged')}
                    />
                </WithLabel>
                <WithLabel
                    label='房号'
                    rightText='室'
                    rightStyle={controller.get('villa')? {color: '#fff'}: {}}
                    value={houseForm.get('door_num')}
                    placeholder={controller.get('villa')?'':'输入房号'}
                    underlineColorAndroid = 'transparent'
                    editable={controller.get('villa')? false: true}
                    onFocus={() => this.inputFocused(actionType.BA_SEND_ADDROOMNUM, 'doorBox', 55)}
                    onBlur={() => this.inputBlur()}
                    onChangeText={(v) => {this.singleAction('doorChanged', v)}}
                >
                    <Attached
                        isSelected={controller.get('villa')}
                        attachedText='别墅'
                        toggleAttach={() => this.toggleAttach(actionType.BA_SEND_VILA, 'villaChanged', !controller.get('villa'), 'doorChanged', 'attachDoorChanged')}
                    />
                </WithLabel>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    }
});