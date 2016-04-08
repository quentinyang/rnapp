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
                            {areaName ?
                                <Text style={[styles.flex, styles.textAlign, styles.commonText]}>
                                    {areaName}
                                </Text>
                                :
                                <View style={[styles.flex, styles.row, styles.alignItems, styles.justifyContent]}>
                                    <Text style={styles.commonText}>{'区域' + ' '}</Text><ImageItem dropUp={tabType == 1}/>
                                </View>
                            }
                            
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex, styles.justifyContent, styles.borderRight]}>
                        <TouchableWithoutFeedback onPress={this._onPress.bind(null, 2)}>
                            {priceName ? 
                                <Text style={[styles.flex, styles.textAlign, styles.commonText]}>
                                    {priceName}
                                </Text>
                                :
                                <View style={[styles.flex, styles.row, styles.alignItems, styles.justifyContent]}>
                                    <Text style={styles.commonText}>{'价格' + ' '}</Text><ImageItem dropUp={tabType == 2}/>
                                </View>
                            }
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex, styles.justifyContent, styles.borderRight]}>
                        <TouchableWithoutFeedback onPress={this._onPress.bind(null, 3)}>
                            {bedroomsName ?
                                <Text style={[styles.flex, styles.textAlign, styles.commonText]}>
                                    {bedroomsName}
                                </Text>
                                :
                                <View style={[styles.flex, styles.row, styles.alignItems, styles.justifyContent]}>
                                    <Text style={styles.commonText}>{'户型' + ' '}</Text><ImageItem dropUp={tabType == 3}/>
                                </View>
                            }
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={[styles.flex, styles.justifyContent]}>
                        <TouchableWithoutFeedback onPress={this._onlyVerify.bind(null, !onlyVerify)}>
                            <View style={[styles.flex, styles.row, styles.alignItems, styles.justifyContent]}>
                                {   
                                    onlyVerify ? 
                                    <Image source={require('../images/selected.png')} style={styles.checkbox}/>
                                    : <Image source={require('../images/unSelected.png')} style={styles.checkbox}/>
                                }<Text style={styles.commonText}>{' ' + '只看认证'}</Text>
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

    _onlyVerify(verify) {
        this.props.filterItemPress('');
        this.props.onlyVerifyChanged(verify);
    }
}

class ImageItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {dropUp} = this.props;

        return dropUp ? <Image source={require('../images/dropUp.png')} style={[styles.dropDown, styles.paddingLeft]}/> 
                : <Image source={require('../images/dropDown.png')} style={[styles.dropDown, styles.paddingLeft]}/>
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
    checkbox: {
        width: 12,
        height: 12
    },
    commonText: {
        fontSize: 15,
        fontFamily: 'Heiti SC',
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