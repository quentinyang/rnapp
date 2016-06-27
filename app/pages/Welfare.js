import {
    React,
    Component,
    View,
    Text,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    Alert,
    Modal,
    PixelRatio,
    StyleSheet
} from 'nuke';

let ActionUtil = require( '../utils/ActionLog');
import * as actionType from '../constants/ActionLog'

export default class Welfare extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScrollView style={styles.container}>

            </ScrollView>
        );
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
});