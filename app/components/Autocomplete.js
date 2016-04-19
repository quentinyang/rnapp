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
    PixelRatio,
    Platform
} from 'nuke'

import FormContainer from './FormContainer'
let ActionUtil = require( '../utils/ActionLog');

export default class Autocomplete extends Component {
    constructor(props) {
        super(props);
        ActionUtil.setActionWithExtend(this.props.visibleLog, {"bp": this.props.bp});
    }

    render() {
        let {results, renderRow} = this.props;
        let items = results.valueSeq().map((item, index) => {
            return renderRow(item, index);
        });

        return (
            <View style={[styles.flex, styles.column]}>
                <View style={[styles.border, styles.box]}>
                    <View style={[styles.flex, styles.row, styles.searchContainer]}>
                        <View style={styles.searchBox}>
                            <Image
                                style={styles.searchIcon}
                                source={require('../images/search.png')}
                            />
                            <TextInput
                                style={styles.keyword}
                                placeholder={this.props.placeholder}
                                placeholderTextColor='#8d8c92'
                                defaultValue={this.props.keyword}
                                autoFocus={true}
                                onChangeText={this.props.onChangeText}
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <TouchableHighlight style={styles.cancelBtnBox} underlayColor="#fff" onPress={this.props.onCancelSearch}>
                            <View style={styles.cancelBox}>
                                <Text style={styles.cancelBtn}>取消</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>

                <FormContainer
                    style={[styles.list]}
                >
                    {items}
                </FormContainer>
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
    box: {
        height: (Platform.OS === 'ios') ? 65 : 45,
    },
    column: {
        flexDirection: 'column'
    },
    searchContainer: {
        marginTop: (Platform.OS === 'ios') ? 25 : 6,
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
        flex: 1,
        fontSize: 15,
        padding: 0
    },
    cancelBox: {
        flex: 1,
        justifyContent: "center"
    },
    cancelBtnBox: {
        height: 33
    },
    cancelBtn: {
        width: 60,
        textAlign: 'center',
        fontSize: 15,
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
        borderBottomWidth: 1/PixelRatio.get(),
        borderBottomColor: '#d9d9d9',
        borderStyle: 'solid'
    }
});
