'use strict';
import { StyleSheet,Dimensions } from 'react-native';
module.exports = StyleSheet.create({
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
        },
        input: {
        height: 40,
        marginBottom:10,
        borderWidth: 1,
        borderColor:"#888",
        padding: 10,
        fontSize:17,
        },
});