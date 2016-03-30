'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight } from 'nuke'
import Autocomplete from '../components/autocomplete'

export default class SearchDemo extends Component {
    constructor(props) {
        super(props);
        this.i = 0;
    }
    componentWillUnmount() {
        this.props.actions.clearResult();
    }
    render() {
        return (
            <Autocomplete
                placeholder="搜索小区..."
                keyword={this.props.keyword}
                results = {this.props.results.toArray()}
                renderRow={this.renderRow.bind(this)}
                onChangeText={this.onChangeText.bind(this)}
                onCancelSearch={this.cancelSearch.bind(this)}
            />
        );
    }

    renderRow(item, index) {
        return <Item key={index} item={item} onPress={this.onPress} />;
    }
    onChangeText(value) {
        console.log(this.i++ + "onChange:");
        //action
        this.props.actions.fetchHouseList({page: 0});
    }
    onPress() {
        console.log("onPress");
    }
    cancelSearch() {
        this.props.actions.clearResult();
    }
}

class Item extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <TouchableHighlight
                key={this.props.key}
                underlayColor="#fff"
                style={[styles.item]}
                onPress={this.props.onPress}
            >
                <Text>{this.props.item.get("community_name")}</Text>
            </TouchableHighlight>
        );
    }
}
const styles = StyleSheet.create({
    item: {
        padding: 15,
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        borderStyle: 'solid'
    }
});