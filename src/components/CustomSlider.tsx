import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import type {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { useSongStore } from '../store/songStore';


// Define types for our props
type CustomSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  height?: number;
  thumbSize?: number;
  trackHeight?: number;
  onValueChange?: (value: number) => void;
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
  thumbSize = 20,
  trackHeight = 6,
  onValueChange,
}) => {
  const{currentTime, setCurrentTime, seek,song,videoRef} = useSongStore();
  const duration = song.duration
  const initialValue = (currentTime/duration)*width
  const sliderWidth = width - thumbSize;
  const progress = useSharedValue(((initialValue - min) / (max - min)) * sliderWidth);
  const updateValue = (newProgress: number,change = false) => {
    const newValue = min + (newProgress / sliderWidth) * (max - min);
    const steppedValue = Math.round(newValue / step) * step;
    const widthActive = progress.value
    seek(widthActive*duration/width)
    if(videoRef.current && change){
      videoRef.current.seek(widthActive*duration/width)
    }
  };
  const seekToTime = (p:number) =>{
    if(videoRef.current){
      const time = (p * duration) / width;
      videoRef.current.seek(time)
    }
  }
  // Tap gesture handler with proper typing
  const tapGestureHandler = useAnimatedGestureHandler<
    TapGestureHandlerGestureEvent
  >({
    onActive: (event) => {
      let newProgress = event.x - thumbSize / 2;
      newProgress = Math.max(0, Math.min(newProgress, sliderWidth));
      progress.value = newProgress;
      const time = progress.value*duration/width
      runOnJS(updateValue)(newProgress, true);
    },
  });

  // Pan gesture handler with proper typing
  const panGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,PanContextType>({
    onStart: (_, ctx) => {
      ctx.startX = progress.value;
      
    },
    onActive: (event, ctx) => {
      let newProgress = ctx.startX + event.translationX;
      newProgress = Math.max(0, Math.min(newProgress, sliderWidth));
      
      progress.value = newProgress;
      runOnJS(updateValue)(newProgress);
    },
    onEnd: () => {
      const finalProgress = progress.value;
      runOnJS(seekToTime)(finalProgress);
    },
  });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: progress.value,
  }));

  return (
    <View style={[styles.container, { width, height }]}>
      <TapGestureHandler onGestureEvent={tapGestureHandler}>
        <Animated.View style={styles.tapArea}>
        <View style={[styles.track, { width: sliderWidth, height: trackHeight }]}/>
          
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
                  borderRadius: thumbSize / 2 
                }, 
                thumbStyle
              ]} 
            />
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

// ... styles remain the same ...


// ... styles remain the same ...

export default CustomSlider;

const styles = StyleSheet.create({
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
    backgroundColor: '#6200ee',
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
