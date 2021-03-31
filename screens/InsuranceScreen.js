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
import DatePicker from 'react-native-datepicker'
import axios from "axios";
class DriverScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        postLoading:true,

        insurer:'',
        policy_no:'',
        period_of_cover_from:'',
        period_of_cover_to:'',
        insurance_photo:'',

        visible:false,
        index:0,


        pickDateDOB:false,
        pickDateExpireOn:false,

        uploadLoadingInsurancePhoto: false,
        removeLoadingInsurancePhoto: false,

        modalVisible:false,
        message: "",
        refreshing:false,

        editAction:false,
        updateInsuranceInformationLoading: false,
        categories: [],

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
    let uploadData = new FormData();
    var old = '';
    console.warn(name);
    if(name==="insurance_photo"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageInsurancePhoto";
      var old = this.state.insurance_photo;
      this.setState({uploadLoadingInsurancePhoto:true})
    };
    uploadData.append('id',post_id)
    uploadData.append(name,{ uri: result.uri,type: 'image/jpeg',size: null,name: 'file_upload.jpg'})
    uploadData.append(`${name}_old`, old)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
      this.alertStatus(response.status,response.message);
      if(name==='insurance_photo'){this.setState({uploadLoadingInsurancePhoto:false})}
    });
  }
  destroyImage = (name) => {
    const {route} = this.props;
    const {post_id} = route.params;
    var base_url = '';
    if(name==='insurance_photo'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageInsurancePhoto";
      this.setState({removeLoadingInsurancePhoto:true});
    }
    let uploadData = new FormData();
    uploadData.append('id',post_id)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
      this.alertStatus(response.status,response.message);
      if(name==='insurance_photo'){this.setState({removeLoadingInsurancePhoto:false})};
    });
  }

  updateInsuranceInformation = async () =>{
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/updateInsurance";
    this.setState({updateInsuranceInformationLoading:true});
    await axios.post(base_url, {
      id: post_id,
      insurer:this.state.insurer,
      policy_no:this.state.policy_no,
      period_of_cover_from:this.state.period_of_cover_from,
      period_of_cover_to:this.state.period_of_cover_to,
    })
    .then((response) => {
      this.alertStatus(response.data.status,response.data.message);
      this.setState({updateInsuranceInformationLoading:false});
      this.requestPostData();
    }, (error) => {
      console.log(error);
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
        insurer: responseJson.insurance && responseJson.insurance.insurer,
        policy_no: responseJson.insurance && responseJson.insurance.policy_no,
        period_of_cover_from:responseJson.insurance && responseJson.insurance.period_of_cover_from,
        period_of_cover_to:responseJson.insurance && responseJson.insurance.period_of_cover_to,
        insurance_photo:responseJson.insurance && responseJson.insurance.insurance_photo,
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
      <Button onPress={()=> this.pickImage(action) } buttonStyle={styles.btnCircleEdit} containerStyle={styles.btnEdit}   icon={<Icon type="font-awesome" size={15} name="edit" color="#000" />} />
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
    var input = <TextInput style={styles.input} placeholder={label} value={value} />;
    if( name === 'insurer' ){ var input = <TextInput onChangeText={ (value) => this.setState({insurer:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'policy_no' ){ var input = <TextInput onChangeText={ (value) => this.setState({policy_no:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'period_of_cover_from' ){ var input = <TextInput onChangeText={ (value) => this.setState({period_of_cover_from:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'period_of_cover_to' ){ var input = <TextInput onChangeText={ (value) => this.setState({period_of_cover_to:value})} style={styles.input} placeholder={label} value={value} /> }
    return(
      <View>
        <Text>{label}</Text>
        {input}
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
              date={value?new Date(Moment(value.split('/').join('-')).format('Y-MM-DD')):``}
              showIcon={false}
              mode="date" placeholder="Date Of Birth" format="DD/MMMM/YYYY" confirmBtnText="Confirm" cancelBtnText="Cancel"
              onDateChange={(date) => { 
                if(name==='period_of_cover_to'){ this.setState({period_of_cover_to:date}) }
                if(name==='period_of_cover_from'){ this.setState({period_of_cover_from:date}) }
              }}
              cancelBtnText="Clear"
              onClear={()=>{
                if(name==='period_of_cover_to'){ this.setState({period_of_cover_to:null}) }
                if(name==='period_of_cover_from'){ this.setState({period_of_cover_from:null}) }
              }}
            />
        </View>
      )
  }
  ImageFooter=(current_index,total_images)=>{ return(<View style={{ alignItems:"center",padding: 20, }}><Text style={{ color:"white" }}>{current_index+1}/{total_images}</Text></View>)}
  render() {
    const web = "https://equipment.mohapiphup.com/"
    const images = [
        this.state.insurance_photo && web+this.state.insurance_photo,
    ];
    const imagesView = [
        this.state.insurance_photo && { uri: web+this.state.insurance_photo},
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
            <ImageView FooterComponent={({ imageIndex })=> this.ImageFooter(imageIndex,images.filter(function(url){ return url != null}).length) }  images={imagesView.filter(function(url){ return url != null})} imageIndex={this.state.index} visible={this.state.visible} onRequestClose={()=>this.setState({visible:false})}/>
            <View style={styles.container}>
                {this.state.editAction ? 
                <>
                  {this.Input('Insurer','insurer',this.state.insurer)}
                  {this.Input('Policy no','policy_no',this.state.policy_no)}
                  {this.DatePicker('Period from','period_of_cover_from',this.state.period_of_cover_from)}
                  {this.DatePicker('Period To','period_of_cover_to',this.state.period_of_cover_to)}
                </>
                :
                <>
                {this.List('Insurer',this.state.insurer)}
                {this.List('Policy no',this.state.policy_no)}
                {this.List('Period from',this.state.period_of_cover_from)}
                {this.List('Period To',this.state.period_of_cover_to)}
                </>
                }
            </View>
            <Button 
              onPress={ ()=> this.state.editAction ? this.setState({ editAction:false },()=>this.updateInsuranceInformation()): this.setState({ editAction:true })} 
              title={this.state.editAction ? "Update":"Edit"} 
              containerStyle={{ marginHorizontal:40,marginVertical:20}}
              loading={this.state.updateInsuranceInformationLoading}
              icon={
                <Icon type="font-awsome" name={this.state.editAction?"check":"edit"} color="#fff" style={{ marginRight:10 }} size={20} />
              }
            />
          
          <View style={{ flexDirection:"row", flexWrap:"wrap" }}>
              {this.state.insurance_photo ?
                !this.state.removeLoadingInsurancePhoto ?
                <View style={styles.btnImage}>
                  {this.state.insurance_photo && 
                    !this.state.uploadLoadingInsurancePhoto ? 
                    <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.insurance_photo}`}} />
                    :this.uploadLoading()
                  }
                  {this.btnAction('insurance_photo')}
                </View>:this.removeLoading()
              :
              <TouchableOpacity onPress={ ()=> this.pickImage('insurance_photo') } disabled={this.state.uploadLoadingInsurancePhoto}>
                <View style={styles.btnImage}>
                  {this.state.uploadLoadingInsurancePhoto ? this.uploadLoading() : this.blankBox(`Insurance`)}
                </View>
              </TouchableOpacity>}
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