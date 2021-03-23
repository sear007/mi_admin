import React, { Component } from 'react';
import { View, Text,StyleSheet,Linking,ScrollView} from 'react-native';
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import { BulletList } from 'react-content-loader/native'
import { Button,Input,Icon } from 'react-native-elements';
class DriverScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        postLoading:true,
        driver_photo:'',
        driver_name:'',
        driver_name_input:false,
        tel_driver:'',
        tel_driver_input:false,
        position_driver:'',
        position_driver_input:false,
        dob_driver:'',
        license_no_driver:'',
        license_issued_date:'',
        license_expiry_date:'',
        
        indentification_photo:'',
        driver_license_photo:'',
        visible:false,
        index:0
    };
  }
  componentDidMount(){
      
    this.requestPostData();
  }
  requestPostData = async () => {
    const {route} = this.props;
    const {post_id} = route.params;
    await fetch('https://equipment.mohapiphup.com/api/show/'+post_id)
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        postLoading:false,
        driver_name: responseJson.operator.name_driver,
        tel_driver:responseJson.operator.tel_driver,
        position_driver:responseJson.operator.position_driver,
        dob_driver:responseJson.operator.dob_driver,
        license_no_driver:responseJson.operator.license_no_driver,
        license_issued_date:responseJson.operator.license_issued_date,
        license_expiry_date:responseJson.operator.license_expiry_date,
        driver_photo:responseJson.operator.driver_photo,
        indentification_photo:responseJson.operator.indentification_photo,
        driver_license_photo:responseJson.operator.driver_license_photo,
      });
    }).catch(error=>{
      console.log(error);
    })
  }
  render() {
    this.props.navigation.setOptions({ 
      title: 'hi',
      tabBarVisible: false,
    });
    const web = "https://equipment.mohapiphup.com/"
    const images = [
        this.state.driver_photo && web+this.state.driver_photo,
        this.state.indentification_photo && web+this.state.indentification_photo,
        this.state.driver_license_photo && web+this.state.driver_license_photo,
    ];
    const imagesView = [
        this.state.driver_photo && { uri: web+this.state.driver_photo},
        this.state.indentification_photo && { uri: web+this.state.indentification_photo},
        this.state.driver_license_photo && { uri: web+this.state.driver_license_photo},
    ];
    
    if (this.state.postLoading) {
        return(
            <View ><BulletList width="100%" /></View>
        )
    } else {
        return (
          <ScrollView>
            <View >
              <SliderBox
                  sliderBoxHeight={300}
                  images={images.filter(function(url){ return url != null })}
                  onCurrentImagePressed={(index)=> this.setState({visible:true,index})}
                  dotColor="#FFEE58"
                  inactiveDotColor="#90A4AE"
                  autoplay
                  circleLoop
                  resizeMethod={'resize'}
                  resizeMode={'cover'}
                  imageLoadingColor="#2196F3"
              />
              <ImageView
                  images={imagesView.filter(function(url){ return url != null})}
                  imageIndex={this.state.index}
                  visible={this.state.visible}
                  onRequestClose={()=>this.setState({visible:false})}
                  
              />
            <View style={styles.container}>  
                {this.state.driver_name&&<View style={styles.list}>
                  {this.state.driver_name_input ?
                  <Input
                  autoFocus={true}
                  inputContainerStyle={{height:20,borderBottomWidth:0}}
                  containerStyle={{ paddingHorizontal:0,height:20}}
                  value={this.state.driver_name} 
                  rightIcon={
                    <Icon name="save" onPress={()=>this.setState({driver_name_input:false})} size={30} />
                  }
                  onChangeText={(driver_name)=>this.setState({ driver_name })}
                  />:
                  <View style={styles.rowBetween}>
                    <Text style={styles.Text}><Text style={styles.TextMute}>Name:</Text> {this.state.driver_name}</Text>
                    <Icon onPress={()=> this.setState({driver_name_input:true}) } name="edit" size={30} />
                  </View>
                  }
                </View>}

                {this.state.tel_driver&&<View style={styles.list}>
                  {this.state.tel_driver_input ?
                  <Input
                  autoFocus={true}
                  inputContainerStyle={{height:20,borderBottomWidth:0}}
                  containerStyle={{ paddingHorizontal:0,height:20}}
                  value={this.state.tel_driver} 
                  rightIcon={
                    <Icon name="save" onPress={()=>this.setState({tel_driver_input:false})} size={30} />
                  }
                  onChangeText={(tel_driver)=>this.setState({ tel_driver })}
                  />:
                  <View style={styles.rowBetween}>
                    <Text style={styles.Text}><Text onPress={()=>Linking.openURL(`tel:${this.state.tel_driver}`)} style={styles.TextMute}>Phone:</Text> {this.state.tel_driver}</Text>
                    <Icon onPress={()=> this.setState({tel_driver_input:true}) } name="edit" size={30} />
                  </View>
                  }
                </View>}
                {this.state.position_driver&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Positon:</Text> {this.state.position_driver}</Text></View>}
                {this.state.dob_driver&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>DOB:</Text> {this.state.dob_driver}</Text></View>}
                {this.state.license_no_driver&& <View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>License No:</Text> {this.state.license_no_driver}</Text></View>}
                {this.state.license_expiry_date&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Expire On:</Text> {this.state.license_expiry_date}</Text></View>}
            </View>
          </View>
        </ScrollView>
        );
    }
    
  }
}
export default DriverScreen;

const styles = StyleSheet.create({
    rowBetween:{
      flexDirection:"row",
      flexWrap:"wrap",
      justifyContent:"space-between"
    },
    list:{
        paddingTop:5,
        paddingBottom:5,
        borderBottomColor:"#ccc",
        borderBottomWidth:1,
    },
    container:{
        padding: 10,
    },
    Text:{
        fontSize:17
    },
    TextMute:{
       color:"#999",
       fontSize:17
    },
});
