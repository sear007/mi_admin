import React, { Component } from 'react';
import { View, Text,StyleSheet,Linking,Image,ActivityIndicator,RefreshControl,Dimensions } from 'react-native';
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import { BulletList } from 'react-content-loader/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon,Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';

class EquipmentScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        postLoading:true,
        equipment_id:'',
        old_equipment_id:'',
        category:'',
        plate:'',
        marker	:'',
        model	:'',
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
        refreshing:false

    };
  }
  componentDidMount(){
    this.requestPostData();
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

  destroyImage = async (id) => {
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
        plate         :responseJson.plate_number,
        marker	      :responseJson.sub_category&&responseJson.sub_category.name,
        model	        :responseJson.category &&responseJson.category.name_en,
        insurance	    :responseJson.insurance.period_of_cover_to,
        policy	      :responseJson.insurance.policy_no,
        photos        : responseJson.photos,
        payment        : responseJson.payment,
        year        : responseJson.year,
        engine        : responseJson.engine,

      });
    }).catch(error=>{
      console.log(error);
    })
  }
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
                images={imagesView.filter(function(url){ return url != null})}
                imageIndex={this.state.index}
                visible={this.state.visible}
                onRequestClose={()=>this.setState({visible:false})}
            />
          <View style={styles.container}>  
              {this.state.equipment_id&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>ID:</Text>{this.state.old_equipment_id}</Text></View>}
              {this.state.equipment_id&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}></Text>{this.state.equipment_id} </Text></View>}
              {this.state.category&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Category:</Text> {this.state.category}</Text></View>}
              {this.state.plate&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Plate:</Text> {this.state.plate}</Text></View>}
              {this.state.marker&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Marker:</Text> {this.state.marker}</Text></View>}
              {this.state.model&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Model:</Text> {this.state.model}</Text></View>}
              {this.state.payment&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Payment:</Text> {this.state.payment}</Text></View>}
              {this.state.year&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Year:</Text> {this.state.year}</Text></View>}
              {this.state.engine&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Engine:</Text> {this.state.engine}</Text></View>}
              {this.state.insurance&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Insurance:</Text> {this.state.insurance}</Text></View>}
              {this.state.policy&&<View style={styles.list}><Text style={styles.Text}><Text style={styles.TextMute}>Policy:</Text> {this.state.policy}</Text></View>}
          </View>

        </View>


        

          {this.state.removeLoading && 
          <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text style={{marginBottom:5}}>Please wait! Image is removing</Text>
            <ActivityIndicator />
          </View>}
        <View style={{ flexDirection:"row",justifyContent:"space-between",flexWrap:'wrap',padding: 15, }}>
          {
            this.state.photos.map(image=>(
              <View style={styles.btnImage}>
                <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-23,height:100 }} source={{ uri: web+image.thumbnail}} />
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
        </ScrollView>

        );
    }
  }
}
export default EquipmentScreen;

const styles = StyleSheet.create({
  btnCircleRemove:{
    width:35,
    height:35,
    backgroundColor:"#e5d2d2",
    borderRadius:35,
    borderColor:"#c85656",
    borderWidth:1,
  },
  btnRemove:{
    position: 'absolute',
    right:-5,
    top:-5,
  },
    btnImage:{
      position:'relative',
      width:Dimensions.get('window').width / 3-23,
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
