'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke'
import Autocomplete from '../components/Autocomplete'
import AutocompleteItem from '../components/AutocompleteItem'
import * as common from '../constants/Common'
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
//设置我的关注中的小区搜索
export default class CommunitySearch extends Component {
    constructor(props) {
        super(props);

        this.pageId = actionType.BA_SEND_SEARCH;
        ActionUtil.setActionWithExtend(actionType.BA_SEND_SEARCH_ONVIEW, {"bp": this.props.route.bp});
        this.renderRow = this.renderRow.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.cancelSearch = this.cancelSearch.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    render() {
        return (
            <Autocomplete
                placeholder="搜索小区..."
                keyword={this.props.keyword}
                results = {this.props.results}
                renderRow={this.renderRow}
                onChangeText={this.onChangeText}
                onCancelSearch={this.cancelSearch}
            />
        );
    }

    componentWillUnmount() {
        this.props.actions.settingSearchCleared();
    }

    renderRow(item, index) {
        return <AutocompleteItem key={index} item={item} onPress={this.onPress} />;
    }

    onChangeText(value) {
        let {actions} = this.props;
        actions.fetchCommunityList({keyword: value});
        actions.settingSearchKeywordChanged(value);
    }

    onPress(community) {
        ActionUtil.setActionWithExtend(actionType.BA_SETFOCUS_SEARCH, {"keyword": this.props.keyword, "comm_id": community.get("id"), "comm_name": community.get("name")});
        let {actions, actionsOne, navigator, attentionList} = this.props;
        let communitySelect = attentionList.get('community_select');

        let repeatCommunity = communitySelect.filter((v) => {
            return v.get('id') == community.get('id');
        });
        if (common.SETTING_COMMUNITY_COUNT_MAX == communitySelect.size) {
            Alert.alert(null, '最多能设置' + common.SETTING_COMMUNITY_COUNT_MAX + '个关注的小区', [{text: '确定'}]);
        } else if (repeatCommunity.size == 0) {
            navigator.jumpBack();
            actionsOne.attentionListOneCommunityAdded(community)
        } else {
            Alert.alert('提示', community.get('name') + '已经关注', [{text: '确定'}])
        }
    }

    cancelSearch() {
        ActionUtil.setAction(actionType.BA_SEND_SEARCH_CANCEL);
        this.props.navigator.jumpBack();
    }
}