import React, { Component } from 'react';
import { View, Text } from 'react-native';
import ImageView from "react-native-image-viewing";
import { Button } from 'react-native-elements';
import { BulletList } from 'react-content-loader/native'
class DriverScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        post:[],
        photos:[],
        postLoading:true,
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
        post: responseJson,
        photos: responseJson.photos,
        postLoading:false,
      });
    }).catch(error=>{
      console.log(error);
    })
  }

  render() {
    const images = (
        this.state.photos.map(image=>(
            { uri: `http://equipment.mohapiphup.com/`+image.path}
        ))
    );
    if (this.state.postLoading) {
        return(
            <View ><BulletList width="100%" /></View>
        )
    } else {
        return (
            <View>
            <View>
                <Text>
                <Button title="hi" onPress={()=> this.setState({visible:true}) } />
            </Text>
            </View>
        <ImageView
            images={images}
            imageIndex={this.state.index}
            visible={this.state.visible}
            onRequestClose={()=>this.setState({visible:false})}
        />
        </View>
        );
    }
    
  }
}

export default DriverScreen;
