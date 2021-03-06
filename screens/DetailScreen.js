import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import DriverScreen from './DriverScreen';
import EquipmentScreen from './EquipmentScreen';
import InspectionScreen from './InspectionScreen';
import InsuranceScreen from './InsuranceScreen';
const TabOption = {
    activeTintColor: '#00152e',
    labelStyle: { fontSize: 14 },
    style: { backgroundColor: '#c4d7ee',},
    scrollEnabled:true,
    tabStyle: { width: 220,borderBottom:0 },
    indicatorStyle: {
        backgroundColor:"#0756b0"   
    }
}
class DetailScreen extends Component {
  render() {
    const {navigation,route} = this.props;
    const {post_id,old_equipment_id} = route.params;
    navigation.setOptions({
      title:old_equipment_id
    })
    return(
        <Tab.Navigator initialRouteName="DriverInformation" tabBarOptions={TabOption}>
            <Tab.Screen initialParams={{ post_id: post_id }}  name="DriverInformation" options={{ tabBarLabel: 'Driver Information' }}>{post_id => <DriverScreen {...post_id} />}</Tab.Screen>
            <Tab.Screen initialParams={{ post_id: post_id }}  name="EquipmentInformation" options={{ tabBarLabel: 'Equipment Information' }}>{post_id => <EquipmentScreen {...post_id} />}</Tab.Screen>
            <Tab.Screen initialParams={{ post_id: post_id }}  name="InsuranceInformation" options={{ tabBarLabel: 'Insurance Information' }}>{post_id => <InsuranceScreen {...post_id} />}</Tab.Screen>
            <Tab.Screen initialParams={{ post_id: post_id }}  name="InspectionInformation" options={{ tabBarLabel: 'Inspection Information' }}>{post_id => <InspectionScreen {...post_id} />}</Tab.Screen>
        </Tab.Navigator>
    )
  }
}

export default DetailScreen;
