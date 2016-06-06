'use strict';

import {React, Component, Text, View, ScrollView, StyleSheet, PixelRatio, Image, TouchableWithoutFeedback} from 'nuke';

export default class Item extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {list, titleName} = this.props;

        return (
            <View>
                {
                    this._renderList()
                }
                {
                    this._renderFooter()
                }
            </View>
        );
    }

    _renderList = () => {
        let {list, titleName} = this.props;

        return list.map((v, k) => {
            return (
                <View style={[styles.communityWrap]} key={v.get('id')}>
                    <Text style={[styles.header, styles.headerText]}>{k == 0 ? titleName : ''}</Text>
                    <Text style={[styles.flex, styles.contentText]}>{v.get('name')}</Text>
                    <TouchableWithoutFeedback
                        onPress={this._handleDelete.bind(null, v.get('id'))}
                        >
                        <View>
                            <Image
                                source={require('../images/delete.png')}
                                style={styles.deleteImage}
                            />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            )
        })
    };

    _renderFooter = () => {
        let {list, titleName} = this.props;

        return (
            <View style={[styles.communityWrap]}>
                <Text style={[styles.header, styles.headerText]}>{list.size == 0 ? titleName: ''}</Text>

                <TouchableWithoutFeedback
                    onPress={this._handleAdd}
                    style={styles.flex}
                    >
                    <View style={styles.flex}><Text style={[styles.flex, styles.contentText, styles.addColor]}>添加小区</Text></View>
                </TouchableWithoutFeedback>
            </View>
        )
    };

    _handleDelete = (communityId) => {
        this.props.onDelete(communityId);
    };

    _handleAdd = () => {
        this.props.onAdd();
    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    communityWrap: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        borderBottomColor: '#ddd',
        borderBottomWidth: 1/PixelRatio.get()
    },
    header: {
        width: 65
    },
    headerText: {
        fontSize: 16,
        color: '#3e3e3e',
        fontWeight: 'bold'
    },
    contentText: {
        fontSize: 15,
        color: '#3e3e3e'
    },
    deleteImage: {
        width: 20,
        height: 20
    },
    addColor: {
        color: '#04c1ae',
        fontWeight: 'bold'
    }

})