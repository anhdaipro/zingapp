import {View,StyleSheet, Image,Text,Dimensions,LayoutChangeEvent } from 'react-native';
import React, { useEffect,useState,memo,useRef,useMemo } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, 
    Extrapolation,
    withSpring,
    runOnJS,
    runOnUI,
    interpolate, } from "react-native-reanimated";
import { useSongStore } from '../store/songStore';
import { PlayerControls } from './PlayerControls';
import { COLORS, FONTSIZE } from '../types/theme';
import CustomSlider  from './CustomSlider';
import { RotatingCover } from './RotatingCover';
import {Gesture, GestureDetector, } from 'react-native-gesture-handler';
import SongLyrics from './SongLyric';
import { Indicator } from './Indicator';
import { useControlStore } from '../store/controlStore';
import { SongInfo } from './SongInfo';
import { FpsCounter } from './FpsCount';
const { width } = Dimensions.get('window');
const titles = ['Trang Chủ', 'Bài Hát', 'Lời Bài Hát'];
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
    const translateX = useSharedValue(index * -width);
    const song = useSongStore((state) => state.song);
    const setPage = useControlStore(state=>state.setPage)
    const heights = useSharedValue<number[]>([]);
    console.log('SongPlayer render');
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        flexDirection: 'row',
        alignItems:'flex-start',
        width: width * titles.length,
      }));
      
      const outerTap = Gesture.Pan()
      .onUpdate((event) => {
        // Prevent swiping beyond first/last item
        if ((event.translationX > 0 && index === 0) || 
            (event.translationX < 0 && index === titles.length - 1)) {
          return;
        }
        translateX.value = index * -width + event.translationX;
      })
      .onEnd((event) => {
        let indexChoice = event.translationX < -50 ? index + 1 : index - 1;
        indexChoice = Math.max(0, Math.min(indexChoice, titles.length - 1));
        
        // Update state on JS thread
        runOnJS(setIndex)(indexChoice);
        runOnJS(setPage)(indexChoice);
        
        // Animate to new position
        translateX.value = withSpring(indexChoice * -width);
      })
      .activeOffsetX([-10, 10]) // Vuốt ngang >10 hoặc <-10 mới hoạt động
      .activeOffsetY([-999, 999]); // Không giới hạn trục Y (để chỉ tập trung vào trục X)
      const nativeGesture = Gesture.Native();
      const gesture = Gesture.Simultaneous(outerTap, nativeGesture);
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
        const inputRange = heights.value.map((_, i) => i * width);
        const outputRange = heights.value;
        return {
          height: interpolate(
            -translateX.value,
            inputRange,
            outputRange,
            Extrapolation.CLAMP
          ),
        };
      });
      
    
    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>{title}</Text>
            {/* Indicator */}
            <View style={styles.indicatorContainer}>
            {/* <Animated.View style={[styles.indicator, indicator1Style]} />
            <Animated.View style={[styles.indicator, indicator2Style]} /> */}
              {titles.map((item, number) =>(
                <Indicator key={number} index={number} indexActive={index} width={width} translateX={translateX} />
              ))}
            </View>
            <View >
              <Animated.View style={[{ overflow: 'hidden' }, animatedHeight]}>
            <GestureDetector gesture={gesture}>
            <Animated.View style={[animatedStyle]}>
              {/* Component 1 */}
              <View onLayout={onLayoutPage(0)} style={styles.page}>
                  <RotatingCover/>
                  <View style={{alignItems:'center',gap:6}}>
                      <Text style={styles.text_title}>{song.name}</Text>
                      <Text style={styles.text_info}>{song.artist_name}</Text>
                  </View>
              </View>
              {/* Component 1 */}
              <View onLayout={onLayoutPage(1)} style={styles.page}>
                <SongInfo/>
              </View>
            {/* Component 2 */}
            <View onLayout={onLayoutPage(2)} style={styles.page}>
              <View style={{alignItems:'center',gap:6}}>
                  <Text style={styles.text_title}>{song.name}</Text>
                  <Text style={styles.text_info}>{song.artist_name}</Text>
              </View> 
              <SongLyrics
              outerTap={outerTap}
              />
            </View>
            </Animated.View>
            </GestureDetector>
            </Animated.View>
            </View>
            <View style={{gap:6,alignItems:'center'}}>
                <CustomSlider/>
            </View>
            <PlayerControls/>
           <FpsCounter/>
        </View>
    );
})
const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        gap:12,
    },
    page: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
        gap:24,
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
        fontSize: 16,
        fontWeight: 'bold',
        paddingTop: 4,
        color:COLORS.primaryWhiteHex,
      },
      text: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
        marginBottom: 10,
      },
      indicator: {
        height: 4,
        borderRadius: 2,
      },
  });