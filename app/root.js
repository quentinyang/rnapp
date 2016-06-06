import {React, Component} from 'nuke';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import App from './containers/AppContainer';

const store = configureStore();

class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <App />
            </Provider>
        )
    }
}

export default Root;