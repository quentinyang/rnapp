'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke'
import Autocomplete from './Autocomplete'
let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

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
                placeholder={this.props.placeholder || '搜索小区...'}
                keyword={this.props.keyword}
                results = {this.props.results}
                renderRow={this.renderRow}
                onChangeText={this.onChangeText}
                onCancelSearch={this.cancelSearch}
                visibleLog={actionType.BA_LOOK_COM_SEARCH_ONVIEW}
                bp={actionType.BA_SETFOCUS}
            />
        );
    }

    componentWillUnmount() {
        this.props.actions.hiSearchCleared();
    }

    renderRow(item, index) {
        return <Item key={index} item={item} onPress={this.onPress} />;
    }

    onChangeText(value) {
        let {actions} = this.props;
        actions.fetchCommunityList({keyword: value});
        actions.hiSearchKeywordChanged(value);
    }

    onPress(community) {
        ActionUtil.setAction(actionType.BA_LOOK_COM_SEARCH_ASSOCIATION);
        this.props.onPress('communityChanged', community.toJS());
        this.clearSearch();
    }
    cancelSearch() {
        ActionUtil.setAction(actionType.BA_LOOK_COM_SEARCH_CANCEL);
        this.clearSearch();
    }
    clearSearch() {
        this.props.onPress('searchChanged', false);
        this.props.actions.hiSearchCleared();
    }
}

class Item extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item} = this.props;

        return (
            <TouchableHighlight
                key={this.props.key}
                underlayColor="#fff"
                onPress={this.props.onPress.bind(null, item)}
            >
                <View style={[styles.flex, styles.row, styles.alignItems, styles.item]}>
                    <View style={[styles.flex, styles.justifyContent]}>
                        <Text style={styles.text}>{item.get('name')}</Text>
                        <Text style={[styles.text_1, styles.fontColor]}>{item.get('address')}</Text>
                    </View>
                    <Text style={[styles.text, styles.text_1]}>{'约' + item.get('selling_house_count') + '套在售'}</Text>
                </View>
            </TouchableHighlight>
        );
    }
}
const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    row: {
        flexDirection: 'row',
    },
    justifyContent: {
        justifyContent: "center"
    },
    alignItems: {
        alignItems: 'center',
    },
    item: {
        height: 45,
        paddingLeft: 15,
        paddingRight: 15,
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        borderStyle: 'solid',
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 15,
        color: '#3e3e3e',
        fontFamily: 'Heiti SC'
    },
    text_1: {
        fontSize: 12
    },
    fontColor: {
        color: '#8d8c92'
    }
});