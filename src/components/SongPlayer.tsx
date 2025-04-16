import {View,StyleSheet, Image,Text,Dimensions,LayoutChangeEvent } from 'react-native';
import React, { useEffect,useState,memo,useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, 
    withRepeat, withTiming,useAnimatedProps , 
    Easing,useDerivedValue,
    Extrapolate,
    withSpring,
    runOnJS,
    useAnimatedGestureHandler,
    runOnUI,
    interpolate, } from "react-native-reanimated";
import { useSongStore } from '../store/songStore';
import { PlayerControls } from './PlayerControls';
import { COLORS, FONTSIZE } from '../types/theme';
import CustomSlider  from './CustomSlider';
import { RotatingCover } from './RotatingCover';
import { PanGestureHandler } from 'react-native-gesture-handler';
import SongLyrics from './SongLyric';
const { width } = Dimensions.get('window');
export const SongPlayer = memo(() =>{
    // useEffect(() => {
    //     progress.value = withTiming(currentTime,{duration:500,easing: Easing.linear,}); // Cập nhật giá trị của slider khi currentTime thay đổi
    // },[currentTime])
    // const animatedValue = useSharedValue(0);
    // React.useEffect(() => {
    //     animatedValue.value = currentTime;
    //   }, [currentTime]);
    
      // Dùng useAnimatedProps để tránh truy cập trực tiếp vào giá trị sharedValue
    const [index, setIndex] = useState(0); // 0: Component 1, 1: Component 2
    const translateX = useSharedValue(0);
    const song = useSongStore((state) => state.song);
    const heights = useSharedValue<number[]>([]);
    const outerPanRef = useRef<PanGestureHandler>(null);
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        flexDirection: 'row',
        alignItems:'flex-start',
        width: width * 2,
      }));
      
      // Indicator style
      const indicator1Style = useAnimatedStyle(() => ({
        width: interpolate(translateX.value, [-width, 0], [20, 40]),
        backgroundColor: 'black',
      }));
    
      const indicator2Style = useAnimatedStyle(() => ({
        width: interpolate(translateX.value, [-width, 0], [40, 20]),
        backgroundColor: 'black',
      }));
      const gestureHandler = useAnimatedGestureHandler({
        onEnd: (event) => {
          if (event.translationX < -50 && index === 0) {
            translateX.value = withSpring(-width);
            runOnJS(setIndex)(1);
          } else if (event.translationX > 50 && index === 1) {
            translateX.value = withSpring(0);
            runOnJS(setIndex)(0);
          } else {
            translateX.value = withSpring(index === 0 ? 0 : -width);
          }
        },
      });
      const titles = ['Trang Chủ', 'Bài Hát'];
      const title = titles[index];
      const updateHeight = (index: number, height: number) => {
        runOnUI(() => {
          const newHeights = [...heights.value];
    newHeights[index] = height;
    heights.value = newHeights;
        })();
      };
      const onLayoutPage = (index: number) => (event: LayoutChangeEvent) => {
        const height = event.nativeEvent.layout.height;
        
        updateHeight(index, height);
      };
      const animatedHeight = useAnimatedStyle(() => {
       
        if (heights.value.length < 2) return {};
      
        const inputRange = heights.value.map((_, i) => i * -width);
        const outputRange = heights.value;
        return {
          height: interpolate(
            translateX.value,
            inputRange,
            outputRange,
            Extrapolate.CLAMP
          ),
        };
      });
    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>{title}</Text>
            {/* Indicator */}
            <View style={styles.indicatorContainer}>
            <Animated.View style={[styles.indicator, indicator1Style]} />
            <Animated.View style={[styles.indicator, indicator2Style]} />
            </View>
            <View >
              <Animated.View style={[{ overflow: 'hidden' }, animatedHeight]}>
            <PanGestureHandler  onGestureEvent={gestureHandler}>
            <Animated.View style={[animatedStyle]}>
              {/* Component 1 */}
              <View onLayout={onLayoutPage(0)} style={styles.page}>
                  <RotatingCover/>
                  <View style={{alignItems:'center',gap:6}}>
                      <Text style={styles.text_title}>{song.name}</Text>
                      <Text style={styles.text_info}>{song.artist_name}</Text>
                  </View>
              </View>
            {/* Component 2 */}
            <View onLayout={onLayoutPage(1)} style={styles.page}>
              <View style={{alignItems:'center',gap:6}}>
                  <Text style={styles.text_title}>{song.name}</Text>
                  <Text style={styles.text_info}>{song.artist_name}</Text>
              </View> 
              <SongLyrics
              
              />
            </View>
            </Animated.View>
            </PanGestureHandler>
            </Animated.View>
            </View>
            <View style={{gap:6,alignItems:'center'}}>
                <CustomSlider/>
            </View>
            <PlayerControls/>
        </View>
    );
})
const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        borderRadius: 10,
        gap:12,
    },
    page: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
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
    text_title:{
        fontSize:FONTSIZE.size_16,
        color:COLORS.primaryWhiteHex,
    },
    title: {
        textAlign: 'center',
        fontSize: 22,
        fontWeight: 'bold',
        paddingVertical: 20,
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 10,
      },
      indicator: {
        height: 4,
        borderRadius: 2,
      },
  });