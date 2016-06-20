'use strict';

import {React, Component, View, Text, StyleSheet, Navigator, TouchableOpacity, Image} from 'nuke';
import HomeContainer from '../containers/HomeContainer';
import PublishFirstStepContainer from '../containers/PublishFirstStepContainer';
import UserContainer from '../containers/UserContainer';

let _navigator = null;

export default class TabView extends Component {
    constructor(props) {
        super(props);

        let origin = this.props.route.from;
        this._renderScene = this._renderScene.bind(this);
        this._onWillFocus = this._onWillFocus.bind(this);
        if(origin == 'reCharge' || origin == 'withdrawSuccess') {
            this.state = {tabIndex: 2};
            this.props.actionsUser.fetchUserProfile({});
        } else {
            this.state = {
                tabIndex: 0
            };
        }
    }

    _renderScene(route, nav) {
        _navigator = nav;
        let {navigator, routeFromPage} = this.props;

        switch(route.key) {
            case 0:
                return <HomeContainer navigator={navigator} route={routeFromPage || route} rout='全部房源'/>;
                break;
            case 1:
                return <PublishFirstStepContainer navigator={navigator} route={routeFromPage || route} rout='发房'/>;
                break;
            case 2:
                return <UserContainer navigator={navigator} route={routeFromPage || route} rout='我的'/>;
                break;
        }
    }

    _onWillFocus(route) {
        this.setState({
            tabIndex: route.key
        });
    }

    render() {
        return (
            <Navigator
                style={styles.container}
                initialRoute={this.props.route.from == 'reCharge'? tabArr[2]:tabArr[0]}
                renderScene={this._renderScene}
                sceneStyle={styles.sceneStyle}
                configureScene={(route) => {
                    if (route.sceneConfig) {
                        return route.sceneConfig;
                    } else {
                        return Navigator.SceneConfigs.FadeAndroid;
                    }
                }}
                navigationBar={
                    <TabBar
                        navigator={_navigator}
                        tabIndex={this.state.tabIndex}
                        actionsUser={this.props.actionsUser}
                    />
                }
                onWillFocus={this._onWillFocus}
            />
        );
    }

    componentWillMount() {
    }
}

class TabBar extends Component {
    constructor(props) {
        super(props);

        this.changeNavigatorItem = this.changeNavigatorItem.bind(this);
    }

