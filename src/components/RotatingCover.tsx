import {View,StyleSheet, Image,Text,Animated,Easing  } from 'react-native';
import React, { useEffect, memo,useRef } from 'react';
import  {cancelAnimation, useSharedValue, useAnimatedStyle,interpolate,
   withRepeat, withTiming,runOnUI } from "react-native-reanimated";
import { COLORS } from '../types/theme';
import { useSongStore } from '../store/songStore';
interface Props{
  page:number;
}
export const RotatingCover:React.FC = memo(() => {
  const image_cover = useSongStore((state) => state.song.image_cover);
  const isPlaying = useSongStore(state => state.play);
  const progress = useSharedValue(0); // giá trị từ 0 → 1
  const spinValue = useRef<Animated.Value>(new Animated.Value(0)).current;

 useEffect(() => {
  spinValue.setValue(0); // reset ban đầu nếu cần
  const loopAnim = Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 7000,
      useNativeDriver: true,
      easing: Easing.linear,
    })
  );
  loopAnim.start();

  return () => loopAnim.stop(); // cleanup khi unmount
}, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
   
      <Animated.Image source={{ uri: image_cover }} resizeMode='cover' style={[styles.img,{ transform: [{ rotate: spin }] }]} />
   
  );
});
const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        alignItems:'center',
        borderRadius: 10,
        gap:12,
    },
    text_info:{
        color:COLORS.primaryWhiteHex,
        fontSize:12,
    },
    view_duration:{
    flexDirection:'row',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-between',
    },
    circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "blue",
    overflow: "hidden",
    },
    img:{
        width:200,
        height:200,
        borderRadius: 100,
       
    },
    slider: {
        width: '100%',
        height:2,
        marginTop: 10,
      },
  });