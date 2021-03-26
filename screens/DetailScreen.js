import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
import { View, Text } from 'react-native';




import DriverScreen from './DriverScreen';
import EquipmentScreen from './EquipmentScreen';
import InspectionScreen from './InspectionScreen';




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

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    
    const {route} = this.props;
    const {post_id} = route.params;
    return(
        <Tab.Navigator initialRouteName="DriverInformation" tabBarOptions={TabOption}>
            <Tab.Screen initialParams={{ post_id: post_id }}  name="DriverInformation" 
            options={{ 
              tabBarLabel: 'Driver Information' 
            }}>{post_id => <DriverScreen {...post_id} />}</Tab.Screen>
            <Tab.Screen initialParams={{ post_id: post_id }}  name="EquipmentInformation" options={{ tabBarLabel: 'Equipment Information' }}>{post_id => <EquipmentScreen {...post_id} />}</Tab.Screen>
            <Tab.Screen initialParams={{ post_id: post_id }}  name="InspectionInformation" options={{ tabBarLabel: 'Inspection Information' }}>{post_id => <InspectionScreen {...post_id} />}</Tab.Screen>
        </Tab.Navigator>
    )
    
  }
}

export default DetailScreen;
