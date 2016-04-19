'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, PixelRatio, Platform} from 'nuke';
let ActionUtil = require( '../utils/ActionLog');

export default class SearchNavigator extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {titleName} = this.props;
        return (
            <View style={styles.searchWrap}>
                <View style={[styles.searchBox, styles.row, styles.alignItems]}>
                    <TouchableWithoutFeedback onPress={this._onBack}>
                        <View style={styles.backBox}>
                            <Image
                                source={require('../images/back.png')}
                                style={styles.backImage}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._onSearch}>
                        {
                            titleName ? <View style={[styles.flex, styles.searchBtn, styles.alignItems, styles.justifyContent, styles.row]}>
                                    <Text style={[styles.flex, styles.textAlign, styles.titleNamePadding]}>{titleName}</Text>
                                    <TouchableWithoutFeedback onPress={this.props.onClearKeyword}>
                                        <View style={[styles.clearBox, styles.justifyContent]}>
                                            <Image
                                                source={require('../images/qingchu.png')}
                                                style={styles.qingchuImage}
                                            />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View> :
                                <View style={[styles.flex, styles.searchBtn, styles.alignItems, styles.justifyContent, styles.row]}>
                                    <Image
                                        source={require('../images/search.png')}
                                        style={styles.searchImage}
                                    />
                                    <Text style={[styles.searchText]}>
                                        搜索
                                    </Text>
                                </View>
                        }
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }

    _onBack = () => {
        let {onBack, navigator, backLog} = this.props;
        if(backLog) {
            ActionUtil.setAction(backLog);
        }
        if (onBack) {
            onBack()
        } else {
            navigator.pop()
        }
    };

    _onSearch = () => {
        this.props.onSearch();
    };
}

const styles = StyleSheet.create({
    searchWrap: {
        height: (Platform.OS === 'ios') ? 65 : 45,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        borderStyle: 'solid'
    },
    searchBox: {
        height: 45,
        paddingRight: 15
    },
    backBox: {
        paddingLeft: 15,
        height: 33,
        justifyContent: 'center'
    },
    backImage: {
        width: 9.5,
        height: 20.5,
        marginRight: 20
    },
    row: {
        flexDirection: 'row'
    },
    flex: {
        flex: 1
    },
    alignItems: {
        alignItems: 'center'
    },
    justifyContent: {
        justifyContent: 'center'
    },
    textAlign: {
        textAlign: 'center'
    },
    searchBtn: {
        height: 33,
        backgroundColor: '#eee',
        borderRadius: 5
    },
    searchImage: {
        width: 15.5,
        height: 15.5,
        marginTop: 2,
        marginRight: 5
    },
    searchText: {
        fontSize: 15,
        color: '#8d8c92'
    },
    clearBox: {
        height: 33
    },
    qingchuImage: {
        width: 15,
        height: 15,
        marginRight: 10
    },
    titleNamePadding: {
        paddingLeft: 25
    }
});