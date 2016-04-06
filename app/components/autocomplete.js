'use strict';

import {
    React,
    Component,
    View,
    Text,
    ScrollView,
    TextInput,
    Image,
    TouchableHighlight,
    StyleSheet,
    PixelRatio
} from 'nuke'


export default class Autocomplete extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {results, renderRow} = this.props;
        let items = results.map((item, index) => {
            return renderRow(item, index);
        });

        return (
            <View style={[styles.flex, styles.column]}>
                <View style={[styles.border, {height: 64}]}>
                    <View style={[styles.flex, styles.row, styles.searchContainer]}>
                        <View style={styles.searchBox}>
                            <Image
                                style={styles.searchIcon}
                                source={require('../images/search.png')}
                            />
                            <TextInput
                                style={styles.keyword}
                                placeholder={this.props.placeholder}
                                defaultValue={this.props.keyword}
                                autoFocus={true}
                                onChangeText={this.props.onChangeText}
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <TouchableHighlight style={{height: 33}} underlayColor="#fff" onPress={this.props.onCancelSearch}>
                            <View style={styles.cancelBox}>
                                <Text style={styles.cancelBtn}>取消</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

                <ScrollView
                    style={[styles.list]}
                >
                    {items}
                </ScrollView>
            </View>
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
    column: {
        flexDirection: 'column'
    },
    searchContainer: {
        marginTop: 23,
        marginLeft: 15
    },
    searchIcon: {
        width: 15,
        height: 15,
        marginTop: 9,
        marginLeft: 13,
        marginRight: 6
    },
    searchBox: {
        flex: 1,
        flexDirection: 'row',
        height: 33,
        backgroundColor: '#eee',
        borderRadius: 5
    },
    keyword: {
        flex: 1
    },
    cancelBox: {
        flex: 1,
        justifyContent: "center"
    },
    cancelBtn: {
        width: 60,
        textAlign: 'center',
        color: '#04C1AE'
    },
    list: {
        flex: 1,
        backgroundColor: '#eee'
    },
    item: {
        padding: 15
    },
    border: {
        borderBottomWidth: 1,
        borderBottomColor: '#d9d9d9',
        borderStyle: 'solid'
    }
});
