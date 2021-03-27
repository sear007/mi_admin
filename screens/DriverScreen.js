import React, { Component } from 'react';
import {View, Text,Linking,Image,ActivityIndicator,RefreshControl,Dimensions,TextInput,KeyboardAvoidingView} from 'react-native';
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import { BulletList } from 'react-content-loader/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Button,Input,Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Moment from 'moment';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-datepicker'
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
        index:0,


        pickDateDOB:false,
        pickDateExpireOn:false,

        uploadLoadingDriverPhoto: false,
        removeLoadingDriverPhoto: false,

        uploadLoadingIdentification: false,
        removeLoadingIdentification: false,

        uploadLoadingDriverLicense: false,
        removeLoadingDriverLicense: false,

        modalVisible:false,
        message: "",
        refreshing:false,

        editAction:false

    };
  }
  componentDidMount(){
    this.requestPostData();
  }
  onRefresh = () => { this.requestPostData().then(()=>this.setState({refreshing:false})); }
  modal = () => {
    return(
      <Modal animationType="slide" transparent={true} visible={this.state.modalVisible}>
        <View style={styles.modalWrapper}>
          <View><Text>{this.state.message}</Text></View>
          <View style={{justifyContent:"space-between"}}>
            <Button icon={<Icon type="font-awesome" color="#555" size={18} name="close" />} type="clear" containerStyle={styles.modalCloseBtn} onPress={() => this.setState({modalVisible:false})} />
          </View>
        </View>
      </Modal>
    )
  }
  pickImage = async (action) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      this.uploadImage(result,action)
    }
  }
  alertStatus = (response,message) => {
    if(response){
      this.setState({modalVisible:true,message:message });
      this.requestPostData();
    }else{
      this.setState({modalVisible:true,message:"Error Network" });
    }
  }
  uploadImage = async (result,name) => {
    const {route} = this.props; const {post_id} = route.params;
    var base_url = '';
    if(name==="driver_photo"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageDriverPhoto";
      this.setState({uploadLoadingDriverPhoto:true})
    };
    if(name==="indentification_photo"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageIdentification"; 
      this.setState({uploadLoadingIdentification:true})
    };
    if(name==="driver_license_photo"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageDriverLicense"; 
      this.setState({uploadLoadingDriverLicense:true})
    };
    let uploadData = new FormData();
    var old = '';
    if(name==='driver_photo'){var old = this.state.driver_photo;}
    if(name==='indentification_photo'){var old = this.state.indentification_photo;}
    if(name==='driver_license_photo'){var old = this.state.driver_license_photo;}
    uploadData.append('id',post_id)
    uploadData.append(name,{ uri: result.uri,type: 'image/jpeg',size: null,name: 'file_upload.jpg'})
    uploadData.append(`${name}_old`, old)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
      this.alertStatus(response.status,response.message);
      if(name==='driver_photo'){this.setState({uploadLoadingDriverPhoto:false})}
      if(name==='indentification_photo'){this.setState({uploadLoadingIdentification:false})}
      if(name==='driver_license_photo'){this.setState({uploadLoadingDriverLicense:false})}
    });
  }
  destroyImage = (name) => {
    const {route} = this.props;
    const {post_id} = route.params;
    var base_url = '';
    if(name==='driver_photo'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageDriverPhoto";
      this.setState({removeLoadingDriverPhoto:true});
    }
    if(name==='indentification_photo'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageIdentification";
      this.setState({removeLoadingIdentification:true});
    }
    if(name==='driver_license_photo'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageDriverLicense";
      this.setState({removeLoadingDriverLicense:true});
    }
    let uploadData = new FormData();
    uploadData.append('id',post_id)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
      this.alertStatus(response.status,response.message);
      if(name==='driver_photo'){this.setState({removeLoadingDriverPhoto:false})};
      if(name==='indentification_photo'){this.setState({removeLoadingIdentification:false})};
      if(name==='driver_license_photo'){this.setState({removeLoadingDriverLicense:false})};
    });
  }


  requestPostData = async () => {
    const {route} = this.props;
    const {post_id} = route.params;
    await fetch('https://equipment.mohapiphup.com/api/show/'+post_id)
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        postLoading:false,
        driver_name: responseJson.operator.name_driver?responseJson.operator.name_driver:null,
        tel_driver:responseJson.operator.tel_driver?responseJson.operator.tel_driver:null,
        position_driver:responseJson.operator.position_driver?responseJson.operator.position_driver:null,
        dob_driver:responseJson.operator.dob_driver?responseJson.operator.dob_driver:null,
        license_no_driver:responseJson.operator.license_no_driver?responseJson.operator.license_no_driver:null,
        license_issued_date:responseJson.operator.license_issued_date?responseJson.operator.license_issued_date:null,
        license_expiry_date:responseJson.operator.license_expiry_date?responseJson.operator.license_expiry_date:null,
        driver_photo:responseJson.operator.driver_photo?responseJson.operator.driver_photo:null,
        indentification_photo:responseJson.operator.indentification_photo?responseJson.operator.indentification_photo:null,
        driver_license_photo:responseJson.operator.driver_license_photo?responseJson.operator.driver_license_photo:null,
      });
    }).catch(error=>{
      console.log(error);
    })
  }

  removeLoading = () =>{
    return(
      <View style={styles.btnImage}>
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
          <Text style={{marginBottom:5}}>Removing</Text>
          <ActivityIndicator />
        </View>
      </View>
    )
  }
  uploadLoading = () =>{
    return(
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <Text style={{marginBottom:5}}>Uploading</Text>
        <ActivityIndicator />
      </View>
    )
  }
  blankBox =(name)=>{
    return(
      <View>
        <Icon name="plus" type="font-awesome" color="#999" size={30} />
        <Text style={{ color:"#999",marginTop:5 }}>{name}</Text>
      </View>
    )
  }
  btnAction = (action)=>{
    return(
    <>
      <Button onPress={()=> this.destroyImage(action) } buttonStyle={styles.btnCircleRemove} containerStyle={styles.btnRemove}   icon={<Icon type="font-awesome" size={15} name="trash" color="#000" />} />
      <Button onPress={()=> console.warn(action) } buttonStyle={styles.btnCircleEdit} containerStyle={styles.btnEdit}   icon={<Icon type="font-awesome" size={15} name="edit" color="#000" />} />
    </>
    )
  }

  List=(name,value)=>{
    return(
      <View style={styles.list}>
        <Text style={styles.Text}>
          <Text style={styles.TextMute}>{name}:</Text> {value}
        </Text>
      </View>
    )
  }
  Input=(label,name,value)=>{
    
    return(
      <View>
        <Text>{label}</Text>
        <TextInput
          style={styles.input}
          placeholder={label}
          value={value}
          onFocus={ () => this.setState({pickDateDOB:true}) }
        />
      </View>
    )
  }
  DatePicker=(label,name,value)=>{
      return(
        <View>
          <Text style={{ marginBottom:5 }}>{label}</Text>
            <DatePicker
              style={{width: "100%" }}
              customStyles={{ dateInput:{borderColor:"#888",height: 40,marginBottom:10, alignItems:"flex-start",padding:10  },dateText:{textAlign:'left',fontSize:17,color:"#000"}}}
              date={value && new Date(Moment(value.split('/').join('-')).format('Y-MM-DD'))}
              showIcon={false}
              mode="date" placeholder="Date Of Birth" format="DD/MMMM/YYYY" confirmBtnText="Confirm" cancelBtnText="Cancel"
              onDateChange={(date) => { 
                if(name==='dob_driver'){ this.setState({dob_driver:date}) }
                if(name==='license_expiry_date'){ this.setState({license_expiry_date:date}) }
              }}
            />
        </View>
      )
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
          <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }>

            <KeyboardAvoidingView>
            {this.modal()}
            <View style={{ position:"relative" }}>
            <SliderBox sliderBoxHeight={300} images={images.filter(function(url){ return url != null})} onCurrentImagePressed={(index)=> this.setState({visible:true,index})} dotColor="#FFEE58" inactiveDotColor="#90A4AE" autoplay circleLoop resizeMethod={'resize'} resizeMode={'cover'} imageLoadingColor="#2196F3" />
            <ImageView images={imagesView.filter(function(url){ return url != null})} imageIndex={this.state.index} visible={this.state.visible} onRequestClose={()=>this.setState({visible:false})}/>
            <View style={styles.container}>
                {this.state.editAction ? 
                <>
                  {this.Input('Name','',this.state.driver_name)}
                  {this.Input('Phone','',this.state.tel_driver)}
                  {this.Input('Positon','',this.state.position_driver)}
                  {this.DatePicker('DOB','dob_driver',this.state.dob_driver)}
                  {this.Input('License No','',this.state.license_no_driver)}
                  {this.DatePicker('Expire On','license_expiry_date',this.state.license_expiry_date)}
                </>
                :
                <>
                {this.List('Name',this.state.driver_name)}
                {this.List('Phone',this.state.tel_driver)}
                {this.List('Positon',this.state.position_driver)}
                {this.List('DOB',this.state.dob_driver)}
                {this.List('License No',this.state.license_no_driver)}
                {this.List('Expire On',this.state.license_expiry_date)}
                </>
                }
            </View>
            <Button onPress={ ()=> this.state.editAction ? this.setState({ editAction:false }): this.setState({ editAction:true }) } 
              title={this.state.editAction ? "Update":"Edit"} 
              containerStyle={{ marginHorizontal:40,marginVertical:20 }} 
            />
          
          <View style={{ flexDirection:"row", flexWrap:"wrap" }}>
              {/* Driver Photo */}
              {this.state.driver_photo ?
                !this.state.removeLoadingDriverPhoto ?
                <View style={styles.btnImage}>
                  {this.state.driver_photo&& <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.driver_photo}`}} />}
                  {this.btnAction('driver_photo')}
                </View>:this.removeLoading()
              :
              <TouchableOpacity onPress={ ()=> this.pickImage('driver_photo')} disabled={this.state.uploadLoadingDriverPhoto}>
                <View style={styles.btnImage}>
                {this.state.uploadLoadingDriverPhoto ? this.uploadLoading() : this.blankBox(`Driver`)}
                </View>
              </TouchableOpacity>}

            {/* Identification */}
            {this.state.indentification_photo ?
                !this.state.removeLoadingIdentification ?
                <View style={styles.btnImage}>
                  {this.state.indentification_photo&& <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.indentification_photo}`}} />}
                  {this.btnAction('indentification_photo')}
                </View>:this.removeLoading()
              :
              <TouchableOpacity onPress={ ()=> this.pickImage('indentification_photo')} disabled={this.state.uploadLoadingIdentification}>
                <View style={styles.btnImage}>
                {this.state.uploadLoadingIdentification ?  this.uploadLoading() : this.blankBox(`Identification`)}
                </View>
              </TouchableOpacity>}
            {/* Driver License */}
            {
              this.state.driver_license_photo ?
                !this.state.removeLoadingDriverLicense ?
                <View style={styles.btnImage}>
                  {this.state.driver_license_photo&& <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.driver_license_photo}`}} />}
                  {this.btnAction('driver_license_photo')}
                </View>:this.removeLoading()
              :
              <TouchableOpacity onPress={()=> this.pickImage('driver_license_photo')} disabled={this.state.uploadLoadingDriverLicense}>
                <View style={styles.btnImage}>
                {this.state.uploadLoadingDriverLicense ? this.uploadLoading() : this.blankBox(`License`)}
                </View>
              </TouchableOpacity>
            }
            </View>
            </View>
            </KeyboardAvoidingView>
        </ScrollView>
        );
    }
    
  }
}
export default DriverScreen;
const styles = require('./../styles')