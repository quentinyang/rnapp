'use strict';

import {
    React,
    Component,
    View,
    Text,
    Image,
    TouchableHighlight,
    StyleSheet,
} from 'nuke';

export default class Attached extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
                <TouchableHighlight
                    style={styles.attachedTouch}
                    underlayColor='#fff'
                    onPress={this.props.toggleAttach}
                >
                    <View style={[styles.attached]}>
                        {this.props.isSelected ?
                            <Image
                                source={require('../images/selected.png')}
                                style={styles.selectedImage}
                            /> :
                            <Image
                                source={require('../images/unSelected.png')}
                                style={styles.selectedImage}
                            />
                        }
                        <Text style={styles.attachedText}>{this.props.attachedText}</Text>
                    </View>
                </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    attachedTouch: {
        marginLeft: 35
    },
    attached: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 55
    },
    attachedText: {
        paddingTop: 1,
        fontSize: 15,
        fontWeight: '200'
    },
    selectedImage: {
        width: 17,
        height: 17,
        marginRight: 5
    }
});