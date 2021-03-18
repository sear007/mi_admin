import React, { Component } from 'react';
import { StyleSheet,View, Text, Dimensions,TouchableOpacity,ScrollView,Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ListItem, Avatar,SearchBar,Button } from 'react-native-elements';
import { BulletList } from 'react-content-loader/native'
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
      searchLoading:true
    },()=>{
      this.requestSearch();   
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
    const { search } = this.state;
    return (
      <ScrollView>
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
        { this.state.searchData.length > 0 ?
          this.state.searchData.map((d,i)=>(
            <View style={{ marginBottom:10}}>
              <ListItem onPress={()=> this.props.navigation.navigate('DetailScreen',{post_id:d.id}) } key={i} bottomDivider>
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

        {this.state.categoriesLoading ? <BulletList />:<View/>}
        <View style={[styles.countBoxWrapper,styles.container]}>
          {this.state.categories.map(d=>(
          <View style={styles.countBox}>
            <Text> {d.name_en}</Text>
            <View style={styles.badgeCountBox}><Text>{d.posts_count}</Text></View>
          </View>
          ))}
        </View>
            {this.state.expireData.length > 0 ?
            <View>
            <View style={styles.headerBox}>
              <Text style={{ fontSize:16,marginBottom:10 }}>Expired Insurance</Text>
              <Button type='clear' title="Others" 
              icon={
                <Icon name="chevron-forward-outline" size={25} />
              }
              iconRight
              />
              </View>
              {this.state.expireData.map((d,i)=>(
                i<5 ?
                <ListItem onPress={()=> this.props.navigation.navigate('DetailScreen',{post_id:d.id}) } key={i} bottomDivider>
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

const styles = StyleSheet.create({
  headerBox:{
    flexDirection:"row",
    flexWrap:'wrap', 
    justifyContent:'space-between',
    alignItems:"center",
    padding: 10,
    backgroundColor:"#f5dbdb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    borderTopWidth:2,
    borderTopColor: "#ca3f3f",
  },
  flex:{
    flex:1
  },
  textMute:{
    color:"#777",
  },
  container:{
    padding: 10,
  },
  countBoxWrapper:{
    flexDirection:'row', 
    flexWrap:'wrap', 
    justifyContent:'space-between',
  },
  countBox:{
    position:"relative",
    width: Dimensions.get('window').width/2-16,
    backgroundColor:"#ede37e",
    padding: 10,
    marginBottom:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    
    elevation: 5,
  },
  badgeCountBox:{
    position:"absolute",
    right:-5,
    top:0,
    padding: 10,
    
  },
  white:{
    color:"#fff"
  },
  btnAppWrapper:{
    height:130,
    marginBottom:10,
  },
  btnInner:{
    alignItems:"center",
    justifyContent:"center",
  },

  btnApp:{
    width: 60,
    height: 60,
    borderRadius:60,
    marginBottom:10,
    marginRight:10,
    backgroundColor: "#d6cbf6",
    alignItems:"center",
    justifyContent:"center",
    borderWidth:2,
    borderColor:"#5435ac"
  },
  icon:{
    fontSize:30,
    color:"#8b6ae7",
  },
  textApp:{
    marginRight:10,
    fontSize:14,
    color:"#444",
    fontWeight: "bold",
  }

});
