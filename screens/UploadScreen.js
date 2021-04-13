import React, { Component } from 'react';
import {View, Text,Linking,Image,ActivityIndicator,RefreshControl,Dimensions,TextInput,KeyboardAvoidingView,SafeAreaView,PermissionsAndroid,Platform} from 'react-native';
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import { BulletList } from 'react-content-loader/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Button,Input,Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select';
import Moment from 'moment';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker'
import axios from "axios";
class UploadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

        DriverScreen: true,
        name_driver: ``,
        tel_driver: ``,
        position_driver: ``,
        dob_driver: ``,
        license_no_driver: ``,
        license_issued_date: ``,
        license_expiry_date: ``,
        driver_photo:``,
        driver_photo_uri:``,
        indentification_photo:'',
        indentification_photo_uri:'',
        driver_license_photo:'',
        driver_license_photo_uri:'',


        
        EquipmentScreen: false,
        old_equipment_id:``,
        plate_number:``,
        categories:[],
        category:``,
        category_id:``,
        brands:[],
        brand:``,
        brand_id:``,
        sub_categories:[],
        sub_category_id:``,
        payment:'',
        year:'',
        engine:'',
        photoEquipment:[],
        photoEquipment_uri:[],



        InsuranceScreen: false,
        insurer: ``,
        policy_no: ``,
        period_of_cover_from:``,
        period_of_cover_to:``,
        insurance_photo:``,
        insurance_photo_uri:``,



        InspectionScreen: false,
        inspection_certificate:'',
        inspection_certificate_2:'',
        inspection_certificate_2_uri:'',
        inspection_certificate_uri:'',
        road_tax_sticker:'',
        road_tax_sticker_uri:'',
        road_tax:'',
        road_tax_uri:'',
        road_tax_2:'',
        road_tax_2_uri:'',
    };
  }
  componentDidMount(){
      this.requestCategory();
      this.requestBrands();
  }
  getCategoryName = async()=>{
    await fetch('http://127.0.0.1:8000/api/name_category/'+this.state.category_id)
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({category:responseJson});
    })
  }
  getBrandName = async()=>{
    await fetch('http://127.0.0.1:8000/api/name_brand/'+this.state.brand_id)
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({brand:responseJson});
      console.log(this.state.brand);
    })
  }
  PickerSelect = (label,name,value) => {
    if(name==='category_id'){
      var Picker = 
      <>
      <Text>Category</Text>
      <RNPickerSelect placeholder={{label: this.state.category ? this.state.category:'Choose Category',value:this.state.category_id}}
        items={(this.state.categories.map(item=>({ label: item.name_en, value: item.id })))}
        style={{placeholder: {color: '#ccc',},inputIOS:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17},inputAndroid:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17,color:"#000"}}}
        onValueChange={(value) => this.setState({category_id:value,sub_category_id:null},()=> this.requestSubCategory())}
      />
      </>
    }
    if(name==='brand_id'){
      var Picker = 
      <>
      <Text>Marker</Text>
      <RNPickerSelect disabled={this.state.brands.length > 0 ? false:true} placeholder={{label:this.state.brand ? this.state.brand:'Choose Marker',value: this.state.brand_id}}
        items={(this.state.brands.map(item=>({ label: item.name, value: item.id })))}
        style={{placeholder: {color: '#ccc',},inputIOS:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17},inputAndroid:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17,color:"#000"}}}
        onValueChange={(value) =>this.setState({brand_id:value},()=>this.getBrandName())}
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
      <RNPickerSelect placeholder={{label:`Choose Payment`,value: null}}
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

  requestSubCategory = async () =>{
    await fetch('https://equipment.mohapiphup.com/api/sub_category/'+this.state.category_id)
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        sub_categories: responseJson,
      },()=> this.getCategoryName());
    }).catch(error=>{
      console.log(error);
    })
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
  

  Submition = async(photos)=>{
    let base_url = "https://equipment.mohapiphup.com/api/storePost";
    this.setState({updateInsuranceInformationLoading:true});
    let formData = new FormData();
    this.state.photoEquipment.forEach((element,key) => {formData.append(`photoEquipment[${key}]`,{ uri: element.uri,type: 'image/jpeg',size: null,name: `file_upload-${key}.jpg`})});
    formData.append(`old_equipment_id`, this.state.old_equipment_id)
    formData.append(`plate_number`, this.state.plate_number)
    formData.append(`category_id`, this.state.category_id)
    // formData.append(`city_id`, this.state.city_id) 
    formData.append(`sub_category_id`, this.state.sub_category_id)
    formData.append(`brand_id`, this.state.brand_id)
    formData.append(`insurer`, this.state.insurer)
    formData.append(`policy_no`, this.state.policy_no)
    formData.append(`period_of_cover_from`, this.state.period_of_cover_from)
    formData.append(`period_of_cover_to`, this.state.period_of_cover_to)
    formData.append(`insurance_photo`, this.state.insurance_photo_uri && { uri: this.state.insurance_photo_uri,type: 'image/jpeg',size: null,name: `insurance.jpg`})
    formData.append(`driver_photo`, this.state.driver_photo_uri&&{ uri: this.state.driver_photo_uri,type: 'image/jpeg',size: null,name: `driver_photo.jpg`})
    formData.append(`name_driver`, this.state.name_driver)
    formData.append(`tel_driver`, this.state.tel_driver)
    formData.append(`position_driver`, this.state.position_driver)
    formData.append(`dob_driver`, this.state.dob_driver)
    formData.append(`license_no_driver`, this.state.license_no_driver)
    formData.append(`license_issued_date`, this.state.license_issued_date)
    formData.append(`license_expiry_date`, this.state.license_expiry_date)
    formData.append(`indentification_photo`, this.state.indentification_photo_uri && { uri: this.state.indentification_photo_uri,type: 'image/jpeg',size: null,name: `indentification.jpg`})
    formData.append(`driver_license_photo`, this.state.driver_license_photo_uri && { uri: this.state.driver_license_photo_uri,type: 'image/jpeg',size: null,name: `driver_license.jpg`})
    formData.append(`inspection_certificate`, this.state.inspection_certificate &&{ uri: this.state.inspection_certificate_uri,type: 'image/jpeg',size: null,name: `inspection_certificate.jpg`})
    formData.append(`inspection_certificate_2`, this.state.inspection_certificate_2&&{ uri: this.state.inspection_certificate_2_uri,type: 'image/jpeg',size: null,name: `inspection_certificate_2.jpg`})
    formData.append(`road_tax`, this.state.road_tax&&{ uri: this.state.road_tax_uri,type: 'image/jpeg',size: null,name: `inspection_certificate_2.jpg`})
    formData.append(`road_tax_2`, this.state.road_tax_2&&{ uri: this.state.road_tax_2_uri,type: 'image/jpeg',size: null,name: `inspection_certificate_2.jpg`})
    formData.append(`road_tax_sticker`, this.state.road_tax_sticker&&{ uri: this.state.road_tax_sticker_uri,type: 'image/jpeg',size: null,name: `inspection_certificate_2.jpg`})
    formData.append(`payment`, 'monthly')
    await axios.post(base_url, formData,{
      headers: {
        Accept: "application/json",
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      console.log(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  InspectionScreen=()=>{
    return(
      <View style={{ flexDirection:"row", flexWrap:"wrap"}}>
            {/* Inspection I Photo */}
            {this.state.inspection_certificate ?
                !this.state.removeLoadingInspection ?
                <View style={styles.btnImage}>
                  {this.state.inspection_certificate && 
                    !this.state.uploadLoadingInspection ?
                    <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `${this.state.inspection_certificate_uri}`}} />
                    : this.uploadLoading()
                  }
                  {this.btnAction('inspection_certificate')}
                </View>:this.removeLoading()
              :
              <TouchableOpacity onPress={ ()=> this.pickImage('inspection_certificate')} disabled={this.state.uploadLoadingInspection}>
                <View style={styles.btnImage}>{this.state.uploadLoadingInspection ? this.uploadLoading() : this.blankBox(`ឆៀកឡាន ១`)}</View>
              </TouchableOpacity>}

              {this.state.inspection_certificate_2 ?
                !this.state.removeLoadingInspection2 ?
                <View style={styles.btnImage}>
                  {this.state.inspection_certificate_2 && 
                  !this.state.uploadLoadingInspection2?
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `${this.state.inspection_certificate_2_uri}`}} />
                  :this.uploadLoading() 
                  }
                  {this.btnAction('inspection_certificate_2')}
                </View>:this.removeLoading()
              :
              <TouchableOpacity onPress={ ()=> this.pickImage('inspection_certificate_2')} disabled={this.state.uploadLoadingInspection2}>
                <View style={styles.btnImage}>{this.state.uploadLoadingInspection2 ? this.uploadLoading() : this.blankBox(`ឈៀកឡាន ២`)}</View>
              </TouchableOpacity>}


            {/* Sticker */}
            {this.state.road_tax_sticker ?
                !this.state.removeLoadingSticker ?
                <View style={styles.btnImage}>
                  {this.state.road_tax_sticker && 
                  !this.state.uploadLoadingSticker?
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `${this.state.road_tax_sticker_uri}`}} />
                  :this.uploadLoading() 
                  }
                  {this.btnAction(`road_tax_sticker`)}
                </View>:this.removeLoading()
              :
              <TouchableOpacity onPress={ ()=> this.pickImage('road_tax_sticker')} disabled={this.state.uploadLoadingSticker}>
                  <View style={styles.btnImage}>{this.state.uploadLoadingSticker ? this.uploadLoading() : this.blankBox(`ពន្ធឡាន`)}</View>
              </TouchableOpacity>}


                {/* Road Tax */}
                {this.state.road_tax ?
                !this.state.removeLoadingRoadTax ?
                <View style={styles.btnImage}>
                  {this.state.road_tax && 
                  !this.state.uploadLoadingRoadTax?
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `${this.state.road_tax_uri}`}} />
                  :this.uploadLoading()
                  }
                  {this.btnAction(`road_tax`)}
                </View>:this.removeLoading()
              :
              <TouchableOpacity onPress={ ()=> this.pickImage('road_tax')} disabled={this.state.uploadLoadingRoadTax}>
                <View style={styles.btnImage}>{this.state.uploadLoadingRoadTax ? this.uploadLoading() : this.blankBox(`កាតគ្រីឡាន ១`)}</View>
              </TouchableOpacity>}

            {/* Road Tax 2 */}
            {this.state.road_tax_2 ?
                !this.state.removeLoadingRoadTax2 ?
                <View style={styles.btnImage}>
                  {this.state.road_tax_2 && 
                  !this.state.uploadLoadingRoadTax2 ? 
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `${this.state.road_tax_2_uri}`}} />
                  :this.uploadLoading()
                  }
                  {this.btnAction(`road_tax_2`)}
                </View> : this.removeLoading()
              :
              <TouchableOpacity onPress={ () => this.pickImage('road_tax_2')} disabled={this.state.uploadLoadingRoadTax2}>
                  <View style={styles.btnImage}>{this.state.uploadLoadingRoadTax2 ? this.uploadLoading(): this.blankBox(`កាតគ្រីឡាន ២`)}</View>
              </TouchableOpacity>}

          </View>
    )
  }

  InsuranceScreen=()=>{
    return(<>
      <View style={{ padding:10 }}>
        {this.Input('Insurer','insurer',this.state.insurer)}
        {this.Input('Policy no','policy_no',this.state.policy_no)}
        {this.DatePicker('Period from','period_of_cover_from',this.state.period_of_cover_from)}
        {this.DatePicker('Period To','period_of_cover_to',this.state.period_of_cover_to)}
      </View>
      <View style={{ flexDirection:"row", flexWrap:"wrap" }}>
            {this.state.insurance_photo ?
              !this.state.removeLoadingInsurancePhoto ?
              <View style={styles.btnImage}>
                {this.state.insurance_photo && 
                  !this.state.uploadLoadingInsurancePhoto ? 
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `${this.state.insurance_photo_uri}`}} />
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
    </>)
  }
  EquipmentScreen=()=>{
     return(
        <>
          <View style={{ padding:10 }}>
            {this.Input('ID','old_equipment_id',this.state.old_equipment_id)}
            {this.Input('Plate','plate_number',this.state.plate_number)}
            {this.PickerSelect(this.state.category,'category_id',this.state.category_id)}
            {this.PickerSelect(this.state.marker&&this.state.marker,'brand_id',this.state.brand_id&&this.state.brand_id)}
            {this.PickerSelect(this.state.model,'sub_category_id',this.state.sub_category_id)}
            {this.PickerSelect(this.state.payment,'payment',this.state.payment)}
            {this.Input('Year','year',this.state.year)}
            {this.Input('Engine','engine',this.state.engine)}
          </View>

          <View style={{ flexDirection:"row",flexWrap:'wrap'}}>
          {
            this.state.photoEquipment_uri.map((image,key)=>(
              <View style={styles.btnImage}>
                <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: image}} />
                <Button onPress={()=> this.destroyImageEquipment(key)} buttonStyle={styles.btnCircleRemove} containerStyle={styles.btnRemove}   icon={<Icon type="font-awesome" size={15} name="trash" color="#000" />} />
              </View>
            ))
          }
          <TouchableOpacity onPress={()=> this.pickImage('equipment')} disabled={this.state.uploadLoading}>
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
        </>


     )
  }
  

  DriverScreen =()=>{
    return(
        <>
            
            <View style={{ padding: 10 }}>
                {this.Input('Name','name_driver',this.state.name_driver)}
                {this.Input('Phone','tel_driver',this.state.tel_driver)}
                {this.Input('Positon','position_driver',this.state.position_driver)}
                {this.DatePicker('DOB','dob_driver',this.state.dob_driver?this.state.dob_driver:``)}
                {this.Input('License No','license_no_driver',this.state.license_no_driver)}
                {this.DatePicker('Issued On','license_issued_date',this.state.license_issued_date?this.state.license_issued_date:``)}
                {this.DatePicker('Expire On','license_expiry_date',this.state.license_expiry_date?this.state.license_expiry_date:``)}
            </View>


            <View style={{ flexDirection:"row", flexWrap:"wrap" }}>
                 {/* Driver Photo */}
                {this.state.driver_photo ?
                    !this.state.removeLoadingDriverPhoto ?
                    <View style={styles.btnImage}>
                    {this.state.driver_photo && 
                    !this.state.uploadLoadingDriverPhoto?
                    <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: this.state.driver_photo_uri}} />
                    :this.uploadLoading()
                    }
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
                  {this.state.indentification_photo&& 
                  !this.state.uploadLoadingIdentification?
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `${this.state.indentification_photo_uri}`}} />
                  :this.uploadLoading()
                  }
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
                  {this.state.driver_license_photo&& 
                  !this.state.uploadLoadingDriverLicense ?
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `${this.state.driver_license_photo_uri}`}} />
                  :this.uploadLoading()
                  }
                  
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

        </>
    )

  }

  pickImageMultiples = async (action) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection:true
    });
    if (!result.cancelled) {
        console.log(result);
    }
  }
  pickImage = async (action) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
        if(action === 'driver_photo'){this.setState({driver_photo:result,driver_photo_uri:result.uri})}
        if(action === 'indentification_photo'){this.setState({indentification_photo:result,indentification_photo_uri:result.uri})}
        if(action === 'driver_license_photo'){this.setState({driver_license_photo:result,driver_license_photo_uri:result.uri})}
        if(action==='equipment'){
          this.setState({
            photoEquipment: [...this.state.photoEquipment,result],
            photoEquipment_uri:[...this.state.photoEquipment_uri,result.uri]
          });
        }
        if(action==='insurance_photo'){this.setState({insurance_photo: result,insurance_photo_uri:result.uri})}
        if(action==='inspection_certificate'){this.setState({inspection_certificate: result,inspection_certificate_uri:result.uri})}
        if(action==='inspection_certificate_2'){this.setState({inspection_certificate_2: result,inspection_certificate_2_uri:result.uri})}
        if(action==='road_tax_sticker'){this.setState({road_tax_sticker: result,road_tax_sticker_uri:result.uri})}
        if(action==='road_tax'){this.setState({road_tax: result,road_tax_uri:result.uri})}
        if(action==='road_tax_2'){this.setState({road_tax_2: result,road_tax_2_uri:result.uri})}
    }
  }
  destroyImage = (name) => {
    if(name==='driver_photo'){this.setState({driver_photo:null,driver_photo_url:null});}
    if(name==='indentification_photo'){this.setState({indentification_photo:null,indentification_photo_uri:null});}
    if(name==='driver_license_photo'){this.setState({driver_license_photo:null,driver_license_photo_uri:null});}
    if(name==='insurance_photo'){this.setState({insurance_photo:null,insurance_photo_uri:null},()=>console.log(this.state.insurance_photo));}
    if(name==='inspection_certificate'){this.setState({inspection_certificate:null,inspection_certificate_uri:null})}
    if(name==='inspection_certificate_2'){this.setState({inspection_certificate_2:null,inspection_certificate_2_uri:null})}
    if(name==='road_tax_sticker'){this.setState({road_tax_sticker:null,road_tax_sticker_uri:null})}
    if(name==='road_tax'){this.setState({road_tax:null,road_tax_uri:null})}
    if(name==='road_tax_2'){this.setState({road_tax_2:null,road_tax_2_uri:null})}
  }
  destroyImageEquipment=(key)=>{
    console.log(this.state.photoEquipment_uri.filter( (v,i)=>{return i !== key }));
    this.setState({
      photoEquipment_uri: this.state.photoEquipment_uri.filter( (v,i)=>{return i !== key }),
      photoEquipment: this.state.photoEquipment.filter( (v,i)=>{return i !== key }),
    });
  }

  Input=(label,name,value)=>{
    var input = <TextInput style={styles.input} placeholder={label} value={value} />;
    // Driver
    if( name === 'name_driver' ){ var input = <TextInput onChangeText={ (value) => this.setState({name_driver:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'position_driver' ){ var input = <TextInput onChangeText={ (value) => this.setState({position_driver:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'dob_driver' ){ var input = <TextInput onChangeText={ (value) => this.setState({dob_driver:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'tel_driver' ){ var input = <TextInput onChangeText={ (value) => this.setState({tel_driver:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'license_no_driver' ){ var input = <TextInput onChangeText={ (value) => this.setState({license_no_driver:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'license_issued_date' ){ var input = <TextInput onChangeText={ (value) => this.setState({license_issued_date:value})} style={styles.input} placeholder={label} value={value} /> }
    if( name === 'license_expiry_date' ){ var input = <TextInput onChangeText={ (value) => this.setState({license_expiry_date:value})} style={styles.input} placeholder={label} value={value} /> }
   // Driver

   //Equipment
   if( name === 'old_equipment_id' ){ var input = <TextInput onChangeText={ (value) => this.setState({old_equipment_id:value})} style={styles.input} placeholder={label} value={value} /> }
   if( name === 'category' ){ var input = <TextInput onChangeText={ (value) => this.setState({category:value})} style={styles.input} placeholder={label} value={value} /> }
   if( name === 'plate_number' ){ var input = <TextInput onChangeText={ (value) => this.setState({plate_number:value})} style={styles.input} placeholder={label} value={value} /> }
   if( name === 'marker' ){ var input = <TextInput onChangeText={ (value) => this.setState({marker:value})} style={styles.input} placeholder={label} value={value} /> }
   if( name === 'model' ){ var input = <TextInput onChangeText={ (value) => this.setState({model:value})} style={styles.input} placeholder={label} value={value} /> }
   if( name === 'payment' ){ var input = <TextInput onChangeText={ (value) => this.setState({payment:value})} style={styles.input} placeholder={label} value={value} /> }
   if( name === 'year' ){ var input = <TextInput onChangeText={ (value) => this.setState({year:value})} style={styles.input} placeholder={label} value={value} /> }
   if( name === 'engine' ){ var input = <TextInput onChangeText={ (value) => this.setState({engine:value})} style={styles.input} placeholder={label} value={value} /> }
   if( name === 'policy' ){ var input = <TextInput onChangeText={ (value) => this.setState({policy:value})} style={styles.input} placeholder={label} value={value} /> }
   //Equipment


   //Insurance
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
              mode="date" placeholder={label} format="DD/MMMM/YYYY" confirmBtnText="Confirm" cancelBtnText="Cancel"
              onDateChange={(date) => { 
                
                // Driver
                if(name==='dob_driver'){ this.setState({dob_driver:date}) }
                if(name==='license_issued_date'){ this.setState({license_issued_date:date}) }
                if(name==='license_expiry_date'){ this.setState({license_expiry_date:date}) }
                // Driver

                //Insurance
                if(name==='period_of_cover_to'){ this.setState({period_of_cover_to:date}) }
                if(name==='period_of_cover_from'){ this.setState({period_of_cover_from:date}) }
                //Insurance

              }}
              cancelBtnText="Clear"
              onClear={()=>{

                // Driver
                if(name==='dob_driver'){ this.setState({dob_driver:null}) }
                if(name==='license_issued_date'){ this.setState({license_issued_date:null}) }
                if(name==='license_expiry_date'){ this.setState({license_expiry_date:null}) }
                // Driver

                //Insurance
                if(name==='period_of_cover_to'){ this.setState({period_of_cover_to:null}) }
                if(name==='period_of_cover_from'){ this.setState({period_of_cover_from:null}) }
                //Insurance

              }}
            />
        </View>
      )
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

  render() {
    return (
      <SafeAreaView >

        <ScrollView>
          <KeyboardAvoidingView>
          <View>

            <View>
                {this.state.DriverScreen && this.DriverScreen()}
                {this.state.EquipmentScreen && this.EquipmentScreen()}
                {this.state.InsuranceScreen && this.InsuranceScreen()}
                {this.state.InspectionScreen && this.InspectionScreen()}
            </View>


            {this.state.DriverScreen && 
            <View style={{ justifyContent:"flex-end",flexDirection:"row",marginVertical:10,padding: 10, }}>
                <Button iconRight icon={<Icon style={{marginLeft:5}}  type="font-awesome" name="check-circle" size={18} />} title="Driver Ready"
                    onPress={()=> this.setState({DriverScreen: false,EquipmentScreen: true,})} />
            </View>}

            {this.state.EquipmentScreen&&
            <View style={{ justifyContent:"space-between",flexDirection:"row",marginVertical:10,padding: 10,  }}>
                <Button type="clear" icon={<Icon style={{marginRight:5}} type="font-awesome" name="reply" size={18} />} title="Return"
                    onPress={()=> this.setState({DriverScreen: true,EquipmentScreen: false,})}  />
                    <Button iconRight icon={<Icon style={{marginLeft:5}}  type="font-awesome" name="check-circle" size={18} />} title="Equipment Ready"
                    onPress={()=> this.setState({EquipmentScreen: false,InsuranceScreen: true,})} />
            </View>}


            {this.state.InsuranceScreen&&
            <View style={{ justifyContent:"space-between",flexDirection:"row",marginVertical:10,padding: 10,  }}>
                <Button type="clear" icon={<Icon style={{marginRight:5}} type="font-awesome" name="reply" size={18} />} title="Return"
                    onPress={()=> this.setState({EquipmentScreen: true,InsuranceScreen: false,})}  />
                <Button iconRight icon={<Icon style={{marginLeft:5}}  type="font-awesome" name="check-circle" size={18} />} title="Insurance Ready"
                    onPress={()=> this.setState({InsuranceScreen: false,InspectionScreen: true,})} />
            </View>}

            {this.state.InspectionScreen&&
            <View style={{ justifyContent:"space-between",flexDirection:"row",marginVertical:10,padding: 10,  }}>
                <Button type="clear" icon={<Icon style={{marginRight:5}} type="font-awesome" name="reply" size={18} />} title="Return"
                    onPress={()=> this.setState({InsuranceScreen: true,InspectionScreen: false,})}  />
                <Button iconRight icon={<Icon style={{marginLeft:5}}  type="font-awesome" name="check-circle" size={18} />} title="Submit"
                    onPress={()=> this.Submition()} />
            </View>}
            </View>
            </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default UploadScreen;
const styles = require('./../styles')
