'use strict';

import {React, Component, Modal, View, Image, Text, TouchableHighlight, ScrollView, StyleSheet} from 'nuke';
import WelfareCard from './WelfareCard';

export default class WelfareModal extends Component {
	constructor(props){
		super(props);
	}

	render() {
        let {isVisible, title, subTitle, welfareData, icon, children, closeModal, goPage, goTitle} = this.props;

        let welfareList = welfareData && welfareData.map((item, index) => {
            return (
                <WelfareCard
                    key={index}
                    icon={require('../images/welfare_short.png')}
                    item={item}
                    leftFlex={6}
                    wrapStyle={{width: 230, height: 60, marginBottom: 10}}
                />
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

                            {subTitle ? <Text style={[styles.subTitle]}>获得<Text style={[styles.subTitle, styles.orange]}>{subTitle}</Text>张看房卡</Text> : null}


                            {welfareData && welfareData.size > 3 ?
                                <ScrollView style={{height: 230, marginBottom: 14}}>{welfareList}</ScrollView>
                                : welfareList
                            }

                            {children}
                            <TouchableHighlight
                                underlayColor='#fff'
                                onPress={goPage}
                            >
                                <View style={styles.flex}>
                                    <Text style={[styles.giftBtn, styles.flex]}>{goTitle || '查看详情'}></Text>
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
        marginTop: 28,
        marginBottom: 10
    },
    subTitle: {
        marginBottom: 10,
        fontSize: 19
    },
    orange: {
        color: '#ff6d4b'
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
        fontSize: 12
    },
    coupon: {
        width: 37.5,
        height: 25
    },
});