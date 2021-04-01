import React, { Component } from 'react';
import { StyleSheet,View, Text, Dimensions,TouchableOpacity,ScrollView,Linking,SafeAreaView,ActivityIndicator,FlatList} from 'react-native';

import { ListItem, Avatar,SearchBar,Button,Icon } from 'react-native-elements';
import { BulletList } from 'react-content-loader/native'
class CategoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading:true,
        categories:[],
        currentPage:1,
        next_page_url:'start',
    };
  }
  componentDidMount(){
    this.requestCategory();
  }
  requestCategory =async()=>{
    const {currentPage}=this.state
    const {route} = this.props
    const {category_id} = route.params
    await fetch(`https://equipment.mohapiphup.com/api/category/${category_id}?page=${currentPage}`)
    .then((response)=>response.json())
    .then((responseJson)=>{
        this.setState({
            loading:false,
            categories: [...this.state.categories,...responseJson.data],
            totalPages:responseJson.lastPage,
            next_page_url: responseJson.next_page_url
        })
    })
  }
  Item=({item})=>{
    return(
        <ListItem onPress={()=> this.props.navigation.navigate('DetailScreen',{post_id:item.id,old_equipment_id:item.old_equipment_id}) } key={`expired_insture${item.id}`} bottomDivider>
        <Icon type="font-awesome" color="#eee" size={30} name="check" />            
        <ListItem.Content>
            <ListItem.Subtitle style={{ marginBottom:10 }}>{item.equipment_id}</ListItem.Subtitle>
            <ListItem.Subtitle><Text style={{fontSize:14,color:"#444"}}>ID : {item.old_equipment_id}</Text></ListItem.Subtitle>
            <ListItem.Subtitle><Text style={{fontSize:14,color:"#444"}}>Name: {item.driver_name}</Text></ListItem.Subtitle>
            <ListItem.Subtitle><Text onPress={()=>Linking.openURL(`tel:${item.tel_driver}`)} style={{fontSize:14,color:"#000"}}>Phone: {item.tel_driver}</Text></ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron />
        </ListItem> 
    )
  }
  handleLoadMore=()=>{
      this.setState({
          currentPage: this.state.currentPage+1,
      },()=>this.requestCategory())
  }
  renderFooter=()=>(<View style={{ alignItems:"center",margin:20 }}>{this.state.next_page_url?<ActivityIndicator />:<Text>No more</Text>}</View>)
  renderContent=()=>{
      return(
        <SafeAreaView>
            <FlatList 
                data={this.state.categories}
                renderItem={this.Item}
                keyExtractor={(item) => item.id}
                ListFooterComponent={this.renderFooter}
                onEndReachedThreshold={1}
                onEndReached={this.handleLoadMore}
            />
        </SafeAreaView>
      )
  }
  loadingContent=()=>(<View style={{ justifyContent:"center",flex:1,alignItems:"center"}}><ActivityIndicator/></View>)
  render() {
    const {loading} = this.state
    const { navigation,route } = this.props;
    const {category_name} = route.params;
    navigation.setOptions({
        title:`${category_name}`
    })
    return (
        loading ? this.loadingContent():this.renderContent()
    );
  }
}

export default CategoryScreen;
