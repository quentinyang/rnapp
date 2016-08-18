'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, PixelRatio} from 'nuke';

export default class Filter extends Component {
    constructor(props) {
        super(props);

        this._onPress = this._onPress.bind(this);
        this._onlyVerify = this._onlyVerify.bind(this);
    }

    render() {
        let {tabType, onlyVerify, areaName, priceName, bedroomsName} = this.props;

        return (
            <View style={styles.filterWrap}>
                <View style={[styles.row, styles.listFilter, styles.alignItems]}>
                    <View style={[styles.flex, styles.justifyContent, styles.borderRight]}>
                        <TouchableWithoutFeedback onPress={this._onPress.bind(null, 1)}>
                            <View style={[styles.flex, styles.row, styles.alignItems, styles.justifyContent]}>
                                <Text style={styles.commonText}>
                                    {areaName ? areaName : '区域 '}
                                </Text>
                                <ImageItem dropUp={tabType == 1}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex, styles.justifyContent, styles.borderRight]}>
                        <TouchableWithoutFeedback onPress={this._onPress.bind(null, 2)}>
                            <View style={[styles.flex, styles.row, styles.alignItems, styles.justifyContent]}>
                                <Text style={styles.commonText}>
                                    {priceName ? priceName : '价格 '}
                                </Text>
                                <ImageItem dropUp={tabType == 2}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex, styles.justifyContent, styles.borderRight]}>
                        <TouchableWithoutFeedback onPress={this._onPress.bind(null, 3)}>
                            <View style={[styles.flex, styles.row, styles.alignItems, styles.justifyContent]}>
                                <Text style={styles.commonText}>
                                    {bedroomsName ? bedroomsName : '户型 '}
                                </Text>
                                <ImageItem dropUp={tabType == 3}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex, styles.justifyContent]}>
                        <TouchableWithoutFeedback onPress={this._onlyVerify.bind(null, !onlyVerify)}>
                            <View style={[styles.flex, styles.row, styles.alignItems, styles.justifyContent]}>
                                {
                                    onlyVerify ?
                                    <Image source={require('../images/selected.png')} style={styles.checkbox}/>
                                    : <Image source={require('../images/unSelected.png')} style={styles.checkbox}/>
                                }<Text style={styles.commonText}>{' ' + '认证房源'}</Text>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </View>
        );
    }

    _onPress(type) {
        this.props.filterItemPress(type);
    }

    _onlyVerify(onlyVerify) {
        this.props.filterItemPress('');
        this.props.onlyVerifyChanged(onlyVerify);
    }
}

class ImageItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {dropUp} = this.props;
        return (
            <Image
                source={require('../images/dropDown.png')}
                style={[styles.dropDown, styles.paddingLeft, dropUp ? styles.dropFlip: styles.dropFlipBack]}
            />
        );
    }

}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    },
    filterWrap: {
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1/PixelRatio.get(),
        borderStyle: 'solid'
    },
    listFilter: {
        height: 42,
        backgroundColor: '#f8f8f8'
    },
    alignItems: {
        alignItems: 'center',
    },
    justifyContent: {
        justifyContent: 'center',
    },
    textAlign: {
        textAlign: 'center'
    },
    dropDown: {
        width: 9,
        height: 6
    },
    dropFlip: {
        transform:[{scaleY: -1}]
    },
    dropFlipBack: {
        transform: [{scaleY: 1}]
    },
    checkbox: {
        width: 12,
        height: 12
    },
    commonText: {
        fontSize: 15,
        color: '#8d8c92'
    },
    paddingRight: {
        paddingRight: 6
    },
    paddingLeft: {
        paddingLeft: 10
    },
    borderRight: {
        borderRightColor: '#d9d9d9',
        borderRightWidth: 1/PixelRatio.get(),
        borderStyle: 'solid'
    },

});