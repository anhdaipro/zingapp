import {View,StyleSheet, Image,Text } from 'react-native';
import React, { useEffect,useState, memo } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming,useAnimatedProps , Easing,useDerivedValue } from "react-native-reanimated";
import { COLORS } from '../types/theme';
import { useSongStore } from '../store/songStore';
import {useShallow} from 'zustand/shallow';
import useRotationAnimation from '../hooks/setup/rotate';
import { useControlStore } from '../store/controlStore';
interface Props{
  page:number;
}
export const RotatingCover:React.FC<Props> = memo(({page}) => {
    const image_cover  = useSongStore((state) => state.song.image_cover);
    const rotation = useSharedValue(0);
    const pageAcitive = useControlStore(state=>state.page);
    useEffect(() => {
      if(page == pageAcitive){
        
      rotation.value = withRepeat(
        withTiming(360, {
          duration: 9000, // Xoay 360 độ trong 2 giây
          easing: Easing.linear, // Tốc độ đều
        }),
        -1, // Lặp vô hạn
        false // Không đảo chiều
      );

      return () => {
        // Dọn dẹp khi component unmount
        rotation.value = 0;
      };
    }
    }, [pageAcitive]);
    const animatedStyle = useAnimatedStyle(() => {
        if (!global._WORKLET) {
          // Chạy trong JS thread (không phải UI)
          console.log("JS thread only - không nên xử lý UI ở đây");
          return {};
        }
      
        // Đoạn code dưới đây sẽ chỉ chạy khi ở trong UI thread (worklet)
        return {
          transform: [
            { rotate: `${rotation.value}deg` },
          ],
        };
      });
    return (
        <Animated.View style={[styles.circle, animatedStyle]}>
            <Image source={{ uri: image_cover }} style={styles.img} resizeMode="cover" />
        </Animated.View>
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
    borderRadius: '50%',
    backgroundColor: "blue",
    overflow: "hidden",
    },
    img:{
        width:'100%',
        height:'100%',
       
    },
    slider: {
        width: '100%',
        height:2,
        marginTop: 10,
      },
  });