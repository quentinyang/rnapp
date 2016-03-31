'use strict';

import {React, Component, Text, View, ScrollView, Image, StyleSheet, InteractionManager, Platform, PixelRatio, TouchableWithoutFeedback} from 'nuke';
import Item from '../components/Item';

export default class AttentionBlockSetOne extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={[styles.flex, styles.pageBgColor]}>
                <TouchableWithoutFeedback
                    onPress={this._onPress}
                    >
                    <View style={[styles.blockWrap]}>
                        <Text style={[styles.header, styles.headerText]}>区域</Text>
                        <Text style={[styles.flex, styles.contentText]}>金杨、金桥、三林、北蔡</Text>
                        <Image
                            source={require('../images/next.png')}
                            style={styles.nextImage}
                        />
                    </View>
                </TouchableWithoutFeedback>
                <Item list={[1, 2]} titleName={'区域'}/>
            </ScrollView>
        );
    }

    _onPress = () => {

    };

    _handleDelete = () => {

    };
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    pageBgColor: {
        backgroundColor: '#eee'
    },
    blockWrap: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 15,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        marginBottom: 15,
        marginTop: 15,
        borderWidth: 1/PixelRatio.get()
    },
    nextImage: {
        width: 9,
        height: 18
    },
    
    header: {
        width: 65
    },
    headerText: {
        fontSize: 16,
        color: '#3e3e3e',
        fontWeight: 'bold',
        fontFamily: 'Heiti SC'
    },
    contentText: {
        fontSize: 15,
        color: '#3e3e3e',
        fontFamily: 'Heiti SC'
    }
});