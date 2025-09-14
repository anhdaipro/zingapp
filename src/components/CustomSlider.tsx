import React,{useEffect, useMemo, useState, useRef, useCallback,memo} from 'react';
import { View, StyleSheet,Text,Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  useAnimatedProps,
  runOnUI,
  withTiming,
  measure,
  useAnimatedReaction,
  useAnimatedRef,
   useFrameCallback,
  Easing
} from 'react-native-reanimated';
import {Gesture,GestureDetector   } from 'react-native-gesture-handler';

import { useSongStore } from '../store/songStore';

import { COLORS } from '../types/theme';
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
const { width } = Dimensions.get('window');
const widthA = width - 48
const AnimatedText = Animated.createAnimatedComponent(Text);
const CustomSlider: React.FC<CustomSliderProps> = ({
  min = 0,
  max = 100,
  step = 1,
  width = widthA,
  height = 40,
  thumbSize = 14,
  trackHeight = 3,
}) => {
  // return (<View></View>)
  const{song,videoRef,setIsSliding,isSliding} = useSongStore(useShallow((state) => ({
    song: state.song,
    videoRef: state.videoRef,
    setIsSliding: state.setIsSliding,
    isSliding: state.isSliding,
  }))
  );
  // const currentTime = async () => {
  //   if(videoRef.current){
  //     return await videoRef.current?.getCurrentPosition();
  //   }
  //   return 0;
  // };
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const duration = song.duration
  const progress = useSharedValue(0);
  const [widthActive, setWidthActive] = useState(0);
  const [timeActive, setTimeActive] = useState(0);
  const animatedRef = useAnimatedRef<Animated.View>();
  const isAnimating = useSharedValue(false); // ⚡ Trạng thái animation
  const startX = useSharedValue(0); // Replaces context
  
useEffect(() => {
  if (!videoRef.current || isSliding) return;
  videoRef.current.getCurrentPosition().then((positionStart) => {
    const start = positionStart;
    const end = song.duration;
    const remaining = end - start;

    const pxStart = (start / end) * width;
    const pxEnd = width;

    // ✅ Cập nhật React state bình thường
    setWidthActive(pxStart);

    // ✅ Animate bằng Reanimated
    runOnUI(() => {
      'worklet';
       if (isAnimating.value) return; // tránh chạy lại nếu đang chạy
      isAnimating.value = true;
      progress.value = withTiming(
        pxEnd,
        {
          duration: remaining * 1000,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            isAnimating.value = false;
          }
        }
      );
    })();
  });
}, [videoRef.current, isSliding, width, song.duration]);
useAnimatedReaction(
  () => progress.value,
  () => {
      const measurement = measure(animatedRef);

      if (measurement !== null) {
        runOnJS(setWidthActive)(measurement.width);
      }
  });
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
    // setCurrentTime(time); // Cập nhật currentTime
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
  const panGesture = Gesture.Pan()
  .onStart(() => {
    // ctx is no longer used, you might need to use refs or other methods
    // if you need to store values between events
    startX.value = progress.value; // Store initial position
    runOnJS(setIsSliding)(true);
  })
  .onUpdate((event) => {
    let newProgress = startX.value + event.translationX;
    newProgress = newProgress + thumbSize / 2;
    newProgress = Math.max(0, Math.min(newProgress, width));
    progress.value = newProgress;
    runOnJS(setWidthActive)(newProgress);
  })
  .onEnd(() => {
    runOnJS(endGesture)();
  });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value,
  }));
  const minutes = Math.floor(song.duration / 60);
  const seconds = Math.round(song.duration % 60);
  
  // const timeText = useMemo(() => {
  //   const minutes =  Math.floor((widthActive/width)*duration / 60);
  //   const seconds = Math.round((widthActive/width)*duration % 60);
  //   return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
  // }, [widthActive]);
  const tapGesture = Gesture.Tap()
  .onEnd((event) => {
    const tappedX = event.x; // Position where user tapped
    const percent = tappedX / width;
    const newTime = percent * duration;
    runOnJS(setIsSliding)(false);
    if (videoRef.current) {
      runOnJS(videoRef.current.seek)(newTime);
    }
  });
  const timeText = useMemo(() => {
    const minutes = Math.floor(song.duration / 60);
    const seconds = Math.round(song.duration % 60);
    return `${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
  }, [song.duration]);
   const minutesCurrent = useMemo(()=>{
    return Math.floor((widthActive/width)*duration / 60);
  },[widthActive])
  const secondsCurrent = useMemo(()=>{
    return Math.round((widthActive/width)*duration % 60);
  },[widthActive]) 
  // const animatedProps = useAnimatedProps(() => {
  //   return {
  //     text: progress.value,
  //   } as any;
  // });
  return (
    <>
    <View style={[styles.container, { width, height }]}>
      <GestureDetector  gesture={tapGesture}>
        <Animated.View style={styles.tapArea}>
        <View style={[styles.track, { width: width, height: trackHeight }]}/>
          
          <Animated.View 
          ref={animatedRef}
            style={[
              styles.progress, 
              { height: trackHeight }, 
              progressStyle
            ]} 
          />
          <GestureDetector  gesture={panGesture}>
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
          </GestureDetector>
        </Animated.View>
      </GestureDetector >
     
    </View>

    <View style={[styles.view_duration,{width:widthA}]}>
      
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
