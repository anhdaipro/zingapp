import Modal from "react-native-modal";
import { useSongStore } from "../store/songStore";
import {View, Text, Button, StyleSheet, TouchableOpacity,Image, ScrollView,Dimensions,Pressable} from 'react-native'
import { COLORS } from "../types/theme";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { iconList } from "../utils/data";
import AppIcon from "./AppIcon";
import React,{useRef,useEffect} from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS
} from "react-native-reanimated";
const { height } = Dimensions.get("window");
export const ModalContainer = () =>{
    const {song,visible,setVisible} = useSongStore()
    const translateY = useSharedValue(height);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
    } else {
      translateY.value = withTiming(height, { duration: 300 }, () => runOnJS(() => setVisible(false))());
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

    return (
      <View style={styles.overlay}>
      <Pressable style={styles.background} onPress={()=>setVisible(false)} />
      <Animated.View style={[styles.modal, animatedStyle]}>
        <View style={styles.dragHandle} />
        <Text style={styles.text}>Hello, this is a Bottom Sheet!</Text>
      </Animated.View>
    </View>
  )
}
const styles = StyleSheet.create({
    flex_1:{
        flex:1
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    flex:{
      flexDirection:'row',
        alignItems:'center',
        gap:12,
    },
    modalContent: {
      alignItems: "center",
    },
    modalContainer: {
      backgroundColor: COLORS.secondaryDarkGreyHex,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 40,
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
    
    scrollView: {
      flexGrow:1
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
      dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 5,
        alignSelf: 'center',
        marginBottom: 10,
      },
      modalText: {
        fontSize: 16,
        marginBottom: 20,
      },
        overlay: {
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
        background: {
          flex: 1,
        },
        text: {
          fontSize: 18,
          textAlign: "center",
        },
    
      
  });