    render() {
        let {tabIndex, navigator, actionsUser} = this.props;
        return (
            <View style={styles.tabbar}>
            {
                tabArr.map(
                    (tabItem) => {
                        let isCurrentTab = tabIndex === tabItem.key;
                        let tabTextStyle = isCurrentTab ? styles.tabTextSelected : null;
                        return (
                            <TouchableOpacity
                                activeOpacity={1}
                                style={styles.tabitem}
                                key={tabItem.key}
                                onPress={()=>{
                                    if(tabIndex !== tabItem.key) {
                                        this.changeNavigatorItem(tabItem.key);
                                    }
                                    if (tabItem.key == 2) {
                                        actionsUser.fetchUserProfile({});
                                    }
                                }}
                            >
                                <View style={[styles.container, styles.center]}>
                                    <Image
                                        source={{uri: tabIndex == tabItem.key ? tabItem.selectedIcon : tabItem.icon}}
                                        style={{width: tabItem.width, height: tabItem.height,  marginBottom: 3}}
                                    />
                                    <Text style={[styles.tabText, tabTextStyle]}>{tabItem.title}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                )
            }
            </View>
        );
    }

    changeNavigatorItem(key) {
        let {tabIndex, navigator} = this.props;
        let cRoutes = navigator.getCurrentRoutes();
        if (cRoutes.length == 3) {
            navigator.jumpTo(tabArr[key])
        } else {
            let hasKeyRoute = cRoutes.filter((route) => {
                return route.key == key
            });

            if (hasKeyRoute.length > 0) {
                navigator.jumpTo(tabArr[key])
            } else {
                navigator.push(tabArr[key])
            }
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sceneStyle: {
        backgroundColor: '#fff'
    },
    tabbar: {
        backgroundColor: '#fff',
        borderTopColor:'#ddd',
        borderTopWidth: 1,
        height: 50,
        flexDirection:'row',
        position: 'relative',
        bottom:0,
        left:0,
        right:0,
    },
    tabitem: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent:'center',
    },
    tabText: {
        textAlign: 'center',
        fontSize: 12,
        marginTop: -2
    },
    tabTextSelected: {
        color: '#04c1ae'
    },
    center: {
        alignItems: 'center',
        justifyContent:'center',
    },
    tabItemImage: {

    }
});

const tabArr = [
    {
        key: 0,
        title: '看房',
        icon: 'data:image/png;base64,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',
        selectedIcon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAtCAYAAADoSujCAAAAAXNSR0IArs4c6QAABftJREFUaAXtWWmMFEUUrlfb3bPsEBYSCbqigShoxGhQQjDMzIrhXFhmBgGvEH8YiaL8ADwQSCRRFIhHPIhBE0Qh+AOZw8UDMW5mZhcMWX9AokHBBFmDqKsLAWZ3ju7n64Hurtm5Z3pBE2ZD6vVXr95R9erVqwLYIP0cscB4DWEHIjZxzlYm3Qt2D4YqGAyhcrTtLmSprxiykRn5wDQAeDLl9r9vtz5ut0ApGmhGlm43jdcVIOOo4Vbqe9ZufbY64OgIzydjaeZxWF5DkW1WYsGX8vZVCdrmgBwJPKqqaoDsqDdtAfYp4/AMA0AD0zRcJ0eD79DesCV8bXFAjoZWIMCHZGSdYSgA/2Cd2/9A2u1/neL/McJVo4+Mf1qJBrcvQjT5jb5K25pnQYmEXtaYtlZUzDnfmHT7XhAxMvh+jeEuCjFFwINjmuofOj6uJSFgFZFVr8B6RE4z/16W8XqoUMgMNF63KOnx76ljfD6FU1yw0H/iVH/bqMP7nAJWEVnVCtzd1SUfudC9ExkuFrSpwPnjKbdPD6WCP6kj4KJg2ksMjQYTMDjoHMZazkz0nzGwctuKHdBn6++z8T2UaWZZSiDBgT1IsxyysMKUfCA8EdPqPjHVArDDjjrnzPNTZ/1ZeGRuT0UONMb2johryS8opUwxRQGckzj39ru87SZWBqEcaLtVS6X2E+tog502+88SwvS+Zl+3gZVqy3agoSPclFLVfWT87ZZQ6AHOZtMJ+72FlU/VHwyOUZNsP4XizcYocuIkV6TpiSmtxwysWFuWA47O4E2aSooQxxrCSFE3ZZsZCZf3JwOrpnUe+vzaZF+CnMiamD848JlJj/dIKZkls5Aca7tTTbPOLOMZO0pLPbVW43XjLkyee3qI3NBME3LIMhZHaahFpM7APRaWnyq6AgUyRle9U5pzblJrT36R1aEjf2gf2tvT+xmNnmZJgAsSB1+/2/eNhWVTBVfAEQ3PZRr7mtjNdMeAfdtYx++z23jdpL8mTDs/+sYRLYxBm2UiOtMa7qVD0Gdh2VReB5RI+BEVtRCluSECe3DMdfUtPS7vOQGzlTwxdlq/yzN8AZ0LuyzB6NCQ7ZZjwSUWZlE5IUSF1nLaUG9Rnjf7SOA2n8e3dDeAWc9YIuyn9FN+Qyy8BVF7wpROpzz9LU81+7aYGBGmkTqoRILrqV55UWSgA+q1pGeB7XW8qKMQTaGzSUN8LqsfYE3a43/VwDIO6KWtEgu9rVeJRkem5Xx12u3blIVd5g8pGlrDUNsgquUAm+nUf17H4F5slzqjZz6iw+RhkYmO9k763pnBgMcbmNR21j2vV+S5XLQcCy2jyX03K6w527rW5V8GcjTwBiJbUcoYytM/pjz+CaX4Bqtf38SosW10P5UMHTTJb+pZaLIBFGtpBm5zfhceVYxnMPuoXNlB+3ERBY1wd4CFVA3wV6hGLys0MOnIm3YH03BRtl7t0sE2j5zIlN20gXeam3jc8S/Fm1Jm3K+nE4vpNeFjQ4gCDU1xz+zfje8r1Y7o2t8YT5y/JjHV/0smnii+KfUzYWkumqZEwym0rrKX1V49M16yK0dv76QZZwnU/7ErGhI5ll0CHB3BOXRd/YcO1ZM0iXcU4tPx/6QD9PSymrLNcFqFG+g0fup/5wAZPFQwWqQF+CJp5tScnjKBzAW/7+QSCtnryxxykQ1YXAH+SdzlPVXRuAHMNTtwJN69kQ7ClfoDaEU/Yk+BtpTG3FLRuAHMduwB64I/QHipT4rx8fpDQSm+Yv01rwBNvFDRQpq++ooppHpGpn7z/RTrJGF80ZF5O2t3QBQLLEyl7kIRGkjrj8AUPdsH4tV+2xFC1eq2ZdxVB2yZxhqEXF2BGibPlqFXV8CWaaxBSEXnQBL7tsqRYNZBRTl9fA36WTzdt41kZt1FSObYckuTihwgoa0k3N4fojdHZg5QWGXRPaBx9bfCQ3N76F5Xkr8OoCSPKJleHoryl6xDpEhgNT0t0qMrk0TBuTQeq3fKq8p5+JUiwXVk2Cyqo4r/Nyvg0QZQVhV7j/oXNQMNz0JL0QoAAAAASUVORK5CYII=',
        width: 24,
        height: 22.5,
        bp: ''
    },
    {
        key: 1,
        title: '发房',
        icon: 'data:image/png;base64,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',
        selectedIcon:'data:image/png;base64,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',
        width: 27.5,
        height: 28,
        hideNavBar: true,
        bp: ''
    },
    {
        key: 2,
        title: '我的',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAtCAYAAAAz8ULgAAAAAXNSR0IArs4c6QAABolJREFUWAnFWGtsVEUUnjP7aCmNltCKqJgoxoBG1Ej4IVFigz+Ul5pQodEmtSSbym67e9uY+H4lRsk+YLctVAONCSbyiAElKgIJQYiRxEgIpEFEjAEFQluUrZXb3jt+s+3cu233cdul9P45jznnzHfPvM4MsQK/1tbWW/U+sVQw8SgjMVMINp0RdZNgfwoSP3BetCcU8v1VSDc0Xud4fNN9A/36B4zRciFE1jhEgCvEHpfH81pjY/2J8fSXNXi2YBJQNNryPjp+FTY8m10GvUmc1oVC/tcB3MzQnlU1JpAdHR3F3d3JbQC4fETEExji3VzwTmLmZcF4OdI3B8O/Aj/1wDBboj1EM6o0rapvmD6H4M7RNqqppzv5STpAZKSTCxYKNgf2jjIeVLy5PtzypEkiBrD3p1RCzt+Lm8FXZ/EZpXacyVg4ETCZiFsRiL6sqLi5uqamptfSZWHa29tLepP6VgB9Vplg6DVNC8SUnIs6AhmLdZSZRvI3xsS0VDBih0tLiyp9Pl9/ruDpbQDq6U1e24fVv2hQT38Tn3K3pq3pTrfLxDua+KaZ1BRAItZH5Fk1FoCyY2lPvGg12KHMi5tJ9DVnAjVS5wgknJ63HAVv0bT685Y8Bkbul5zImjKmEFVO3POCjEZb78FiuVcF426+VfHjoYLoszS/2YlwYk6anJHNCxJec5UnMeoKBl8+ruTxUE3zn8SUuah8BxgrHCSZYqYKyIids/gCGCweOw6RHT9LzPyZJOZSvthC8OOFfxgRO44QeffqvCBxKl9QsDBMtym+EIqYdhwXz1t85AcpTOyPgx+GaWYikbhLyeOhGza034mFOMv2FVZ8WzecywsSp8JxHH/WlqPr5GjbGN6NLRnGtZW2RBeCwbU/23JmLi9IWWqhWNhlu5vN8fjWm2zZOYfas1SY9IrywHG3S8ZXcjaaF6R0dLuL1mE+XksFEax8oL9nY7aAufTX+ow2nFy3DNno5HJ/lMtetTkC2djo+0Mw2qCcsMqro+GWMKijs1/axSLxD5GyF1UMYjwRCtX/ruRc1FEnMoAsEJJX9f3IxOMqIIbqa7fH29DQ4DujdCOpXGi6zuJYLEtVG/yO3DFrRmVVVZWudLmoY5AySHu4vbyX9P3IzIMqKDrsR4a+4ELsZi5Xp9dkXTrHPccw5iL7yzGfn4OtN83+5JQSd2V9ff0lpctHxwRSBpO1YTKpb0Fm7KIjXy+qHVV5WVlJdV1d3VWlckIdzUkVCBnkfcn+SqxHj9I5pGe4y7WyqSmwbKwAZXxHmUxN/FjLaibYG+CtgiMbQFlAYAqcIUHHBPGds2ZVHML8M7LZ59PnBSlLqX5iHwPcYyODyaoIv3kQF66DLtN1zOD87LRpxV21tbX/jbQtRM4JMhpNVAuTbcaKLladDG2+3+ACFm9s8n83JKvmMdFIpPUJJszPkfl/8KMvaVrD95kCZJ2TkUjiHWEKFKg2QFxbt3kZzdGaAkvkDbEQgINgzKDc3DFKKKzpAC57z2QCmTGTkUjch/m3yXagS8T5Gk1b+5WtK5yLxRILkYgDOHeLZDS5nXEXLQ4G/YfSo48CCcdK0xB7YZSq82BwylNETwUCgbPpjteLj0bjC3Cef4uMpm6iAHp+qvA+5Gv2XVZ9DBtueZ8xDbYzDeBpbzFfOFEAJQjMw6PcxZaBTRXCGPrb/yU9ItvUNwwkE0bY/iN2xUt8qd/v71LGE0VDocARRvwtFR+3yBfWr2+bp2QL5IZw2yOYGytUA4Y55G/y/6LkiaalpZ4whloVwNwwjHdVnxZIg9lK7H2Hg1rgU2V0I6h8PMAB8LbVFwqSeHxLhZRTIOORjQ+jEFiiDFyCv1f49qKiOacez+wd2DOvDHm4Db13leRTIPvZgD3MeCkLNvv3OQ99/SwbGp5GYU07VES8xtkgMf8Wqwbw6S8MSn3jKM56qzPB5m/fvt3L5b0DygWqAbW23CMn7SMqOZrWuffcuYvzuK4bi7A3pUovOR/wXPxTmtENZ0Oh2itYD7+mdTyfM4MGX2ClVlDnZCyYNEApFqvcShQSOI+bxFLLfBAjnRrpMBky6lDrrQgF9nSsbipXQKCwGpVuUig31TYEeKyM4+pvZZKYGNPdYwJ/wAKJU3Ca3CetTArOkhPYsePQZLp6lDG2xDKOdJ5WCs7JmrBKNxmU3MJe3UQ9fGqp18eJ17ncfBGKzR8nA9TIPiUOiQl3qDbcMmv+B6ynURQqHGySAAAAAElFTkSuQmCC',
        selectedIcon:'data:image/png;base64,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',
        width: 20.5,
        height: 22.5,
        bp: ''
    }
];