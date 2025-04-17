import React, { memo, useEffect,useRef, useState,RefObject } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView,View as RNView } from 'react-native';

import { useSongStore } from '../store/songStore';
import { PanGestureHandler, TapGestureHandler, State, } from 'react-native-gesture-handler';
import type {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  interpolateColor,
  withTiming,
  useDerivedValue,
  runOnJS,
  Easing,
  useAnimatedRef,
  useAnimatedProps
} from 'react-native-reanimated';
import { COLORS } from '../types/theme';
const { width } = Dimensions.get('window');
type PanContextType = {
  y: number;
  shouldHandle:boolean
};
type Props = {
  outerPanRef: RefObject<PanGestureHandler>;
};
const CONTAINER_HEIGHT = 400;
const SongLyrics:React.FC<Props> = ({outerPanRef}) => {
  const currentTime = useSongStore((state) => state.currentTime);
  const song = useSongStore((state) => state.song);
  const lyrics = song?.lyrics;
  const translateY = useSharedValue(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);   
  const containerRef = useAnimatedRef<View>();
  const [indexActive,setIndexActive] = useState(-1)
  // const isAtTop = useSharedValue(true); // true nếu đã cuộn lên đỉnh
  // return <View></View>
  if (!lyrics || lyrics.length == 0) return <View style={{marginVertical:20}}><Text style={[{textAlign:'center'},styles.text_title]}>Chưa có lời nhạc</Text></View>;
  const lyricHeight = 40; // Ví dụ, chiều cao mỗi lyric là 50 (tùy chỉnh theo thực tế)
  const totalHeight = lyrics.length * lyricHeight;
  const gestureHandler = useAnimatedGestureHandler<
  PanGestureHandlerGestureEvent,
  PanContextType>
  ({
  onStart: (_, ctx) => {
    ctx.y = translateY.value;
    // ctx.shouldHandle = !isAtTop.value;
  },
  onActive: (event, ctx) => {
    translateY.value = ctx.y + event.translationY;
    translateY.value = Math.max(
        Math.min(translateY.value, 0), // Giới hạn không cho cuộn lên quá mức (head)
        -(totalHeight - 300) // Giới hạn không cho cuộn xuống quá mức (bottom)
      )
      // if (translateY.value <= 0) {
      //   isAtTop.value = true;
      // } else {
      //   isAtTop.value = false;
      // }
  },
  onEnd: (_) => {
    // Optional: clamp lại hoặc thêm inertia
  },
});
useEffect(()=>{
  
  timeoutRef.current = setTimeout(() => {
    const time = currentTime * 1000;
    let indexChoice = -1;
    for (let index = 0; index < lyrics.length; index++) {
      const min = lyrics[index].startTimeMs;
      const max = index < lyrics.length - 1
        ? lyrics[index + 1].startTimeMs
        : song.duration * 1000;

      if (time >= min && time < max) {
        indexChoice = index;
        break;
      }
    }
    console.log(indexChoice)
    setIndexActive(indexChoice);
    // translateY.value = Math.min(0,indexActive)
    // const y = indexChoice <= 0 ? 0 : -indexChoice*40;
    translateY.value = withSpring(Math.min(-indexChoice,0)*40,{
      damping: 20,// lực giảm chấn (giảm rung)
      stiffness: 90,       // độ cứng lò xo
      mass: 1,             // khối lượng ảo
      // overshootClamping: false, // true để không vượt quá target})
    })
    // translateY.value = -indexChoice * 40;
  },10)
  return () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
},[currentTime])
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
}));
  // Initialize refs for each lyric line
  // if (itemRefs.current.length !== lyrics.length) {
  //   itemRefs.current = Array(lyrics.length)
  //     .fill(null)
  //     .map((_, i) => itemRefs.current[i] || React.createRef());
  // }

  // useDerivedValue(() => {
  //   const index = activeIndex.value;
  //   if (index === -1) return;

  //   runOnUI(() => {
  //     'worklet';
  //     try {
  //       const viewRef = itemRefs.current[index];
  //       if (viewRef) {
  //         const measured = measure(viewRef);
  //         if (measured) {
  //           scrollTo(scrollViewRef, 0, measured.pageY - 100, true);
  //         }
  //       }
  //     } catch (error) {
  //       console.log('Measurement error:', error);
  //     }
  //   })();
  // });

  // useEffect(() => {
  //   const index = lyrics.findIndex((lyric) => {
  //     return currentTime >= Math.floor(lyric.startTimeMs) && currentTime <= Math.floor(lyric.endTimeMs);
  //   });
    
  //   if (index !== -1) {
  //     activeIndex.value = index;
  //   }
  // }, [currentTime, lyrics]);
  return (
    <PanGestureHandler onGestureEvent={gestureHandler}
    activeOffsetY={[-10, 10]} // chỉ kích hoạt nếu kéo dọc đủ mạnh
    waitFor={outerPanRef} // ưu tiên outer nếu kéo ngang
    simultaneousHandlers={outerPanRef}
    >
  <Animated.View style={[ {height: CONTAINER_HEIGHT, overflow: 'hidden' }]}>
    <Animated.View ref={containerRef} style={animatedStyle}>
      {lyrics.map((lyric, index) => {
            return (
              <LyricLine
                  key={index}
                  text={lyric.words}
                  index={index}
                  indexActive={indexActive}
                />
            );
          })}
    </Animated.View>
  </Animated.View>
</PanGestureHandler>
  );
};
interface LyricProps{
  text:string;
  index:number;
  indexActive: number;
}
const LyricLine:React.FC<LyricProps> = memo(({ text, index, indexActive }) => {
  const progress = useSharedValue(0);
  useEffect(()=>{
      progress.value = 0;
      progress.value = withTiming(index == indexActive ? 1 : 0, {
        duration: 1000, // 1.5 giây
      });
    
  },[indexActive])
  // Tạo animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1], // Range giá trị
        ['#ffffff', '#ffff00'] // Từ trắng (#ffffff) sang vàng (#ffff00)
      ),
    };
  });
  
  return <Animated.Text style={[styles.lyricLine,styles.lyricText, animatedStyle]}>{text}</Animated.Text>;
});
const styles = StyleSheet.create({
  container: {
     
      paddingVertical: 10
    },
  lyricsContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 20,
  },
  lyricLine: {
    
    minHeight: 40,
  },
  lyricText: {
    textAlign: 'center',
  },
  text_info:{
    color:COLORS.primaryWhiteHex,
  },
  text_title:{
    color:COLORS.primaryWhiteHex,
    fontSize:16,
    fontWeight:600,
  }
});

export default SongLyrics;