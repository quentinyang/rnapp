'use strict';

import {React, Component, View, Text, Image, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke'
import Autocomplete from '../components/Autocomplete';
import AutocompleteItem from '../components/AutocompleteItem';
import {SearchHistory, SearchHistoryItem} from '../components/SearchHistory'
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

        this.state = {
            isShowSearchHistory: this.props.communityData.get('keyword') ? false : true
        };
    }

    render() {
        let {communityData, inputSearchHistory} = this.props;

        return (
            <View>
                <Autocomplete
                    placeholder={'搜索小区...'}
                    keyword={communityData.get('keyword')}
                    results = {communityData.get('results')}
                    renderRow={this.renderRow}
                    onChangeText={this.onChangeText}
                    onCancelSearch={this.cancelSearch}
                    isFocus={false}
                    visibleLog={actionType.BA_LOOK_COM_SEARCH_ONVIEW}
                    bp={actionType.BA_SETFOCUS}
                />

                {this.state.isShowSearchHistory && inputSearchHistory.size ?
                    <SearchHistory
                        history={inputSearchHistory}
                        renderRow={this._renderSearchHistoryRow.bind(this)}
                        clearHistory={this._clearSearchHistory.bind(this)}
                    />
                    : null
                }
            </View>
        );
    }

    _renderSearchHistoryRow = (item, index) => {
        return <SearchHistoryItem index={index} item={item} onPress={this._searchHistoryRowPress.bind(this)} />
    };

    _searchHistoryRowPress = (community) => {
        let {actionsInput} = this.props;
        ActionUtil.setAction(actionType.BA_LOOK_COM_SEARCH_CLICKHISTORY);
        actionsInput.communityChanged(community.toJS());
        actionsInput.hiSearchCleared();
        actionsInput.buildingChanged('');
        actionsInput.doorChanged('');
        actionsInput.singleChanged('');
        actionsInput.landlordCleared();
        actionsInput.moreCleared();
        this.goBack();
    };
    _clearSearchHistory = () => {
        let {actionsApp} = this.props;
        ActionUtil.setAction(actionType.BA_LOOK_COM_SEARCH_EMPTYHISTORY);
        this.setState({
            isShowSearchHistory: false
        });
        actionsApp.clearInputSearchHistory();
    };

    renderRow(item, index) {
        return <AutocompleteItem index={index} item={item} onPress={this.onPress} />;
    }

    onChangeText(value) {
        let {actionsInput} = this.props;
        actionsInput.fetchCommunityList({keyword: value});
        actionsInput.hiSearchKeywordChanged(value);
        actionsInput.buildingChanged('');
        actionsInput.doorChanged('');
        actionsInput.singleChanged('');
        actionsInput.landlordCleared();
        actionsInput.moreCleared();
        if(!value && !this.state.isShowSearchHistory) {
            this.setState({
                isShowSearchHistory: true
            });
        } else if(this.state.isShowSearchHistory) {
            this.setState({
                isShowSearchHistory: false
            });
        }
    }

    onPress(community) {
        let {communityData, actionsInput, actionsApp} = this.props;
        ActionUtil.setActionWithExtend(actionType.BA_LOOK_COM_SEARCH_ASSOCIATION, {"keyword": communityData.get('keyword'), "comm_id": community.get("id"), "comm_name": community.get("name")});

        actionsInput.communityChanged(community.toJS());
        let res = [];
        res.push(community.toJS());
        actionsInput.hiSearchHouseFetched(res);
        actionsInput.hiSearchKeywordChanged(community.get("name"));
        actionsApp.addInputSearchHistory({
            "id": community.get('id').toString(),
            "name": community.get('name'),
            "count": community.get('selling_house_count'),
            "address": community.get('address')
        });
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
