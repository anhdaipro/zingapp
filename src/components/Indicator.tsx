import {View,StyleSheet, Image,Text,Dimensions,LayoutChangeEvent } from 'react-native';
import React, { useEffect,useState,memo,useRef,useMemo } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, 
    withRepeat, withTiming,useAnimatedProps , 
    Easing,useDerivedValue,
    Extrapolate,
    withSpring,
    runOnJS,
    useAnimatedGestureHandler,
    interpolateColor,
    runOnUI,
    SharedValue,
    interpolate, } from "react-native-reanimated";
interface Props{
    index :number;
    translateX: SharedValue<number>;
    width:number;
    indexActive: number
}
export const Indicator:React.FC<Props> = ({ index, translateX, width,indexActive }) => {
    console.log(translateX)
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
          ];
          console.log(translateX)
          // Interpolate để tính toán chiều rộng của indicator
          const widthAnim = interpolate(
            -translateX.value, // Note the negative sign
            inputRange,
            [12, 20, 12],
            Extrapolate.CLAMP
          );
          console.log(inputRange)
          // Thay đổi màu nền của indicator khi nó gần vị trí active
          // const bgColor = index==indexActive ? '#FFD700' : '#fff'; 
          const bgColor = interpolateColor(
            -translateX.value, // Note the negative sign
            inputRange,
            ['#fff', '#FFD700' , '#fff'],
          );
         
        //   const widthAnim =  index==indexActive ? 40 : 20; 
          return {
            width: widthAnim,
            backgroundColor: bgColor,
          };
    });
    return (
      <Animated.View
        style={[
          {
            height: 4,
            borderRadius: 4,
          },
          animatedStyle,
        ]}
      />
    );
  };