'use strict';

import {React, Component, View, Text, Image, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke'
import Autocomplete from '../components/Autocomplete';
import AutocompleteItem from '../components/AutocompleteItem';
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'
//发房模块中的小区搜索
export default class CommunitySearch extends Component {
    constructor(props) {
        super(props);

        this.renderRow = this.renderRow.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.cancelSearch = this.cancelSearch.bind(this);
        this.onPress = this.onPress.bind(this);
    }

    render() {
        let {communityData} = this.props;
        return (
            <Autocomplete
                placeholder={'搜索小区...'}
                keyword={communityData.get('keyword')}
                results = {communityData.get('results')}
                renderRow={this.renderRow}
                onChangeText={this.onChangeText}
                onCancelSearch={this.cancelSearch}
                visibleLog={actionType.BA_LOOK_COM_SEARCH_ONVIEW}
                bp={actionType.BA_SETFOCUS}
            />
        );
    }

    componentWillUnmount() {
        //this.props.actionsInput.hiSearchCleared();
    }

    renderRow(item, index) {
        return <AutocompleteItem key={index} item={item} onPress={this.onPress} />;
    }

    onChangeText(value) {
        let {actionsInput} = this.props;
        actionsInput.fetchCommunityList({keyword: value});
        actionsInput.hiSearchKeywordChanged(value);
    }

    onPress(community) {
        debugger;
        let {actionsInput} = this.props;
        ActionUtil.setActionWithExtend(actionType.BA_LOOK_COM_SEARCH_ASSOCIATION, {"keyword": this.props.keyword, "comm_id": community.get("id"), "comm_name": community.get("name")});
        actionsInput.communityChanged(community.toJS());
        let res = [];
        res.push(community.toJS());
        actionsInput.hiSearchHouseFetched(res);
        actionsInput.hiSearchKeywordChanged(community.get("name"));
        this.goBack();
    }
    cancelSearch() {
        ActionUtil.setAction(actionType.BA_LOOK_COM_SEARCH_CANCEL);
        this.goBack();
    }
    goBack() {
        let {navigator} = this.props;
        navigator.pop();
    }
}
