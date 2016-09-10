'use strict';
import {React, Component, View, Text, Image, StyleSheet, TouchableHighlight, Modal} from 'nuke'

export default class MessageNoticeModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let {visible, message, btnText, onClose, onSure, hideClose} = this.props;

        return (
            <Modal visible={visible} transparent={true} onRequestClose={() => {}}>
                <View style={styles.bgWrap}>
                    <View style={styles.contentContainer}>
                        {
                            hideClose ? null :
                            <TouchableHighlight
                                style={[styles.flex, styles.alignItems, styles.justifyContent, styles.closeBox]}
                                underlayColor="transparent"
                                onPress={onClose}
                            >
                                <Image
                                    style={styles.closeIcon}
                                    source={require("../images/close.png")}
                                />
                            </TouchableHighlight>
                        }
                        <Text style={styles.textCenter}>{message || ""}</Text>

                        <TouchableHighlight
                            style={[styles.alignItems, styles.justifyContent, styles.sureBtn]}
                            onPress={onSure}
                            underlayColor='#04C1AE'
                        >
                            <View>
                                <Text style={[styles.btnText]}>{btnText || "确认"}</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    }
}

let styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    alignItems: {
        alignItems: 'center'
    },
    justifyContent: {
        justifyContent: 'center'
    },
    bgWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    contentContainer: {
        width: 270,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingBottom: 27,
        paddingTop: 32,
        backgroundColor: "#fff",
        alignItems: 'center'
    },
    textCenter: {
        textAlign: 'center'
    },
    closeBox: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 50,
        height: 30
    },
    closeIcon: {
        marginTop: 5,
        width: 18,
        height: 18
    },
    sureBtn: {
        width: 190,
        height: 30,
        borderRadius: 5,
        backgroundColor: '#04c1ae',
        marginTop: 20
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
    },
});