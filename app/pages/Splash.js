import React, {Text, Dimensions, InteractionManager} from 'react-native';
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
        }, 2000);
    }

    render() {
        return (
            <Text>Hello, world</Text>
        );
    }
}

export default Splash;