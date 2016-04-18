'use strict';

import {React, Component, Text, View, ScrollView, Image, StyleSheet, InteractionManager, Platform, PixelRatio, TouchableWithoutFeedback, TouchableHighlight, Alert} from 'nuke';
import Item from '../components/Item';
import AttentionBlockSetTwoContainer from '../containers/AttentionBlockSetTwoContainer';
import {saveAttentionCommunitySetService} from '../service/blockService';
import CommunitySearchContainer from '../containers/CommunitySearchContainer'
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class AttentionBlockSetOne extends Component {
    constructor(props) {
        super(props);
        this.pageId = actionType.BA_SETFOCUS;
        ActionUtil.setActionWithExtend(actionType.BA_SETFOCUS_ONVIEW, {"bp": this.props.route.bp});
    }

    render() {
        let {attentionList} = this.props;
        let districtBlockSelect = attentionList.get('district_block_select');
        let dbArr = districtBlockSelect.size > 0 && (districtBlockSelect.map((v) => {
            return v.get('name');
        })).toJS() || ['请选择板块'];

        return (
            <View style={styles.flex}>
                <ScrollView style={[styles.flex, styles.pageBgColor]}>
                    <TouchableWithoutFeedback
                        onPress={this._onPress}
                        >
                        <View style={[styles.blockWrap]}>
                            <Text style={[styles.header, styles.headerText]}>区域</Text>
                            <Text numberOfLines={1} style={[styles.flex, styles.contentText]}>{dbArr.join('、')}</Text>
                            <Image
                                source={require('../images/next.png')}
                                style={styles.nextImage}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <Item list={attentionList.get('community_select')} titleName={'小区'} onDelete={this._handleDelete} onAdd={this._handleAdd} />
                </ScrollView>
                <View style={styles.conformWrap}>
                    <TouchableHighlight
                        style={styles.conformButton}
                        underlayColor="#04c1ae"
                        onPress={this._conformCommunitySet}
                    >
                        <Text style={styles.conformText}>
                            确定
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }

    componentDidMount() {
        let {actions, route} = this.props;
        InteractionManager.runAfterInteractions(() => {
            actions.attentionListOneSetFetched(route.attentionList.toJS());
        });
    }

    _onPress = () => {
        ActionUtil.setAction(actionType.BA_SETFOCUS_SETAREA);
        let {navigator} = this.props;

        navigator.push({
            component: AttentionBlockSetTwoContainer,
            name: 'attentionTow',
            title: '设置我的关注',
            hideNavBar: false,
            backLog: actionType.BA_SETFOCUS_AREA_RETURN,
            bp: this.pageId
        });
    };

    _handleDelete = (communityId) => {
        ActionUtil.setAction(actionType.BA_SETFOCUS_DELCOM);
        let {actions} = this.props;
        actions.attentionListOneCommunityRomoved(communityId);
    };

    _handleAdd = () => {
        ActionUtil.setAction(actionType.BA_SETFOCUS_SETCOM);
        let {navigator} = this.props;

        navigator.push({
            component: CommunitySearchContainer,
            name: 'CommunitySearchContainer',
            title: '搜索小区',
            hideNavBar: true
        });
    };

    _conformCommunitySet = () => {
        ActionUtil.setAction(actionType.BA_SETFOCUS_SAVE);
        let {attentionList, actions, actionsHome, navigator} = this.props;
        let communitySelect = attentionList.get('community_select');
        let params = communitySelect.map((v) => {
            return v.get('id')
        });
        InteractionManager.runAfterInteractions(() => {
            saveAttentionCommunitySetService(params || [])
            .then((oData) => {
                actions.attentionListOneCommunityChanged(communitySelect.toJS());
                actionsHome.fetchAttentionHouseList();
                navigator.pop();
            })
            .catch((oData) => {
                Alert.alert('提示', oData.msg, [{text: '确定'}]);
            });
        })
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    pageBgColor: {
        backgroundColor: '#eee'
    },
    blockWrap: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        marginBottom: 15,
        marginTop: 15,
        borderWidth: 1/PixelRatio.get()
    },
    nextImage: {
        width: 9,
        height: 18
    },
    
    header: {
        width: 65
    },
    headerText: {
        fontSize: 16,
        color: '#3e3e3e',
        fontWeight: 'bold',
        fontFamily: 'Heiti SC'
    },
    contentText: {
        fontSize: 15,
        color: '#3e3e3e',
        fontFamily: 'Heiti SC'
    },
    conformWrap: {
        height: 60,
        backgroundColor: '#eee'
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