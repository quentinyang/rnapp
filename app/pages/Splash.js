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
                    name: 'Main',
                    title: 'Main Page'
                });
            });
        }, 1000);
    }

    render() {
        return (
            <View style={styles.container}>
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
        backgroundColor:'#fff',
        width: Dimensions.get('window').width,
        flex:1,
        borderColor:'#e6e6e6',
        borderWidth: 1/PixelRatio.get(),
        height: 40
    },
});

export default Splash;