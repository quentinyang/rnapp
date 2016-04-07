'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke'
import Autocomplete from '../components/autocomplete'
import AutocompleteItem from '../components/AutocompleteItem'

export default class CommunitySearch extends Component {
    constructor(props) {
        super(props);

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
        let {actions, actionsOne, navigator, attentionList} = this.props;
        let communitySelect = attentionList.get('community_select');

        let repeatCommunity = communitySelect.filter((v) => {
            return v.get('id') == community.get('id');
        });
        if (repeatCommunity.size == 0) {
            navigator.jumpBack();
            actionsOne.attentionListOneCommunityAdded(community)
        } else {
            Alert.alert('提示', community.get('name') + '已经关注', [{text: '确定'}])
        }
    }

    cancelSearch() {
        this.props.navigator.jumpBack();
    }
}