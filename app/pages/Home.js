'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, TouchableWithoutFeedback} from 'nuke';
import HouseListContainer from '../containers/HouseListContainer';

export default class Home extends Component {
    constructor(props) {
        super(props);

        this._onHandlePress = this._onHandlePress.bind(this);
    }

    render() {
        return (
            <View style={styles.flex}>
                <View style={styles.searchWrap}>
                    <Text></Text>
                </View>
                <TouchableWithoutFeedback  onPress={this._onHandlePress}>
                    <View style={styles.allHouse}>
                        <Text>Image</Text>
                        <Text style={[styles.flex, styles.textPadding]}>全部房源</Text>
                        <Text>></Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        )
    }

    _onHandlePress() {
        let {navigator} = this.props;

        navigator.push({
            component: HouseListContainer,
            name: 'houseList',
            title: 'House List Page',
            hideNavBar: false
        });
    }
}

const styles = StyleSheet.create({
    searchWrap: {
        height: 60,
        backgroundColor: '#04c1ae'
    },
    flex: {
        flex: 1
    },
    allHouse: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1
    },
    textPadding: {
        paddingLeft: 10
    }
});