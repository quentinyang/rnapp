'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, InteractionManager, Platform, PixelRatio, TouchableHighlight, TouchableWithoutFeedback, Alert} from 'nuke';
import Tab from '../components/Tab';
import TabViewContainer from '../containers/TabViewContainer';
import {saveAttentionBlockSetService} from '../service/blockService';
import * as common from '../constants/Common';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class AttentionBlockSet extends Component {
    constructor(props) {
        super(props);

        this.pageId = actionType.BA_LOGFOCUS_AREA;
        ActionUtil.setActionWithExtend(actionType.BA_LOGFOCUS_AREA_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {attentionBlockSet, oData, selectedArr} = this.props;

        let districtBlockList = attentionBlockSet.get('district_block_list');
        let districtBlockSelect = attentionBlockSet.get('district_block_select');

        return (
            <View style={[styles.flex, styles.pageMarginBottom]}>
                <View style={[styles.right, styles.marginTop]}>
                    <TouchableWithoutFeedback onPress={this._skip}>
                        <View><Text style={[styles.topSubHeader, styles.skip]}>跳过</Text></View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={styles.topMsg}>
                    <Text style={styles.topHeader}>设置关注的区域得<Text style={[styles.orange, styles.fontMedium]}>8</Text>积分</Text>
                    <Text style={styles.topSubHeader}>最多免费看<Text style={[styles.orange, styles.fontMedium]}>4</Text>套房源</Text>
                </View>
                {
                    districtBlockList && districtBlockList.toJS().length > 0 ?
                    <Tab dataArr={districtBlockList}
                         selectedArr={districtBlockSelect}
                         maxSelected={common.SETTING_BLOCK_COUNT_MAX}
                         onHandleBlockSelected={this._onHandleBlockSelected}/> : null
                }
                <View style={styles.conformWrap}>
                    <TouchableHighlight
                        style={styles.conformButton}
                        underlayColor="#04c1ae"
                        onPress={this._conformBlockSet}
                    >
                        <View><Text style={styles.conformText}>
                            确定
                        </Text></View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    componentDidMount() {
        let {actions} = this.props;

        InteractionManager.runAfterInteractions(() => {
            actions.fetchAttentionBlockSet();
            actions.enterAttentionBlockSet();
        });
    }

    _skip = () => {
        ActionUtil.setAction(actionType.BA_LOGFOCUS_AREA_SKIP);
        let {navigator, actions} = this.props;
        actions.attentionBlockSetCleared();
        navigator.resetTo({
            component: TabViewContainer,
            name: 'home',
            title: '我的主页',
            hideNavBar: true,
            bp: this.pageId
        });
    };

    _conformBlockSet = () => {
        let {attentionBlockSet, navigator} = this.props;
        let districtBlockSelect = attentionBlockSet.get('district_block_select');

        let params = districtBlockSelect.map((v) => {
            return v.get('id')
        });

        ActionUtil.setActionWithExtend(actionType.BA_LOGFOCUS_AREA_ENSURE, {"block_arr": params.toJS().join(",")});

        InteractionManager.runAfterInteractions(() => {
            saveAttentionBlockSetService(params.toJS() || [])
            .then((oData) => {
                navigator.resetTo({
                    component: TabViewContainer,
                    name: 'home',
                    title: '我的主页',
                    hideNavBar: true,
                    bp: this.pageId
                });
            })
            .catch((oData) => {
                Alert.alert('提示', oData.msg, [{text: '确定'}]);
            });
        });
    };

    _onHandleBlockSelected = (block, insert:boolen) => {
        let {actions} = this.props;

        if (insert) {
            ActionUtil.setActionWithExtend(actionType.BA_LOGFOCUS_AREA_CHOOSE, {"block_id": block.get("id"), "block_name": block.get("name")});
            actions.attentionBlockSetAdded(block);
        } else {
            ActionUtil.setActionWithExtend(actionType.BA_LOGFOCUS_AREA_DELETE, {"block_id": block.get("id"), "block_name": block.get("name")});
            actions.attentionBlockSetDeleted(block);
        }
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    topMsg: {
        height: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },
    topHeader: {
        fontSize: 23,
        color: '#3e3e3e'
    },
    topSubHeader: {
        fontSize: 15,
        color: '#8d8c92'
    },
    right: {
        alignSelf: 'flex-end'
    },
    marginTop: {
        marginTop: 30, // TODO
    },
    skip: {
        color: '#04c1ae',
        paddingRight: 15
    },
    conformWrap: {
        position: 'absolute',
        bottom: -60,
        left: 0,
        right: 0,
        height: 60,
        borderTopWidth: 1/PixelRatio.get(),
        borderStyle: 'solid',
        borderTopColor: '#d9d9d9',
    },
    conformButton: {
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#04c1ae',
        borderRadius: 5,
        position: 'absolute',
        bottom: 10,
        left: 15,
        right: 15,
    },
    conformText: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center'
    },
    pageMarginBottom: {
        marginBottom: 60
    },
    orange: {
        color: '#FF6D4B'
    },
    fontMedium: {
        fontWeight: '500'
    }
});