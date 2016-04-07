'use strict';

import {React, Component, View, StyleSheet, TabBar} from 'nuke';
import HomeContainer from '../containers/HomeContainer';
import HouseInputContainer from '../containers/HouseInputContainer';
import UserContainer from '../containers/UserContainer';

export default class TabView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabIndex: 0
        };

        this._renderScene = this._renderScene.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <TabBar
                    tintColor='#04c1ae'
                    translucent={true}
                    barTintColor='#f8f8f8'>
                    {
                        tabArr.map(
                            (val) => {
                                return (
                                    <TabBar.Item
                                        title={val.title}
                                        selected={this.state.tabIndex === val.key}
                                        icon={{uri: val.icon, scale: 2}}
                                        key={val.key}
                                        onPress={() => {
                                            this.setState({
                                                tabIndex: val.key
                                            });
                                        }}>
                                            {this._renderScene()}
                                    </TabBar.Item>
                                );
                            }
                        )
                    }
                </TabBar>
            </View>
        )
    }

    _renderScene() {
        let {navigator} = this.props;
        let {tabIndex} = this.state;

        switch(tabIndex) {
            case 0:
                return <HomeContainer navigator={navigator} rout='全部房源'/>;
                break;
            case 1:
                return <HouseInputContainer navigator={navigator} rout='发房'/>;
                break;
            case 2:
                return <UserContainer navigator={navigator} rout='我的'/>;
                break;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tabBar: {
        flex: 1,
        alignItems: 'flex-end'
    }
});

const tabArr = [
    {
        key: 0,
        title: '看房',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAuCAYAAABqK0pRAAAAAXNSR0IArs4c6QAABVhJREFUaAXtWX1oHEUUf2/ucpeaRktVGloCYsEPUIsilIKgYAXrHxUVIhirLcakSW4vt3eoFAP6R6RIcreXu0ubxJhWawUDKvSPSrEFwYKIgvgBaqVSCMbUqqRJ03z0dsY321672dvd+8htDCULl33z3pv33m9m3uybCYKHT19f3+q5OX6XdBEMsl/a29sveOWOeWFYCIGJnnTH7Iw+Jrj4Rv4kLXlS5oXPihtNp9Pr5+fhIAjxmG3AiJ8HArBTUZQxW3mZzIoC0bTU00LHQQHiZrd4EPAf9IlmVQ1/4qZXiqwiQIxcmOVJWjYvleQc8d1gNYtUIncWDSSZzGzWs/wwAdhYCgiT7mmfnzVGIqGvTbySybKBjIyM+P4YPdvJhegkr35Hz4ijhkyIekcdgCxD7NpQv66roaFBd9FzFJUFRNP23S50/QPKhS2OlqUA8SPGVu+WJOcX+mkDeFbSTg/lzlfo8z2vqm2/O+k48UsGosVTO7mAFBmsdTSKMImMhVQ1dMiso2mZHYLzjBBwo5lvoacYQliNhQ9a+K7NooEkEkNrQcwMUkI/U8DiScaqdqhq6xk7PU3bfxvnlw6BgIfs5DkeIn4MuKo5Gm36N8dzexcFhLbVrVzH9wDEehdjcp2/GYmG9lIQ3EWPVphgyURmjwB4g+gqZ10cYz7xIm3Tx511LktcgaRSR4PZ+dN7ASFCDp11EU8hQmM0qnxbyKFZnkikH6RldpiQ3WHmm2kaFEpFSPoDG/eEw0/MmWVm2jG43t799+jZ7IcE4F5zBytNCTpYUxtQW1paLlplxbQHBgZumJ6a1yjaZjd9AvSjz+9/rqOj9Sc7vTwgcuS1eCYMKN6m0QradZI8moFzDLApElOOOOmUwk/G09s5iCHyeatTP/I5BwJfU2OhlDFTJsUFQArWSVc60ix8xvzVuyKRl8+abC2aTCbfWcezswdodra5GrOp164CKaZOohGZoXx5NRoNZ1wdLVJIK6JdAO+m2VnlZMpar6H8Qo+OjtPHCpqcOhl8hO8Y8zWqavvPrnoVEmpa392c67QRwP2uJhGG6uvrdvu2bH64m7bVkIsyp4ToJuXGpqZdFV1KLj7h2LGjf5O/A5OT0zJPZQVxdfVY+j0wdf5iDcZ70n8SkDqL8HKT6iTG4AVVVb6wlS8RU9PSj3AO79M27VCv4TidEB1ByDrpvv8bhBwrGYOMRdZu9mMn6mhGUvSBtTwIJ2Kx8FYLd1k04/HUccqbR63B2J7ZUeAPVsXl0naKzfkcUSBy+nCy4eHhmunpoJGEa9ZwfWLilqyibLtUqNYqYLoscVlAtJ60koin3yKPVMpPG47P/SVfE6AlMiIRTx1Ro8pT1q+vUTUk0p/SBrRd0kZH+z9TyJC+V0q/vTifa7u08tUWcqiU6CCO7XlEBkgfsieTyX2bFvYCkDwpKwBCdqulPIhZ+7u1ywJCQ+lYg+WccY7VOTr3tuPlZHlvIfL65+mYGGUBMfVfNuSSAqmuFmcIebYo9Ai/FaV3RamsZC/FgVmX7q/Ge+OZx3UBVN0Kl0EUU4EgGzb3LUQvKRAZTEcsdIJe8lfRx2VUKurHc2MrQDwf4hIdrMxIiQPmufrKjHg+xCU6uN5nRGwocUCWUN0+NvujLsC8vDmh6L63ixBB9FM5vtZOluPRhXYn3WSfyrUr9N5EFxCvkK2A1Z5TiRKgDq9blXPt/EN+TnLtTf/J6rrW8p66fnLEuBj2fsA89oCzjG63v/TYi+fm6cR6kvmqqtrokmBJ7nO9QGTEzlircZNBlwGMLgbupDP1TV4488omY+J8JNL2q7x++g+SXOOFN4aENQAAAABJRU5ErkJggg==',
        selectedIcon:'ios-list',
        systemIcon: 'bookmarks'
    },
    {
        key: 1,
        title: '发房',
        icon: 'data:image/png;base64,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',
        selectedIcon:'ios-paper',
        systemIcon: 'history'
    },
    {
        key: 2,
        title: '我的',
        icon: 'data:image/png;base64,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',
        selectedIcon:'ios-paper',
        systemIcon: 'downloads'
    }
];