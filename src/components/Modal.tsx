import Modal from "react-native-modal";
import { useSongStore } from "../store/songStore";
import {View, Text, StyleSheet, TouchableOpacity,Image, Animated} from 'react-native'
import { COLORS } from "../types/theme";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { iconList } from "../utils/data";
import AppIcon from "./AppIcon";
import React,{useRef, useState,useCallback} from 'react'
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MusicPlayer from "./Player";
import { ContentModal } from "./ContentModal";
export const ModalContainer = () =>{
  const {song,visible,setVisible,stylesModal,viewVisible} = useSongStore();
  console.log(stylesModal)
  const modalHeight = useRef(new Animated.Value(300)).current; // Modal bắt đầu từ 300px
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInUp"   // Hiệu ứng mở từ dưới lên
      animationOut="slideOutDown" // Hiệu ứng đóng xuống dưới
      // animationInTiming={300}
      // animationOutTiming={100}
      backdropColor="black"
      backdropOpacity={0.5}
      swipeDirection="down"
      onSwipeComplete={() => setVisible(false)}
      
      onBackdropPress={() => setVisible(false)}
    
      style={stylesModal} // Modal nằm dưới cùng màn hình
      
    >
      <GestureHandlerRootView style={styles.flex_1}>
      <ContentModal/>
      </GestureHandlerRootView>
     
    </Modal>
    )

}
const styles = StyleSheet.create({
    flex_1:{
        flex:1
    },
    items:{
      gap:12
    },
    item:{
      gap:12,
      flexDirection:'row',
        alignItems:'center',
    },
    flex_row:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%'
    },
    song_info:{
        paddingBottom:12,
        borderBottomWidth:0.5,
        borderColor:'#fff'
    },
    modal: {
        justifyContent: "flex-end", // Đưa modal xuống dưới cùng
        margin: 0, // Loại bỏ khoảng cách xung quanh
    },
    modalContent: {
      padding: 20,
      backgroundColor: COLORS.primaryGreyHex,
      borderRadius: 10,
      gap:12,
     
    },
     songItem: {
        alignItems: 'center',
        flexDirection:'row',
        paddingHorizontal:6,
        paddingVertical: 6,
        borderRadius: 20,
        gap:12,
        flex:1
      },
      img_small:{
        width:40,
        height:40,
        borderRadius:4,
        resizeMode:'contain',
      },
      button:{
        borderRadius:4
      },
      text_info:{
        color:COLORS.primaryWhiteHex,
          
      },
  });