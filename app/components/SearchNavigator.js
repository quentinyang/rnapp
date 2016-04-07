'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, PixelRatio} from 'nuke';

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
                        <Image
                            source={require('../images/back.png')}
                            style={styles.backImage}
                        />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={this._onSearch}>
                        {
                            titleName ? <View style={[styles.flex, styles.searchBtn, styles.alignItems, styles.justifyContent, styles.row]}>
                                    <Text style={[styles.flex, styles.textAlign, styles.titleNamePadding]}>{titleName}</Text>
                                    <TouchableWithoutFeedback onPress={this.props.onClearKeyword}>
                                        <Image
                                            source={require('../images/qingchu.png')}
                                            style={styles.qingchuImage}
                                        />
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
        let {onBack, navigator} = this.props;
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
        height: 65,
        paddingTop: 20,
        backgroundColor: '#f8f8f8',
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        borderStyle: 'solid'
    },
    searchBox: {
        height: 45,
        paddingLeft: 15,
        paddingRight: 15
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
        borderRadius: 10
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
    qingchuImage: {
        width: 15,
        height: 15,
        marginRight: 10
    },
    titleNamePadding: {
        paddingLeft: 25
    }
});