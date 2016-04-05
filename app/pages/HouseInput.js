import {
    React,
    Component,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableHighlight,
    PixelRatio,
    ScrollView
} from 'nuke';

import WithLabel from '../components/LabelTextInput';
import ErrorMsg from '../components/ErrorMsg';
import TouchableSubmit from '../components/TouchableSubmit';

class HouseInput extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let isSelected = true;
        return (
            <View style={{backgroundColor: '#eee', marginTop: 40}}>
                <View style={styles.formBox}>
                    <WithLabel
                        label='小区'
                        arrow={true}
                        value=''
                        placeholder='选择小区'
                        editable={false}
                        onFocus={() => {}}
                    />
                    <WithLabel
                        label='楼栋'
                        rightText='号/座'
                        value=''
                        placeholder='输入楼号/座号'
                        onFocus={() => {}}
                    >
                        <Attached
                            isSelected={false}
                            attachedText='独栋'
                        />
                    </WithLabel>
                    <WithLabel
                        label='单元'
                        value=''
                        placeholder='(选填)输入单元号'
                        onFocus={() => {}}
                    >
                        <Attached
                            isSelected={true}
                            attachedText='无'
                        />
                    </WithLabel>
                    <WithLabel
                        label='房号'
                        rightText='室'
                        value=''
                        placeholder='输入房号'
                        onFocus={() => {}}
                    >
                        <Attached
                            isSelected={false}
                            attachedText='别墅'
                        />
                    </WithLabel>
                    <WithLabel
                        label='户型'
                        arrow={true}
                        value=''
                        placeholder='请选择户型'
                        editable={false}
                        onFocus={() => {}}
                    />
                    <WithLabel
                        label='面积'
                        rightText='平米'
                        value=''
                        placeholder='输入面积'
                        onFocus={() => {}}
                    />
                    <WithLabel
                        label='价格'
                        rightText='万'
                        value=''
                        placeholder='输入价格'
                        onFocus={() => {}}
                    />
                </View>
                <View style={styles.formBox}>
                    <WithLabel
                        label='称呼'
                        value=''
                        placeholder='(选填)如张先生'
                        onFocus={() => {}}
                    />
                    <WithLabel
                        label='电话'
                        value=''
                        placeholder='输入联系电话'
                        onFocus={() => {}}
                    />
                </View>
                <ErrorMsg
                    errBoxStyle={{paddingLeft: 20}}
                    errText=''
                />
                <View style={styles.submitBox}>
                    <TouchableSubmit
                        submitText='完成'
                    />
                </View>
            </View>
        );
    }

    componentWillUnmount() {}
}

class Attached extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={styles.attached}>
                <TouchableHighlight>
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
                </TouchableHighlight>
                <Text style={styles.attachedText}>{this.props.attachedText}</Text>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    formBox: {
        marginTop: 15,
        borderTopWidth:1/PixelRatio.get(),
        borderTopColor: '#d9d9d9',
        backgroundColor: '#fff'
    },
    attached: {
        flexDirection: 'row',
        marginLeft: 45,
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
    },
    submitBox: {
        paddingLeft: 25,
        paddingRight: 25
    }
})

export default HouseInput;