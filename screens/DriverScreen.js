import React, { Component } from 'react';
import { View, Text,StyleSheet,Linking,Image,ActivityIndicator,RefreshControl,Dimensions } from 'react-native';
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import { BulletList } from 'react-content-loader/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Button,Input,Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
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


        uploadLoadingDriverPhoto: false,
        removeLoadingDriverPhoto: false,

        uploadLoadingIdentification: false,
        removeLoadingIdentification: false,

        uploadLoadingDriverLicense: false,
        removeLoadingDriverLicense: false,

        modalVisible:false,
        message: "",
        refreshing:false

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
  pickImageDriverPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      this.uploadImageDriverPhoto(result);
    }
  }
  pickImageIdentification = async () =>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      this.uploadImageIdentification(result);
    }
  }
  pickImageDriverLicense = async () =>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      this.uploadImageDriverLicense(result);
    }
  }

  uploadImageIdentification = async (result) => {
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/uploadImageIdentification";
    let uploadData = new FormData();
    this.setState({uploadLoadingIdentification:true})
    uploadData.append('id',post_id)
    uploadData.append('indentification_photo',{ uri: result.uri,type: 'image/jpeg',size: null,name: 'file_upload.jpg'})
    uploadData.append('indentification_photo_old', this.state.indentification_photo?this.state.indentification_photo:null)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
        if(response.status){
          this.setState({modalVisible:true,message:response.message });
          this.requestPostData();
          this.setState({uploadLoadingIdentification:false});
        }else{
          this.setState({modalVisible:true,message:"Error Network" });
          this.setState({uploadLoadingIdentification:false});
        }
      });
  }
  destroyImageIdentification = () => {
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/destroyImageIdentification";
    this.setState({removeLoadingIdentification:true});
    let uploadData = new FormData();
    uploadData.append('id',post_id)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
        if(response.status){
          this.setState({modalVisible:true,message:response.message});
          this.requestPostData();
          this.setState({removeLoadingIdentification:false});
        }else{
          this.setState({modalVisible:true,message:"Error Network" });
          this.setState({removeLoadingIdentification:false});
        }
      });
  }
  
  

  
  uploadImageDriverPhoto = async (result) =>{
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/uploadImageDriverPhoto";
    let uploadData = new FormData();
    this.setState({uploadLoadingDriverPhoto:true})
    uploadData.append("image", { uri: result.uri,type: 'image/jpeg',size: null,name: 'file_upload.jpg'});
    uploadData.append('id',post_id)
    uploadData.append('driver_photo',{ uri: result.uri,type: 'image/jpeg',size: null,name: 'file_upload.jpg'})
    uploadData.append('driver_photo_old', this.state.driver_photo?this.state.driver_photo:null)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
        if(response.status){
          this.setState({modalVisible:true,message:response.message });
          this.requestPostData();
          this.setState({uploadLoadingDriverPhoto:false});
        }else{
          this.setState({modalVisible:true,message:"Error Network" });
          this.setState({uploadLoadingDriverPhoto:false});
        }
      });
  }
  

  destroyImageDriverPhoto = () => {
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/destroyImageDriverPhoto";
    this.setState({removeLoadingDriverPhoto:true});
    let uploadData = new FormData();
    uploadData.append('id',post_id)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
        if(response.status){
          this.setState({modalVisible:true,message:response.message});
          this.requestPostData();
          this.setState({removeLoadingDriverPhoto:false});
        }else{
          this.setState({modalVisible:true,message:"Error Network" });
          this.setState({removeLoadingDriverPhoto:false});
        }
      });
  }

  uploadImageDriverLicense = async (result) =>{
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/uploadImageDriverLicense";
    let uploadData = new FormData();
    this.setState({uploadLoadingDriverLicense:true})
    uploadData.append('id',post_id)
    uploadData.append('driver_license_photo', { uri: result.uri,type: 'image/jpeg',size: null,name: 'file_upload.jpg'})
    uploadData.append('driver_license_photo_old', this.state.driver_license_photo)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
        if(response.status){
          this.setState({modalVisible:true,message:response.message });
          this.requestPostData();
          this.setState({uploadLoadingDriverLicense:false});
        }else{
          this.setState({modalVisible:true,message:"Error Network" });
          this.setState({uploadLoadingDriverLicense:false});
        }
      });
  }
  destroyImageDriverLicense = async () =>{
    const {route} = this.props;
    const {post_id} = route.params;
    let base_url = "https://equipment.mohapiphup.com/api/destroyImageDriverLicense";
    this.setState({removeLoadingIdentification:true});
    let uploadData = new FormData();
    uploadData.append('id',post_id)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
        if(response.status){
          this.setState({modalVisible:true,message:response.message});
          this.requestPostData();
          this.setState({removeLoadingIdentification:false});
        }else{
          this.setState({modalVisible:true,message:"Error Network" });
          this.setState({removeLoadingIdentification:false});
        }
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
            {this.modal()}
            
            <View >

            <SliderBox sliderBoxHeight={300} images={images.filter(function(url){ return url != null})} onCurrentImagePressed={(index)=> this.setState({visible:true,index})} dotColor="#FFEE58" inactiveDotColor="#90A4AE" autoplay circleLoop
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


          
          <View style={{ flexDirection:"row", flexWrap:"wrap" }}>

            {/* Driver Photo */}
            {this.state.driver_photo ?
              !this.state.removeLoadingDriverPhoto ?
              <View style={styles.btnImage}>
                {this.state.driver_photo&& <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.driver_photo}`}} />}
                <Button onPress={()=> this.destroyImageDriverPhoto() } buttonStyle={styles.btnCircleRemove} containerStyle={styles.btnRemove}   icon={<Icon type="font-awesome" size={15} name="trash" color="#000" />} />
                <Button onPress={()=> console.warn('edit driver photo') } buttonStyle={styles.btnCircleEdit} containerStyle={styles.btnEdit}   icon={<Icon type="font-awesome" size={15} name="edit" color="#000" />} />
              </View>
              :
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text style={{marginBottom:5}}>Removing</Text>
                <ActivityIndicator />
              </View>
            :
            <TouchableOpacity onPress={ ()=> this.pickImageDriverPhoto()} disabled={this.state.uploadLoadingDriverPhoto}>
              <View style={styles.btnImage}>
              {this.state.uploadLoadingDriverPhoto ? 
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{marginBottom:5}}>Uploading</Text>
                  <ActivityIndicator />
                </View>
                :
                <View>
                  <Icon name="user-plus" type="font-awesome" color="#999" size={30} />
                  <Text style={{ color:"#999",marginTop:5 }}>Driver</Text>
                </View>
              }
              </View>
            </TouchableOpacity>}

          {/* Identification */}
          {this.state.indentification_photo ?
              !this.state.removeLoadingIdentification ?
              <View style={styles.btnImage}>
                {this.state.indentification_photo&& <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.indentification_photo}`}} />}
                <Button onPress={()=> this.destroyImageIdentification() } buttonStyle={styles.btnCircleRemove} containerStyle={styles.btnRemove}   icon={<Icon type="font-awesome" size={15} name="trash" color="#000" />} />
                <Button onPress={()=> console.warn('edit driver photo') } buttonStyle={styles.btnCircleEdit} containerStyle={styles.btnEdit}   icon={<Icon type="font-awesome" size={15} name="edit" color="#000" />} />
              </View>
              :
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text style={{marginBottom:5}}>Removing</Text>
                <ActivityIndicator />
              </View>
            :
            <TouchableOpacity onPress={ ()=> this.pickImageIdentification()} disabled={this.state.uploadLoadingIdentification}>
              <View style={styles.btnImage}>
              {this.state.uploadLoadingIdentification ? 
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{marginBottom:5}}>Uploading</Text>
                  <ActivityIndicator />
                </View>
                :
                <View>
                  <Icon name="user-plus" type="font-awesome" color="#999" size={30} />
                  <Text style={{ color:"#999",marginTop:5 }}>Identification</Text>
                </View>
              }
              </View>
            </TouchableOpacity>}

          {/* Driver License */}
          {
            this.state.driver_license_photo ?
              !this.state.removeLoadingDriverLicense ?
              <View style={styles.btnImage}>
                {this.state.driver_license_photo&& <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.driver_license_photo}`}} />}
                <Button onPress={()=> this.destroyImageDriverLicense() } buttonStyle={styles.btnCircleRemove} containerStyle={styles.btnRemove}   icon={<Icon type="font-awesome" size={15} name="trash" color="#000" />} />
                <Button onPress={()=> console.warn('edit driver license') } buttonStyle={styles.btnCircleEdit} containerStyle={styles.btnEdit}   icon={<Icon type="font-awesome" size={15} name="edit" color="#000" />} />
              </View>
              :
              <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                <Text style={{marginBottom:5}}>Removing</Text>
                <ActivityIndicator />
              </View>

            :
            <TouchableOpacity onPress={()=> this.pickImageDriverLicense()} disabled={this.state.uploadLoadingDriverLicense}>
              <View style={styles.btnImage}>
              {this.state.uploadLoadingDriverLicense ? 
                <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                  <Text style={{marginBottom:5}}>Uploading</Text>
                  <ActivityIndicator />
                </View>
                :
                <View>
                  <Icon name="plus" type="font-awesome" color="#999" size={30} />
                  <Text style={{ color:"#999",marginTop:5 }}>License</Text>
                </View>
              }
              </View>
            </TouchableOpacity>
          }


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
    btnCircleRemove:{
      width:35,
      height:35,
      backgroundColor:"#e5d2d2",
      borderRadius:35,
      borderColor:"#c85656",
      borderWidth:1,
    },
    btnCircleEdit:{
      width:35,
      height:35,
      backgroundColor:"#9fdaf4",
      borderRadius:35,
      borderColor:"#0398d8",
      borderWidth:1,
    },
    btnEdit:{
      position: 'absolute',
      right:-5,
      top:35,
    },
    
    btnRemove:{
      position: 'absolute',
      right:-5,
      top:-5,
    },
      btnImage:{
        position:'relative',
        width:Dimensions.get('window').width / 3-12,
        height:100,
        margin:5,
        backgroundColor:"#ccc",
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
        shadowColor: "#000",
        shadowOffset:{
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
      },
      headerBox:{
        flexDirection:"row",
        flexWrap:'wrap', 
        justifyContent:'space-between',
        alignItems:"center",
        padding: 10,
        backgroundColor:"#b2cbeb",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
        borderTopWidth:2,
        borderTopColor: "#00357a",
      },
      modalCloseBtn:{
          position:"absolute",
          right:-10,
          bottom:30,
          width:35,
          height:35,
          backgroundColor:"#ccc",
          borderRadius:30,
          alignItems:"center",
          justifyContent:"center",
          borderColor:"#999",
          borderWidth:.5
      },
      modalWrapper:{
        width:"100%",
        height: '10%',
        marginTop: 'auto',
        backgroundColor:'#ddd',
        borderRadius:15,
        padding:10,
        justifyContent:"center",
      }
});
