import React,{useEffect, useMemo, useState, useRef, useCallback,memo} from 'react';
import { View, StyleSheet,Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  useDerivedValue,
  runOnJS,
  Easing,
  useAnimatedProps
} from 'react-native-reanimated';
import { PanGestureHandler, TapGestureHandler, State, } from 'react-native-gesture-handler';
import type {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { useSongStore } from '../store/songStore';
import { COLORS } from '../types/theme';
import { RotatingCover } from './RotatingCover';
import { useShallow } from 'zustand/shallow';


// Define types for our props
type CustomSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  height?: number;
  thumbSize?: number;
  trackHeight?: number;
  initialValue?: number;
};

// Define context type for pan gesture
type PanContextType = {
  startX: number;
};

const CustomSlider: React.FC<CustomSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  width = 300,
  height = 40,
  thumbSize = 14,
  trackHeight = 3,
}) => {
  const{currentTime, setCurrentTime, song,videoRef,setIsSliding,isSliding} = useSongStore(useShallow((state) => ({
    currentTime: state.currentTime,
    setCurrentTime: state.setCurrentTime,
    song: state.song,
    videoRef: state.videoRef,
    setIsSliding: state.setIsSliding,
    isSliding: state.isSliding,
  }))
  );
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const duration = song.duration
  const progress = useSharedValue(0);
  const [widthActive, setWidthActive] = useState(0);
  const [timeActive, setTimeActive] = useState(0);
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      
      if (!isSliding) {
        const px = (currentTime / duration) * width;
        setWidthActive(px)
        progress.value = withTiming(px, {
          duration: 100,
          easing: Easing.linear,
        });
      }
      // setWidthActive(px);
    }, 10); // debounce nhẹ 50ms
    
    // setWidthActive(px);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
   
  }, [currentTime,isSliding]);
  // useEffect(() => {
  //   const px = (currentTime / duration) *width;
  //   if (timeoutRef.current) clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(() => {
  //     setWidthActive(px);
  //   },100);
  // }, [currentTime,isSliding]);
  // const updateValue = useCallback((newProgress: number) => {
  //   const newValue = min + (newProgress / sliderWidth) * (max - min);
  //   const steppedValue = Math.round(newValue / step) * step;
  //   const widthActive = progress.value
  //   setIsSliding(true)
  //   seek(widthActive*duration/sliderWidth)
  // },[min, max, step, sliderWidth]);
  const endGesture = useCallback(() => {
    const percent = widthActive / width; // Tính phần trăm
    const time = percent * duration;
    setCurrentTime(time); // Cập nhật currentTime
    if (videoRef.current) {
      videoRef.current.seek(time);
    }
    setIsSliding(false);  
  },[widthActive]);
 
  // Tap gesture handler with proper typing
  // const tapGestureHandler = useAnimatedGestureHandler<
  //   TapGestureHandlerGestureEvent
  // >({
  //   onActive: (event) => {
  //     let newProgress = event.x - thumbSize / 2;
  //     newProgress = Math.max(0, Math.min(newProgress, sliderWidth));

  //     runOnJS(updateValue)(newProgress);
  //   },
  // });

  // Pan gesture handler with proper typing
  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,PanContextType>({
    onStart: (_, ctx) => {
     
      ctx.startX = progress.value;
      runOnJS(setIsSliding)(true); // Gọi hàm setIsSliding(true) ở đây
    },
    onActive: (event, ctx) => {
     
      let newProgress = ctx.startX + event.translationX;
      newProgress = newProgress + thumbSize / 2;
      newProgress = Math.max(0, Math.min(newProgress, width));
      progress.value = newProgress;
      runOnJS(setWidthActive)(newProgress);
      // runOnJS(setIsSliding)(true);
    },
    onEnd: (event) => {
      
      runOnJS(endGesture)();
    },
  });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    
    width: progress.value,
  }));
  const onTap = ({ nativeEvent}: TapGestureHandlerGestureEvent) => {
    if (nativeEvent.state === State.END) {
      const tappedX = nativeEvent.x; // vị trí người dùng nhấn trên thanh
      // Tính phần trăm
      const percent = tappedX / (width); // thumbSize / 2 để căn giữa thumb
      // Tính thời gian tương ứng
      const newTime = percent * duration;
      // progress.value = tappedX
      // Cập nhật currentTime (hoặc gọi seek)
      setIsSliding(false)
      setCurrentTime(newTime); // hoặc call videoRef.current.seek(newTime)
      if(videoRef.current){
        videoRef.current.seek(newTime)
      }
      // Update progress (nếu không dùng derivedValue)
      // progress.value = withTiming(tappedX, { duration: 200 });
    }
  };
  const minutes = Math.floor(song.duration / 60);
  const seconds = Math.round(song.duration % 60);
  const minutesCurrent = useMemo(()=>{
    return Math.floor((widthActive/width)*duration / 60);
  },[widthActive])
  const secondsCurrent = useMemo(()=>{
    return Math.round((widthActive/width)*duration % 60);
  },[widthActive])   
  
  return (
    <>
    <View style={[styles.container, { width, height }]}>
      <TapGestureHandler onHandlerStateChange={onTap}>
        <Animated.View style={styles.tapArea}>
        <View style={[styles.track, { width: width, height: trackHeight }]}/>
          
          <Animated.View 
            style={[
              styles.progress, 
              { height: trackHeight }, 
              progressStyle
            ]} 
          />
          <PanGestureHandler onGestureEvent={panGestureHandler}>
            <Animated.View 
              style={[
                styles.thumb, 
                { 
                  width: thumbSize, 
                  height: thumbSize, 
                  borderRadius: thumbSize / 2,
                  left:-thumbSize / 2, // Center the thumb
                }, 
                thumbStyle
              ]} 
            />
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
    <View style={styles.view_duration}>
        <Text  style={[styles.text_info,]}>{(`${'0'+minutesCurrent}`).slice(-2)}:{(`${'0'+secondsCurrent}`).slice(-2)}</Text>
        <Text style={styles.text_info}>{(`${'0'+minutes}`).slice(-2)}:{(`${'0'+seconds}`).slice(-2)}</Text>
    </View>
    {/* <RotatingCover/> */}
    </>
  );
};
export default memo(CustomSlider);

const styles = StyleSheet.create({
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
  container: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    
  },
  track: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    position: 'absolute',
    left: 0,
  },
  tapArea: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  progress: {
    backgroundColor: 'green',
    borderRadius: 5,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    backgroundColor: '#6200ee',
    position: 'absolute',
    left: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  valueText: {
    position: 'absolute',
    top: -25,
    alignSelf: 'center',
    color: '#6200ee',
    fontWeight: 'bold',
  },
});
