import React, { Component } from 'react';
import { StyleSheet,View, Text, Dimensions,TouchableOpacity,ScrollView,Linking,FlatList,SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListItem, Avatar,SearchBar,Button } from 'react-native-elements';
import { BulletList } from 'react-content-loader/native'
import Search from './../components/Search'
class ExpiredInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
        expireData: [],
        
    };
  }
  componentDidMount(){
    this.requestExpireLicense();
  }
  requestExpireLicense = async () => {
    await fetch('https://equipment.mohapiphup.com/api/expire_insurance')
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        expireData: responseJson,
      });
    }).catch(error=>{
      console.log(error);
    })
  }
  Item=(item)=>{
      return(
        <ListItem onPress={()=> this.props.navigation.navigate('DetailScreen',{post_id:item.id}) } key={`expired_insture${item.id}`} bottomDivider>
        <Icon color="#ca3f3f" size={30} name="alert-circle-outline" />            
        <ListItem.Content>
            <ListItem.Subtitle>{item.old_equipment_id}</ListItem.Subtitle>
            <ListItem.Subtitle><Text style={{fontSize:12,color:"#ca3f3f"}}>Since : {item.license}</Text></ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      )
  }
  render() {
    return (
      <SafeAreaView>
        <FlatList
        ListHeaderComponent={()=><Search />}
        data={this.state.expireData}
        renderItem={({item}) => this.Item(item) }
        keyExtractor={item => item.id}
      />
      </SafeAreaView>
    );
  }
}

export default ExpiredInsurance;
