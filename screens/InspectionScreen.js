import React, { Component } from 'react';
import { View, Text,StyleSheet,Linking,Image,ActivityIndicator,RefreshControl,Dimensions } from 'react-native';
import ImageView from "react-native-image-viewing";
import { SliderBox } from "react-native-image-slider-box";
import { BulletList } from 'react-content-loader/native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Icon,Button } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';

class InspectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        postLoading:true,

        inspection_certificate:'',
        uploadLoadingInspection: false,
        removeLoadingInspection: false,

        inspection_certificate_2:'',
        uploadLoadingInspection2: false,
        removeLoadingInspection2: false,


        road_tax_sticker:'',
        uploadLoadingSticker: false,
        removeLoadingSticker: false,

        road_tax:'',
        uploadLoadingRoadTax: false,
        removeLoadingRoadTax: false,

        road_tax_2:'',
        uploadLoadingRoadTax2: false,
        removeLoadingRoadTax2: false,

        visible:false,
        index:0,
        visibleInspection:false,
        indexInspection:0,

        modalVisible:false,
        message: "",
        refreshing:false

    };
  }
  componentDidMount(){
    this.requestPostData();
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
    if(name==="inspection_certificate"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageInspection";
      this.setState({uploadLoadingInspection:true})
    };
    if(name==="inspection_certificate_2"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageInspection2"; 
      this.setState({uploadLoadingInspection2:true})
    };
    if(name==="road_tax_sticker"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageSticker"; 
      this.setState({uploadLoadingSticker:true})
    };
    if(name==="road_tax"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageRoadTax"; 
      this.setState({uploadLoadingRoadTax:true})
    };
    if(name==="road_tax_2"){ 
      var base_url = "https://equipment.mohapiphup.com/api/uploadImageRoadTax2"; 
      this.setState({uploadLoadingRoadTax2:true})
    };
    let uploadData = new FormData();
    var old = '';
    if(name==='inspection_certificate'){var old = this.state.inspection_certificate;}
    if(name==='inspection_certificate_2'){var old = this.state.inspection_certificate_2;}
    if(name==='road_tax_sticker'){var old = this.state.road_tax_sticker;}
    if(name==='road_tax'){var old = this.state.road_tax;}
    if(name==='road_tax_2'){var old = this.state.road_tax_2;}
    uploadData.append('id',post_id)
    uploadData.append(name,{ uri: result.uri,type: 'image/jpeg',size: null,name: 'file_upload.jpg'})
    uploadData.append(`${name}_old`, old)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
      this.alertStatus(response.status,response.message);
      if(name==='inspection_certificate'){this.setState({uploadLoadingInspection:false})}
      if(name==='inspection_certificate_2'){this.setState({uploadLoadingInspection2:false})}
      if(name==='road_tax_sticker'){this.setState({uploadLoadingSticker:false})}
      if(name==='road_tax'){this.setState({uploadLoadingRoadTax:false})}
      if(name==='road_tax_2'){this.setState({uploadLoadingRoadTax2:false})}
    });
  }
  destroyImage = (name) => {
    const {route} = this.props;
    const {post_id} = route.params;
    var base_url = '';
    if(name==='inspection_certificate'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageInspection";
      this.setState({removeLoadingInspection:true});
    }
    if(name==='inspection_certificate_2'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageInspection2";
      this.setState({removeLoadingInspection2:true});
    }
    if(name==='road_tax_sticker'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageSticker";
      this.setState({removeLoadingSticker:true});
    }
    if(name==='road_tax'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageRoadTax";
      this.setState({removeLoadingRoadTax:true});
    }
    if(name==='road_tax_2'){
      var base_url = "https://equipment.mohapiphup.com/api/destroyImageRoadTax2";
      this.setState({removeLoadingRoadTax2:true});
    }
    let uploadData = new FormData();
    uploadData.append('id',post_id)
    fetch(base_url,{method:"POST",body:uploadData,headers:{Accept: "application/json","Content-Type": "multipart/form-data"},})
    .then(response=>response.json())
    .then(response => {
      this.alertStatus(response.status,response.message);
      if(name==='inspection_certificate'){this.setState({removeLoadingInspection:false})};
      if(name==='inspection_certificate_2'){this.setState({removeLoadingInspection2:false})};
      if(name==='road_tax_sticker'){this.setState({removeLoadingSticker:false})};
      if(name==='road_tax'){this.setState({removeLoadingRoadTax:false})};
      if(name==='road_tax_2'){this.setState({removeLoadingRoadTax2:false})};
    });
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
  onRefresh = () => { this.requestPostData().then(()=>this.setState({refreshing:false})); }
  requestPostData = async () => {
    const {route} = this.props;
    const {post_id} = route.params;
    await fetch('https://equipment.mohapiphup.com/api/show/'+post_id)
    .then((response)=>response.json())
    .then((responseJson)=>{
      this.setState({
        postLoading:false,
        inspection_certificate  :responseJson.inspection_certificate,
        inspection_certificate_2  :responseJson.inspection_certificate_2,
        road_tax                :responseJson.road_tax.road_tax,
        road_tax_2              :responseJson.road_tax.road_tax_2,
        road_tax_sticker        :responseJson.road_tax.road_tax_sticker,
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
  
   
  ImageFooter=(current_index,total_images)=>{ return(<View style={{ alignItems:"center",padding: 20, }}><Text style={{ color:"white" }}>{current_index+1}/{total_images}</Text></View>)}
  render() {
    const web = "https://equipment.mohapiphup.com/"
    const imagesInspection = [
      this.state.inspection_certificate && web+this.state.inspection_certificate,
      this.state.inspection_certificate_2 && web+this.state.inspection_certificate_2,
      this.state.road_tax && web+this.state.road_tax,
      this.state.road_tax_2 && web+this.state.road_tax_2,
      this.state.road_tax_sticker && web+this.state.road_tax_sticker,
    ];
    const imagesViewInspection = [
      this.state.inspection_certificate && { uri: web+this.state.inspection_certificate},
      this.state.inspection_certificate_2 && { uri: web+this.state.inspection_certificate_2},
      this.state.road_tax && { uri: web+this.state.road_tax},
      this.state.road_tax_2 && { uri: web+this.state.road_tax_2},
      this.state.road_tax_sticker && { uri: web+this.state.road_tax_sticker},
    ];
    
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

        <>
          {this.modal()}
          <SliderBox
                sliderBoxHeight={300}
                images={imagesInspection.filter(function(url){ return url != null })}
                onCurrentImagePressed={(index)=> this.setState({visibleInspection:true,indexInspection:index})}
                dotColor="#FFEE58"
                inactiveDotColor="#90A4AE"
                autoplay
                circleLoop
                resizeMethod={'resize'}
                resizeMode={'cover'}
                imageLoadingColor="#2196F3"
            />
            <ImageView
                FooterComponent={({ imageIndex })=> this.ImageFooter(imageIndex,imagesInspection.filter(function(url){ return url != null}).length) }
                images={imagesViewInspection.filter(function(url){ return url != null})}
                imageIndex={this.state.indexInspection}
                visible={this.state.visibleInspection}
                onRequestClose={()=>this.setState({visibleInspection:false})}
            />

          

          
          <View style={{ flexDirection:"row", flexWrap:"wrap"}}>
            {/* Inspection I Photo */}
            {this.state.inspection_certificate ?
                !this.state.removeLoadingInspection ?
                <View style={styles.btnImage}>
                  {this.state.inspection_certificate && 
                    !this.state.uploadLoadingInspection ?
                    <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.inspection_certificate}`}} />
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
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.inspection_certificate_2}`}} />
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
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.road_tax_sticker}`}} />
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
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.road_tax}`}} />
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
                  <Image resizeMode="cover" style={{ width:Dimensions.get('window').width / 3-12,height:100 }} source={{ uri: `https://equipment.mohapiphup.com/${this.state.road_tax_2}`}} />
                  :this.uploadLoading()
                  }
                  {this.btnAction(`road_tax_2`)}
                </View> : this.removeLoading()
              :
              <TouchableOpacity onPress={ () => this.pickImage('road_tax_2')} disabled={this.state.uploadLoadingRoadTax2}>
                  <View style={styles.btnImage}>{this.state.uploadLoadingRoadTax2 ? this.uploadLoading(): this.blankBox(`កាតគ្រីឡាន ២`)}</View>
              </TouchableOpacity>}

          </View>


        </>

        </ScrollView>

        );
    }
  }
}
export default InspectionScreen;

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
