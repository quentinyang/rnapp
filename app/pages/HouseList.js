'use strict';

import {React, Component, Text, View, ListView, StyleSheet, TouchableWithoutFeedback, RefreshControl} from 'nuke';
import HouseItem from '../components/HouseItem';
import Immutable, {List} from 'immutable'

let ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => !immutable.is(r1, r2)
});

export default class HouseList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            houseList: Immutable.fromJS([]),
            isRefreshing: false,
            loaded: false
        }

        this._renderRow = this._renderRow.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._reloadLists = this._reloadLists.bind(this);
        this._getRows = this._getRows.bind(this);
        this._onItemPress = this._onItemPress.bind(this);
    }

    render() {
        let {houseList} = this.state;

        return (
            <ListView
                style={styles.listViewWrap}
                dataSource={ds.cloneWithRows(houseList.toArray())}
                renderRow={this._renderRow}
                initialListSize={10}
                pageSize={10}
                scrollRenderAheadDistance={50}
                minPulldownDistance={30}
                onEndReachedThreshold={100}
                onEndReached={this._onEndReached}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.isRefreshing}
                        onRefresh={this._reloadLists}
                        tintColor=  "#fff"
                        title="正在拉取数据..."
                    />
                }
            />
        )
    }

    componentDidMount() {
        let {loaded, houseList} = this.state;

        if (!loaded) {
            this.setState({
                houseList: houseList.concat(this._getRows())
            })
        }
    }

    _renderRow(rowData: any, sectionID: number, rowID: number) {
        return (
            <HouseItem item={rowData} onItemPress={this._onItemPress}/>
        )
    }

    _onEndReached() {

    }

    _reloadLists() {
        let {houseList} = this.state;
        let newData = Immutable.fromJS([
            {
                "property_id": 940,
                "community_id": 2,
                "community_name": "绿绿123",
                "building_num": "3",
                "building_unit": "号",
                "door_num": "202",
                "avg_price": 33333,
                "district_id": 6,
                "district_name": "长宁",
                "block_id": 51,
                "block_name": "古北",
                "price": 400,
                "area": 120,
                "bedrooms": 2,
                "living_rooms": 2,
                "bathrooms": 2,
                "listed_at": "2015-12",
                "house_lock_status": 1,
                "unlock_house_cost": 0,
                "unlock_phone_cost": 2,
                "tags": [
                    {
                        "id": "16",
                        "name": "满五年"
                    },
                    {
                        "id": "17",
                        "name": "唯一住房"
                    }
                ],
                "updated_at": "2015-12-15"
            },
            {
                "property_id": 941,
                "community_id": 2,
                "community_name": "绿绿233444",
                "building_num": "3",
                "building_unit": "号",
                "door_num": "202",
                "avg_price": 33333,
                "district_id": 6,
                "district_name": "长宁",
                "block_id": 51,
                "block_name": "古北",
                "price": 400,
                "area": 120,
                "bedrooms": 2,
                "living_rooms": 2,
                "bathrooms": 2,
                "listed_at": "2015-12",
                "house_lock_status": 1,
                "unlock_house_cost": 0,
                "unlock_phone_cost": 2,
                "tags": [
                    {
                        "id": "16",
                        "name": "满五年"
                    },
                    {
                        "id": "17",
                        "name": "唯一住房"
                    }
                ],
                "updated_at": "2015-12-15"
            }
        ]);

        this.setState({
            houseList: newData.concat(houseList)
        })
    }

    _onItemPress() {

    }

    _getRows() {
        return Immutable.fromJS([
            {
                "property_id": 944,
                "community_id": 2,
                "community_name": "绿绿",
                "building_num": "3",
                "building_unit": "号",
                "door_num": "202",
                "avg_price": 33333,
                "district_id": 6,
                "district_name": "长宁",
                "block_id": 51,
                "block_name": "古北",
                "price": 400,
                "area": 120,
                "bedrooms": 2,
                "living_rooms": 2,
                "bathrooms": 2,
                "listed_at": "2015-12",
                "house_lock_status": 1,
                "unlock_house_cost": 0,
                "unlock_phone_cost": 2,
                "tags": [
                    {
                        "id": "16",
                        "name": "满五年"
                    },
                    {
                        "id": "17",
                        "name": "唯一住房"
                    }
                ],
                "updated_at": "2015-12-15"
            },
            {
                "property_id": 945,
                "community_id": 2,
                "community_name": "绿绿",
                "building_num": "3",
                "building_unit": "号",
                "door_num": "202",
                "avg_price": 33333,
                "district_id": 6,
                "district_name": "长宁",
                "block_id": 51,
                "block_name": "古北",
                "price": 400,
                "area": 120,
                "bedrooms": 2,
                "living_rooms": 2,
                "bathrooms": 2,
                "listed_at": "2015-12",
                "house_lock_status": 1,
                "unlock_house_cost": 0,
                "unlock_phone_cost": 2,
                "tags": [
                    {
                        "id": "16",
                        "name": "满五年"
                    },
                    {
                        "id": "17",
                        "name": "唯一住房"
                    }
                ],
                "updated_at": "2015-12-15"
            }
        ]);
    }
}

const styles = StyleSheet.create({
    listViewWrap: {

    },
});