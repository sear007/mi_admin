import React, { Component } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
import { View, Text } from 'react-native';




import DriverScreen from './DriverScreen';




const TabOption = {
    activeTintColor: '#00152e',
    labelStyle: { fontSize: 14 },
    style: { backgroundColor: '#c4d7ee',},
    scrollEnabled:true,
    tabStyle: { width: 200,borderBottom:0 },
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

  componentDidMount(){
  }
  
  render() {
    const {route} = this.props;
    const {post_id} = route.params;
    return(
        <Tab.Navigator initialRouteName="DriverDetail" tabBarOptions={TabOption}>
            <Tab.Screen initialParams={{ post_id: post_id }}  name="DriverDetail" options={{ tabBarLabel: 'Driver Detail' }}>{post_id => <DriverScreen {...post_id} />}</Tab.Screen>
        </Tab.Navigator>
    )
    
  }
}

export default DetailScreen;
