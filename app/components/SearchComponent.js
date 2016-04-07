'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke'
import Autocomplete from './autocomplete'

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
            />
        );
    }

    componentWillUnmount() {
        this.props.actions.settingSearchCleared();
    }

    renderRow(item, index) {
        return <Item key={index} item={item} onPress={this.onPress} />;
    }

    onChangeText(value) {
        let {actions} = this.props;
        actions.fetchCommunityList({keyword: value});
        actions.settingSearchKeywordChanged(value);
    }

    onPress(community) {
        this.props.onPress('communityChanged', community.toJS());
        this.cancelSearch();
    }

    cancelSearch() {
        this.props.onPress('searchChanged', false);
        this.props.actions.settingSearchCleared();
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
                    <Text style={[styles.text, styles.flex]}>{item.get('name')}</Text>
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
    }
});