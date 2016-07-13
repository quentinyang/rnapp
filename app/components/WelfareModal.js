'use strict';

import {React, Component, Modal, View, Image, Text, TouchableHighlight, ScrollView, StyleSheet} from 'nuke';

export default class WelfareModal extends Component {
	constructor(props){
		super(props);
	}

	render() {
        let {isVisible, title, subTitle, welfareData, icon, children, closeModal, goPage} = this.props;
        let welfareList = welfareData && welfareData.map((item, index) => {
            return (
                <View key={index} style={{flex: 1, height: 60, marginBottom: 15, backgroundColor: '#eee'}}><Text>{item.get('name')}</Text></View>
            );
        });
		return (
			<Modal visible={isVisible} transparent={true} onRequestClose={() => {}}>
                <View style={styles.bgWrap}>
                    <View>
                        <View style={[styles.contentContainer, {marginTop: 32}]}>

                            <TouchableHighlight
                                style={[styles.flex, styles.alignItems, styles.justifyContent, styles.closeBox]}
                                underlayColor="transparent"
                                onPress={closeModal}
                            >
                                <Image
                                    style={styles.closeIcon}
                                    source={require("../images/close.png")}
                                />
                            </TouchableHighlight>

                            <Text style={[styles.title]}>{title}</Text>

                            {subTitle ? <Text style={[styles.subTitle]}>{subTitle}</Text> : null}


                            {welfareData && welfareData.size > 3 ?
                                <ScrollView style={{height: 170}}>{welfareList}</ScrollView>
                                : welfareList
                            }

                            {children}
                            <TouchableHighlight
                                underlayColor='#fff'
                                onPress={goPage}
                            >
                                <View style={styles.flex}>
                                    <Text style={[styles.giftBtn, styles.flex]}>查看详情></Text>
                                </View>
                            </TouchableHighlight>

                        </View>

                        <View style={[styles.alignItems, styles.justifyContent, styles.giftBg]}>
                            <Image style={icon ? icon.style : styles.coupon} source={icon ? icon.url : require("../images/coupon_white.png")}/>
                        </View>
                    
                    </View>

                </View>
            </Modal>
		);
	}
}

let styles = StyleSheet.create({
	row: {
        flexDirection: 'row'
    },
    alignItems: {
        alignItems: 'center',
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
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center"
    },
    closeBox: {
        position: "absolute",
        right: 0,
        top: 0,
        width: 50,
        height: 30,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    closeIcon: {
        width: 15,
        height: 11
    },
    title: {
        marginTop: 28
    },
    subTitle: {
        width: 230,
        marginTop: 10,
        marginBottom: 10
    },
    giftBg: {
        position: 'absolute',
        top: 0,
        left: 100,
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 5,
        borderColor: '#fff',
        backgroundColor: "#04C1AE"
    },
    giftBtn: {
        color: "#04c1ae",
        fontSize: 12,
        marginTop: 14
    },
    coupon: {
        width: 37.5,
        height: 25
    },
});