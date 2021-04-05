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

        DriverScreen: false,
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
        driver_license_photo:'',




        
        EquipmentScreen: true,
        old_equipment_id:``,
        plate_number:``,
        categories:[],
        category_id:``,
        brands:[],
        brand_id:``,
        sub_categories:[],
        sub_category_id:``,
        payment:'',
        year:'',
        engine:'',
        photoEquipment:[],



        InsuranceScreen: false,
        InspectionScreen: false,






    };
  }
  componentDidMount(){
      this.requestCategory();
      this.requestBrands();
  }

  requestSubCategory = async () =>{
    await fetch('https://equipment.mohapiphup.com/api/sub_category/'+this.state.category_id)
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        sub_categories: responseJson,
      });
      console.log(this.state.sub_categories);
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
  EquipmentScreen=()=>{
     return(
         
        <View style={{ padding:10 }}>
            <View style={{ marginVertical:20 }}>
                <Text>{this.state.old_equipment_id}</Text>
                <Text>{this.state.plate_number}</Text>
                <Text>{this.state.category_id}</Text>
                <Text>{this.state.brand_id}</Text>
                <Text>{this.state.sub_category_id}</Text>
                <Text>{this.state.payment}</Text>
                <Text>{this.state.year}</Text>
                <Text>{this.state.engine}</Text>
                <Text>{this.state.photoEquipment.toString()}</Text>
            </View>
            {this.Input('ID','old_equipment_id',this.state.old_equipment_id)}
            {this.Input('Plate','plate_number',this.state.plate_number)}
            {this.PickerSelect(this.state.category,'category_id',this.state.category_id)}
            {this.PickerSelect(this.state.marker&&this.state.marker,'brand_id',this.state.brand_id&&this.state.brand_id)}
            {this.PickerSelect(this.state.model,'sub_category_id',this.state.sub_category_id)}
            {this.PickerSelect(this.state.payment,'payment',this.state.payment)}
            {this.Input('Year','year',this.state.year)}
            {this.Input('Engine','engine',this.state.engine)}
        </View>
     )
  }
  PickerSelect = (label,name,value) => {
    if(name==='category_id'){
      var Picker = 
      <>
      <Text>Category</Text>
      <RNPickerSelect placeholder={{label: `Choose Category`,value:null}}
        items={(this.state.categories.map(item=>({ label: item.name_en, value: item.id })))}
        style={{placeholder: {color: '#ccc',},inputIOS:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17},inputAndroid:{height: 40,marginBottom:10,borderWidth: 1,borderColor:"#888",padding: 10,fontSize:17,color:"#000"}}}
        onValueChange={(value) =>  this.setState({category_id:value,sub_category_id:null,},()=>this.requestSubCategory())}
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
        onValueChange={(value) =>this.setState({brand_id:value})}
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
    }
  }
  destroyImage = (name) => {
    if(name==='driver_photo'){this.setState({driver_photo:null,driver_photo_url:null});}
    if(name==='indentification_photo'){this.setState({indentification_photo:null,indentification_photo_uri:null});}
    if(name==='driver_license_photo'){this.setState({driver_license_photo:null,driver_license_photo_uri:null});}
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
                
                // Driver
                if(name==='dob_driver'){ this.setState({dob_driver:date}) }
                if(name==='license_issued_date'){ this.setState({license_issued_date:date}) }
                if(name==='license_expiry_date'){ this.setState({license_expiry_date:date}) }
                // Driver

              }}
              cancelBtnText="Clear"
              onClear={()=>{

                // Driver
                if(name==='dob_driver'){ this.setState({dob_driver:null}) }
                if(name==='license_issued_date'){ this.setState({license_issued_date:null}) }
                if(name==='license_expiry_date'){ this.setState({license_expiry_date:null}) }
                // Driver

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

        <View>

        <View>
            {this.state.DriverScreen && this.DriverScreen()}
            {this.state.EquipmentScreen && this.EquipmentScreen()}
            {this.state.InsuranceScreen && <Text>Insurance Screen</Text>}
            {this.state.InspectionScreen && <Text>Inspection Screen</Text>}
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
                onPress={()=> console.log("Submit")} />
        </View>}
        </View>

      </SafeAreaView>
    );
  }
}

export default UploadScreen;
const styles = require('./../styles')
