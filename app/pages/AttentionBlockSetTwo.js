'use strict';

import {React, Component, Text, View, ScrollView, Image, StyleSheet, InteractionManager, Platform, PixelRatio, TouchableHighlight, Alert} from 'nuke';
import Item from '../components/Item';
import Tab from '../components/Tab';
import {saveAttentionBlockSetService} from '../service/blockService';
import Immutable from 'immutable';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class AttentionBlockSetTwo extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_SETFOCUS_AREA;
        ActionUtil.setActionWithExtend(actionType.BA_SETFOCUS_AREA_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {attentionBlockSet} = this.props;

        let districtBlockList = attentionBlockSet.get('district_block_list');
        let districtBlockSelect = attentionBlockSet.get('district_block_select');
        return (
            <View style={styles.flex}>
                {
                    districtBlockList.toJS().length > 0 ?
                    <Tab dataArr={districtBlockList}
                         selectedArr={districtBlockSelect} 
                         maxSelected={5}
                         onHandleBlockSelected={this._onHandleBlockSelected}/>
                    : <View style={styles.flex}></View>
                }
                <View style={styles.conformWrap}>
                    <TouchableHighlight
                        style={styles.conformButton}
                        underlayColor="#04c1ae"
                        onPress={this._conformBlockSet}
                    >
                        <Text style={styles.conformText}>
                            确定
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }

    componentDidMount() {
        let {actions, actionsOne} = this.props;

        InteractionManager.runAfterInteractions(() => {
            actions.fetchAttentionBlockSet();
            // actionsOne.attentionListOneBlockChanged([{name: 'xxxx', id: 123}]);
        });
    }

    _onHandleBlockSelected = (block, insert:boolen) => {
        let {actions} = this.props;

        if (insert) {
            ActionUtil.setActionWithExtend(actionType.BA_SETFOCUS_AREA_CHOOSE, {"block_id": block.get("id"), "block_name": block.get("name")});
            actions.attentionBlockSetAdded(block);
        } else {
            ActionUtil.setActionWithExtend(actionType.BA_SETFOCUS_AREA_DELETE, {"block_id": block.get("id"), "block_name": block.get("name")});
            actions.attentionBlockSetDeleted(block);
        }
    };

    _conformBlockSet = () => {
        let {attentionBlockSet, actionsOne, actionsHome, navigator} = this.props;
        let districtBlockSelect = attentionBlockSet.get('district_block_select');

        let params = districtBlockSelect.map((v) => {
            return v.get('id')
        });
        ActionUtil.setActionWithExtend(actionType.BA_SETFOCUS_AREA_ENSURE, {"block_arr": params.toJS() || []});

        InteractionManager.runAfterInteractions(() => {
            saveAttentionBlockSetService(params.toJS() || [])
            .then((oData) => {
                actionsOne.attentionListOneBlockChanged(districtBlockSelect.toJS());
                actionsHome.fetchAttentionHouseList();
                navigator.pop();
            })
            .catch((oData) => {
                Alert.alert('提示', oData.msg, [{text: '确定'}]);
            });
        });
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    conformWrap: {
        height: 60,
        backgroundColor: '#eee',
        borderTopWidth: 1/PixelRatio.get(),
        borderStyle: 'solid',
        borderTopColor: '#d9d9d9',
    },
    conformButton: {
        justifyContent: 'center',
        backgroundColor: '#04c1ae',
        borderRadius: 5,
        flex: 1,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15
    },
    conformText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    },
});