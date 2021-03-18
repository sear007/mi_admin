import React, { Component } from 'react';
import { View, Text,StyleSheet } from 'react-native';
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import { Button } from 'react-native-elements';
import { BulletList } from 'react-content-loader/native'
class DriverScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        postLoading:true,
        driver_photo:'',
        driver_name:'',
        tel_driver:'',
        position_driver:'',
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
        <View style={{ marginTop:20 }}>
            <SliderBox
                images={images.filter(function(url){ return url != null })}
                onCurrentImagePressed={(index)=> this.setState({visible:true,index})}
                dotColor="#FFEE58"
                inactiveDotColor="#90A4AE"
                autoplay
                circleLoop
                resizeMethod={'resize'}
                resizeMode={'contain'}
            />
            <ImageView
            images={imagesView.filter(function(url){ return url != null})}
            imageIndex={this.state.index}
            visible={this.state.visible}
            onRequestClose={()=>this.setState({visible:false})}
            imageLoadingColor="#2196F3"
        />

        <View style={styles.container}>  
            <View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Name:</Text> {this.state.driver_name}</Text></View>
            <View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Phone:</Text> {this.state.tel_driver}</Text></View>
            <View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Positon:</Text> {this.state.position_driver}</Text></View>
            <View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>DOB:</Text> {this.state.dob_driver}</Text></View>
            <View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>License No:</Text> {this.state.license_no_driver}</Text></View>
            <View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Expire On:</Text> {this.state.license_expiry_date}</Text></View>
        </View>

        </View>
        );
    }
    
  }
}
export default DriverScreen;

const styles = StyleSheet.create({
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
