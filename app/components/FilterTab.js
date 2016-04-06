'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, Image, TouchableWithoutFeedback, PixelRatio} from 'nuke';

export default class FilterTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {data, min, max} = this.props;
        let filterTab = data.map((v, k) => {
            let selectedText = null, selectedBg = null;
            if (v.get('min') == min && v.get('max') == max) {
                selectedText = styles.selectedText;
                selectedBg = styles.selectedBg;
            }
            return (
                <TouchableWithoutFeedback
                    key={k}
                    onPress={this._onPress.bind(null, v.get('min'), v.get('max'), v.get('title'))}
                >
                    <View style={selectedBg}>
                        <View style={[styles.justifyContent, styles.item, styles.borderBottom]}>
                            <Text style={[styles.text, selectedText]}>{v.get('title')}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        });

        return (
            <View>
                <ScrollView style={styles.filterTab}>
                    {filterTab}
                </ScrollView>
            </View>
        );
    }

    _onPress = (min, max, title) => {
        let titleName = '';
        if (min != 0 || max != 0) {
            titleName = title;
        }
        this.props.filterTabChanged(min, max, titleName);
    };
}

const styles = StyleSheet.create({
    filterTab: {
        height: 278,
        backgroundColor: '#f8f8f8'
    },
    text: {
        fontSize: 15,
        color: '#3e3e3e',
        fontFamily: 'Heiti SC'
    },
    item: {
        height: 40,
        marginLeft: 22
    },
    justifyContent: {
        justifyContent: 'center',
    },
    alignItems: {
        alignItems: 'center',
    },
    borderBottom: {
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1/PixelRatio.get(),
        borderStyle: 'solid'
    },
    selectedText: {
        color: '#04c1ae'
    },
    selectedBg: {
        backgroundColor: '#fff'
    }
});