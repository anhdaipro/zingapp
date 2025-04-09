import {View,StyleSheet, Image,Text } from 'react-native';
import React, { useEffect,useState } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming,useAnimatedProps , Easing,useDerivedValue } from "react-native-reanimated";
import { useSongStore } from '../store/songStore';
import { PlayerControls } from './PlayerControls';
import useVideoPlayer from '../service/playbackService';
import Slider  from '@react-native-community/slider';
import { COLORS } from '../types/theme';
import { CustomSlider } from './CustomSlider';
export const SongPlayer:React.FC = () =>{
    const rotation = useSharedValue(0);
    const [isValueChanged, setIsValueChanged] = useState(false); // Theo dõi xem giá trị có thay đổi không
    const {song,currentTime,seek,videoRef,setIsSliding,setCurrentTime} = useSongStore();
   
    useEffect(() => {
        // Xoay 360 độ trong 2 giây, lặp vô hạn
        rotation.value = withRepeat(withTiming(7200, { duration: 90000 }), -1, false);
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));
    // useEffect(() => {
    //     progress.value = withTiming(currentTime,{duration:500,easing: Easing.linear,}); // Cập nhật giá trị của slider khi currentTime thay đổi
    // },[currentTime])
    // const animatedValue = useSharedValue(0);
    // React.useEffect(() => {
    //     animatedValue.value = currentTime;
    //   }, [currentTime]);
    
      // Dùng useAnimatedProps để tránh truy cập trực tiếp vào giá trị sharedValue
     
    const handleSlidingStart = () => {
        setIsSliding(true);
        
      };
      const handleValueChange = (value: number) => {
        setIsValueChanged(true); // Đánh dấu rằng giá trị đã thay đổi
      };
      const handleSlidingComplete = (value: number) => {
        setIsSliding(false);
    
        if (!isValueChanged) {
          console.log('User tapped on the slider without dragging');
          // Xử lý logic khi người dùng chỉ nhấn vào slider
        } else {
        //   videoRef.current?.seek(value); // Tua video đến đúng vị trí
            seek(value)
        }
      };
    const minutes = Math.floor(song.duration / 60);
    const seconds = Math.round(song.duration % 60);
    const minutesCurrent = Math.floor(currentTime / 60);
    const secondsCurrent = Math.round(currentTime % 60);    
    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circle, animatedStyle]} >
                <Image
                    source={{ uri: song.image_cover }}
                    style={styles.img}
                    resizeMode="cover"  // Đảm bảo ảnh được cắt theo hình tròn
                />
            </Animated.View>
            <View style={{width:'80%',gap:6}}>
               
                <CustomSlider/>
               
                <View style={styles.view_duration}>
                    <Text style={styles.text_info}>{(`${'0'+minutesCurrent}`).slice(-2)}:{(`${'0'+secondsCurrent}`).slice(-2)}</Text>
                    <Text style={styles.text_info}>{(`${'0'+minutes}`).slice(-2)}:{(`${'0'+seconds}`).slice(-2)}</Text>
                </View>
            </View>
            <PlayerControls/>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        alignItems:'center',
        backgroundColor: '#FFF',
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