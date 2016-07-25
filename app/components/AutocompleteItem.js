'use strict';

import {React, Component, View, Text, Image, StyleSheet, PixelRatio, ListView, InteractionManager, ScrollView, TouchableHighlight, Alert} from 'nuke'

export default class AutocompleteItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {item} = this.props;
        return (
            <TouchableHighlight
                underlayColor="#fff"
                onPress={this.props.onPress.bind(null, item)}
            >
                <View style={[styles.flex, styles.row, styles.alignItems, styles.item]}>
                    <View style={[styles.flex, styles.justifyContent]}>
                        <Text style={styles.text}>{item.get('name')}</Text>
                        <Text numberOfLines={1} style={[styles.text_1, styles.fontColor]}>{item.get('address')}</Text>
                    </View>
                    <Text style={[styles.text, styles.text_1, styles.sellerNum]}>{'约' + item.get('selling_house_count') + '套'}</Text>
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
        color: '#3e3e3e'
    },
    text_1: {
        fontSize: 12
    },
    sellerNum: {
        width: 75,
        textAlign: "right"
    },
    fontColor: {
        color: '#8d8c92'
    }
});