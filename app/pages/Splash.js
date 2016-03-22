import React, {Text, View, Dimensions, InteractionManager, StyleSheet, Platform, PixelRatio} from 'react-native';
import MainContainer from '../containers/MainContainer';

let {height, width} = Dimensions.get('window');

class Splash extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {navigator} = this.props;

        setTimeout(() => {
            InteractionManager.runAfterInteractions(() => {
                navigator.resetTo({
                    component: MainContainer,
                    name: 'Main'
                });
            });
        }, 5000);
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={styles.content}>
                    <Text>MIXIMII</Text>
                </View>
            </View>
        );
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
    },
    content: {
        marginTop: (Platform.OS === 'ios')? 64: 48,
        backgroundColor:'#fff',
        width: Dimensions.get('window').width,
        flex:1,
        borderColor:'#e6e6e6',
        borderWidth: 1/PixelRatio.get(),
    },
});

export default Splash;