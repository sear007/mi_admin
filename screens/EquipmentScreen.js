import React, { Component } from 'react';
import {View, Text,Linking,Image,ActivityIndicator,RefreshControl,Dimensions,TextInput,KeyboardAvoidingView,StyleSheet,Platform} from 'react-native';
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import { BulletList } from 'react-content-loader/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon,Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Moment from 'moment';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker'
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios";
class EquipmentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        postLoading:true,

        
        equipment_id:'',
        old_equipment_id:'',
        category:'',
        category_id:'',

        
        plate:'',

        
        marker	:'',
        brands:[],
        brand_id:'',

        model	:'',
        sub_categories:[],
        sub_category_id:'',

        
        insurance	:'',
        policy	:'',
        photos: [],

        payment        : '',
        year        : '',
        engine        : '',
        
        inspection_certificate:'',
        road_tax:'',
        road_tax_2:'',
        road_tax_sticker:'',

        visible:false,
        index:0,
        visibleInspection:false,
        indexInspection:0,

        uploadLoading: false,
        removeLoading: false,
        modalVisible:false,
        message: "",
        refreshing:false,

        editAction:false,
        updateEquipmentInformationLoading: false,


        language: 'haxe',

        categories:[],

    };
  }
  componentDidMount(){
    this.requestPostData();
    this.requestCategory();
    this.requestBrands();
    
  }
  requestCategory = async () =>{
    await fetch('https://equipment.mohapiphup.com/api/categories_app')
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        categories: responseJson,
      });
    }).catch(error=>{
      console.log(error);
    })
  }
  requestBrands = async () =>{
    await fetch('https://equipment.mohapiphup.com/api/brands')
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        brands: responseJson,
      });
    }).catch(error=>{
      console.log(error);
    })
  }

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


  pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      this.uploadImage(result);
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
 
  destroyImage = async (id) => {
    if(this.state.photos.length<=1){
      alert("There're only a picture. Add more picture first!");
      this.setState({removeLoading:false})
      return
    }
    let base_url = "https://equipment.mohapiphup.com/api/destroy_image";
    let uploadData = new FormData();
    uploadData.append('id', id)
    fetch(base_url,{
      method:"POST",
      body:uploadData,
      headers:{
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
    }).then(response=>response.json())
      .then(response => {
        if(response.status){
          this.setState({modalVisible:true,message:response.message });          
          this.requestPostData();
          this.setState({removeLoading:false})
        }else{
          this.setState({modalVisible:true,message:"Error Network" });
          this.setState({removeLoading:false})
        }
      });
  }

  uploadImage = async (result) =>{
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/upload_image";
    let uploadData = new FormData();
    this.setState({uploadLoading:true})
    uploadData.append("image", {
      uri: result.uri,
      type: 'image/jpeg',
      size: null,
      name: 'file_upload.jpg'
    });
    uploadData.append('id',post_id)
    fetch(base_url,{
      method:"POST",
      body:uploadData,
      headers:{
        Accept: "application/json",
        "Content-Type": "multipart/form-data"
      },
    }).then(response=>response.json())
      .then(response => {
        if(response.status){
          this.setState({  modalVisible:true,message:response.message });
          this.requestPostData();
          this.setState({uploadLoading:false});
        }else{
          this.setState({ modalVisible:true,message:"Error Network" });
          this.setState({uploadLoading:false});
        }
      });
  }

  onRefresh = () => { this.requestPostData().then(()=>this.setState({refreshing:false})); }


  updateEquipment = async () =>{
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/updateEquipment";
    this.setState({updateEquipmentformationLoading:true});
    await axios.post(base_url, {
      id: post_id,
      equipment_id: this.state.equipment_id&&this.state.equipment_id,
      plate: this.state.plate&&this.state.plate,
      category_id: this.state.category_id&&this.state.category_id,
      brand_id: this.state.category_id&&this.state.brand_id,
      sub_category_id: this.state.sub_category_id&&this.state.sub_category_id,
      payment: this.state.payment&&this.state.payment,
      year: this.state.year&&this.state.year,
      engine: this.state.engine&&this.state.engine,
    })
    .then((response) => {
      this.alertStatus(response.data.status,response.data.message);
      this.setState({updateDriverInformationLoading:false});
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
        equipment_id  :responseJson.equipment_id,
        old_equipment_id  :responseJson.old_equipment_id,
        category      :responseJson.category.name_en,
        category_id   :responseJson.category_id,
        plate         :responseJson.plate_number,

        marker	      :responseJson.brand&&responseJson.brand.name,
        brand_id      :responseJson.brand_id,

        

        model	        :responseJson.sub_category && responseJson.sub_category.name,
        sub_category_id   :responseJson.sub_category_id,


        photos        : responseJson.photos,
        payment        : responseJson.payment,
        year        : responseJson.year,
        engine        : responseJson.engine,
      });
    }).catch(error=>{
      console.log(error);
    })
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
    if( name === 'equipment_id' ){ var input = <TextInput editable={false} onChangeText={ (value) => this.setState({equipment_id:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'category' ){ var input = <TextInput onChangeText={ (value) => this.setState({category:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'plate' ){ var input = <TextInput onChangeText={ (value) => this.setState({plate:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'marker' ){ var input = <TextInput onChangeText={ (value) => this.setState({marker:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'model' ){ var input = <TextInput onChangeText={ (value) => this.setState({model:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'payment' ){ var input = <TextInput onChangeText={ (value) => this.setState({payment:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'year' ){ var input = <TextInput onChangeText={ (value) => this.setState({year:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'engine' ){ var input = <TextInput onChangeText={ (value) => this.setState({engine:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'policy' ){ var input = <TextInput onChangeText={ (value) => this.setState({policy:value})} style={styles.input} placeholder={label} value={value} /> }
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
                if(name==='insurance'){ this.setState({insurance:date}) }
              }}
              cancelBtnText="Clear"
              onClear={()=>{if(name==='insurance'){ this.setState({insurance:null}) }}}
            />
        </View>
      )
  }
  PickerSelect = (label,name,value) => {
    var Picker =
    <>
    <Text>{label}</Text>
    <RNPickerSelect placeholder={{label: `Choose Categories`,value: null}}
    onValueChange={(value) =>  this.setState({category_id:value}) }
    items={(this.state.categories.map(item=>({ label: item.name_en, value: item.id })))}
    style={{placeholder: {color: '#ccc',},inputIOS:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17},inputAndroid:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17,color:"#000"}}}
    />
    </>;
    if(name==='category_id'){
      var Picker = 
      <>
      <Text>Category</Text>
      <RNPickerSelect placeholder={{label: this.state.category,value:this.state.category_id}}
        items={(this.state.categories.map(item=>({ label: item.name_en, value: item.id })))}
        style={{placeholder: {color: '#ccc',},inputIOS:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17},inputAndroid:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17,color:"#000"}}}
        onValueChange={(value) =>  this.setState({category_id:value},()=>console.warn(this.state.category_id)) }
      />
      </>
    }
    if(name==='brand_id'){
      var Picker = 
      <>
      <Text>Marker</Text>
      <RNPickerSelect disabled={this.state.brands.length > 0 ? false:true} placeholder={{label:`Choose Brand`,value: null}}
        items={(this.state.brands.map(item=>({ label: item.name, value: item.id })))}
        style={{placeholder: {color: '#ccc',},inputIOS:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17},inputAndroid:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17,color:"#000"}}}
        onValueChange={(value) =>this.setState({brand_id:value},()=>console.warn(this.state.brand_id))}
      />
    </>
    }
    if(name==='sub_category_id'){
      var Picker = 
      <>
      <Text>Model</Text>
      <RNPickerSelect disabled={this.state.sub_categories.length > 0 ? false:true} placeholder={{label: `Choose Model`,value: null}}
      items={(this.state.sub_categories.map(item=>({ label: item.name, value: item.id })))}
      style={{placeholder: {color: '#ccc',},inputIOS:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17},inputAndroid:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17,color:"#000"}}}
      onValueChange={(value) =>  this.setState({sub_category_id:value})}
      />
      </>
    }
    if(name==='payment'){
      var Picker = 
      <>
      <Text>Payment</Text>
      <RNPickerSelect placeholder={{label:this.state.payment,value: this.state.payment}}
      items={[
        { label: 'Monthly', value: 'monthly' },
        { label: 'm3', value: 'm3' }
      ]}
      style={{placeholder: {color: '#ccc',},inputIOS:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17},inputAndroid:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17,color:"#000"}}}
      onValueChange={(value) =>  this.setState({payment:value}) }
      />
      </>
    }
    return Picker;
  }
  ImageFooter=(current_index,total_images)=>{ return(<View style={{ alignItems:"center",padding: 20, }}><Text style={{ color:"white" }}>{current_index+1}/{total_images}</Text></View>)}
  render() {
    const web = "https://equipment.mohapiphup.com/"
    const images = (
      this.state.photos.map(image=>(
        web+image.path
      ))
    );
    const imagesView = (
      this.state.photos.map(image=>(
        { uri: web+image.path}
      ))
    );
    if (this.state.postLoading) {
        return(
            <View><BulletList width="100%" /></View>
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
        <View>
          {this.modal()}
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
                FooterComponent={({ imageIndex })=> this.ImageFooter(imageIndex,images.filter(function(url){ return url != null}).length) }
                images={imagesView.filter(function(url){ return url != null})}
                imageIndex={this.state.index}
                visible={this.state.visible}
                onRequestClose={()=>this.setState({visible:false})}
            />

              <View style={styles.container}>
                {this.state.editAction ? 
                <>
                  {this.Input('ID','equipment_id',this.state.equipment_id)}
                  {this.Input('Plate','plate',this.state.plate)}
                  {this.PickerSelect(this.state.category,'category_id',this.state.category_id)}
                  {this.PickerSelect(this.state.marker&&this.state.marker,'brand_id',this.state.brand_id&&this.state.brand_id)}
                  {this.PickerSelect(this.state.model,'sub_category_id',this.state.sub_category_id)}
                  {this.PickerSelect(this.state.payment,'payment',this.state.payment)}
                  {this.Input('Year','year',this.state.year)}
                  {this.Input('Engine','engine',this.state.engine)}
                </>
                :
                <>
                {this.List('ID',this.state.equipment_id)}
                {this.List('Plate',this.state.plate)}
                {this.List('Category',this.state.category)}
                {this.List('Marker',this.state.marker)}
                {this.List('Model',this.state.model)}
                {this.List('Payment',this.state.payment)}
                {this.List('Year',this.state.year)}
                {this.List('Engine',this.state.engine)}
                </>
                }
            </View>

            <Button 
              onPress={ ()=> this.state.editAction ? this.setState({ editAction:false },()=>this.updateEquipment()): this.setState({ editAction:true })} 
              title={this.state.editAction ? "Update":"Edit"} 
              containerStyle={{ marginHorizontal:40,marginVertical:20}}
              loading={this.state.updateDriverInformationLoading}
              icon={
                <Icon type="font-awsome" name={this.state.editAction?"check":"edit"} color="#fff" style={{ marginRight:10 }} size={20} />
              }
            />

        </View>
          {this.state.removeLoading && 
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={{marginBottom:5}}>Please wait! Image is removing</Text>
            <ActivityIndicator />
          </View>}
        <View style={{ flexDirection:"row",flexWrap:'wrap'}}>
          {
            this.state.photos.map(image=>(
              <View style={styles.btnImage}>
                <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: web+image.thumbnail}} />
                <Button onPress={()=> this.setState({removeLoading:true},()=>this.destroyImage(image.id))} buttonStyle={styles.btnCircleRemove} containerStyle={styles.btnRemove}   icon={<Icon type="font-awesome" size={15} name="trash" color="#000" />} />
              </View>
            ))
          }
          <TouchableOpacity onPress={()=> this.pickImage()} disabled={this.state.uploadLoading}>
            <View style={styles.btnImage}>
            {this.state.uploadLoading ? 
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text style={{marginBottom:5}}>Uploading</Text>
                <ActivityIndicator />
              </View>:
              <View>
                <Icon name="plus" type="font-awesome" color="#999" size={30} />
                <Text style={{ color:"#999",marginTop:5 }}>More Picture</Text>
              </View>
              
            }
            </View>
          </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
        </ScrollView>

        );
    }
  }
}
export default EquipmentScreen;
const styles = require('./../styles');
