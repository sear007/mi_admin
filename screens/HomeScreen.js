import React, { Component } from 'react';
import { StyleSheet,View, Text, Dimensions,TouchableOpacity,ScrollView,Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListItem, Avatar,SearchBar,Button } from 'react-native-elements';
import { BulletList } from 'react-content-loader/native'
import Search from './../components/Search'
export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      categoriesLoading:true,
      searchData: [],
      expireData: [],
      search:'',
      searchLoading:false
    };
  }
  componentDidMount(){
    this.requestCategory();
    this.requestExpireLicense();
  }
  requestCategory = async () =>{
    await fetch('https://equipment.mohapiphup.com/api/categories_app')
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        categories: responseJson,
        categoriesLoading:false,
      });
    }).catch(error=>{
      console.log(error);
    })
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
  render() {
    return (
      <ScrollView>
      <View>
        {<Search />}
        {this.state.categoriesLoading ? <BulletList />:<View/>}
        <View style={[styles.countBoxWrapper,styles.container]}>
          {this.state.categories.map(d=>(
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('CategoryScreen',{category_id:d.id,category_name:d.name_en})}>
              <View style={styles.countBox}>
                <Text> {d.name_en}</Text>
                <View style={styles.badgeCountBox}><Text>{d.posts_count}</Text></View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
            {this.state.expireData.length > 0 ?
            <View>
            <View style={styles.headerBox}>
              <Text style={{ fontSize:16,marginBottom:10 }}>Expired Insurance</Text>
              <Button onPress={()=>this.props.navigation.navigate('ExpiredInsurance')} type='clear' title="Others" 
              icon={
                <Icon name="chevron-forward-outline" size={25} />
              }
              iconRight
              />
              </View>
              {this.state.expireData.map((d,i)=>(
                i<5 ?
                <ListItem onPress={()=> this.props.navigation.navigate('DetailScreen',{post_id:d.id,old_equipment_id:d.old_equipment_id}) } key={`expired_insture${i}`} bottomDivider>
                <Icon color="#ca3f3f" size={30} name="alert-circle-outline" />            
                <ListItem.Content>
                    <ListItem.Subtitle>{d.old_equipment_id}</ListItem.Subtitle>
                    <ListItem.Subtitle><Text style={{fontSize:12,color:"#ca3f3f"}}>Since : {d.license}</Text></ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>:<View />
              ))}
            </View>:<View />}
      </View>
      </ScrollView>
    );
  }
}
const styles = require('./../styles')