import React, { Component } from 'react';
import { StyleSheet,View, Text, Dimensions,TouchableOpacity,ScrollView,Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListItem, Avatar,SearchBar,Button } from 'react-native-elements';
import { BulletList } from 'react-content-loader/native'
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
    searchData: [],
    search:'',
    searchLoading:false,
    showArea:false,
    };
  }

  requestSearch = async () =>{
    await fetch('https://equipment.mohapiphup.com/api/search_app/'+this.state.search)
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        searchData: responseJson,
        searchLoading:false
      });
    }).catch(error=>{
      console.log(error);
    })
  }
  updateSearch =  (search) =>{
    this.setState({
      search,
      searchData:[],
      searchLoading:true,
      showArea:true,
    },()=>{
    if(search){
        this.requestSearch();
    }else{
        this.setState({
            search,
            searchData:[],
            searchLoading:false,
            showArea:false,
        })
    }
    })
  }
  render() {
    const { search } = this.state;
    return (
      <View>
        <View style={{ marginBottom:10 }}>
          <SearchBar
            placeholder="Search Equipment"
            round
            lightTheme
            onChangeText={this.updateSearch}
            value={search}
            onCancel={this.updateSearch}
            onClear={this.updateSearch}
            showLoading={this.state.searchLoading}
          />
        </View>
        { this.state.categoriesLoading ? <BulletList />:<View/> }
        { this.state.showArea ?
          this.state.searchData.map((d,i)=>(
            <View style={{ marginBottom:10}}>
              <ListItem onPress={()=> this.props.navigation.navigate('DetailScreen',{post_id:d.id}) } key={`categories_${i}`} bottomDivider>
                <Avatar activeOpacity={0.7} size="large" source={{uri: `https://equipment.mohapiphup.com/${d.thumbnail.thumbnail}`}} />
                  <ListItem.Content>
                    <ListItem.Title>{d.old_equipment_id}</ListItem.Title>
                    <ListItem.Subtitle><Text style={styles.textMute}>{d.operator.name_driver}</Text></ListItem.Subtitle>
                    <ListItem.Subtitle><Text style={styles.textMute}>{d.plate_number}</Text></ListItem.Subtitle>
                    <ListItem.Subtitle><Text onPress={()=>Linking.openURL(`tel:${d.operator.tel_driver}`)} style={styles.textMute}>{d.operator.tel_driver}</Text></ListItem.Subtitle>
                  </ListItem.Content>
              </ListItem>
            </View>
          )):<View />}
      </View>
    );
  }
}
export default Search;
const styles = require('./../styles')