import React, { memo, useEffect,useRef, useState,RefObject,useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView,View as RNView,FlatList } from 'react-native';
import {throttle} from 'lodash';
import { useSongStore } from '../store/songStore';
import { PanGestureHandler, TapGestureHandler, State,Gesture,GestureDetector } from 'react-native-gesture-handler';
import type {
  PanGestureHandlerGestureEvent,
  TapGestureHandlerGestureEvent,
  GestureType,
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
  useAnimatedProps,
  runOnUI
} from 'react-native-reanimated';
import { COLORS } from '../types/theme';
const { width } = Dimensions.get('window');
type PanContextType = {
  y: number;
  shouldHandle:boolean
};
type Props = {
  outerTap:GestureType;
};
const CONTAINER_HEIGHT = 400;
const SongLyrics:React.FC<Props> = ({outerTap}) => {
 
  return (<View></View>)
  const currentTime = useSongStore((state) => state.currentTime);
  const song = useSongStore((state) => state.song);
  const videoRef = useSongStore(state =>state.videoRef)
  const lyrics = song?.lyrics;
  const translateY = useSharedValue(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);   
  const containerRef = useAnimatedRef<View>();
  const [indexActive,setIndexActive] = useState(-1)
  const flatListRef = useRef<FlatList>(null);
  const startY = useSharedValue(0); // Replaces context
  // const isAtTop = useSharedValue(true); // true nếu đã cuộn lên đỉnh
  if (!lyrics || lyrics.length == 0) return <View style={{marginVertical:20}}><Text style={[{textAlign:'center'},styles.text_title]}>Chưa có lời nhạc</Text></View>;
  const lyricHeight = 40; // Ví dụ, chiều cao mỗi lyric là 50 (tùy chỉnh theo thực tế)
  const totalHeight = lyrics.length * lyricHeight;
  useEffect(() => {
  if (indexActive >= 0 && flatListRef.current) {
    flatListRef.current.scrollToIndex({
      index: indexActive,
      animated: true,
      viewPosition: 0, // căn giữa màn hình
    });
  }
}, [indexActive]);
  const panGesture = Gesture.Pan()
  .onStart(() => {
    startY.value = translateY.value; // Store initial position
  })
  .onUpdate((event) => {
    translateY.value = startY.value + event.translationY;
    translateY.value = Math.max(
        Math.min(translateY.value, 0), // Giới hạn không cho cuộn lên quá mức (head)
        -(totalHeight - 300) // Giới hạn không cho cuộn xuống quá mức (bottom)
      )
  })
  .onEnd((event) => {

  })
  .activeOffsetY([-10, 10]) // Chỉ kích hoạt pan khi di chuyển đủ mạnh theo chiều dọc
  // .simultaneousWithExternalGesture(outerTap); // 👈 Cho phép đồng thời
  const nativeGesture = Gesture.Native();
  const gesture = Gesture.Simultaneous(panGesture, nativeGesture);
  const duration =song.duration
  // Hàm tìm lyric hiện tại bằng binary search
  const findCurrentLyricIndex = useCallback((timeMs:number) => {
    let low = 0;
    let high = lyrics.length - 1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const min = lyrics[mid].startTimeMs;
      const max = mid < lyrics.length - 1 
        ? lyrics[mid + 1].startTimeMs 
        : duration * 1000;

      if (timeMs >= min && timeMs < max) {
        return mid;
      } else if (timeMs < min) {
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return -1;
  }, []);

// Hàm cập nhật lyric
// const updateLyric = useCallback(() => {
//   const now = Date.now();
//   if(now - lastUpdateRef.current > 100){
//   const timeMs = currentTime * 1000;
//   const currentIndex = findCurrentLyricIndex(timeMs);
//   if (currentIndex !== lastIndexRef.current) {
//     lastIndexRef.current = currentIndex;
//     runOnUI(()=>{
//       translateY.value = withSpring(Math.min(-currentIndex, 0) * 40, {
//         damping: 20,
//         stiffness: 90,
//         mass: 1,
//       });
//       runOnJS(setIndexActive)(currentIndex);
//     })
//     // Cập nhật animation
//   }
//   lastUpdateRef.current = now;
//   // animationRef.current = requestAnimationFrame(updateLyric);
// }
// }, [currentTime, findCurrentLyricIndex]);

// Khởi động và dừng animation
const updateLyric = async () => {
  if (videoRef.current) {
    const time = await videoRef.current.getCurrentPosition();
    const ms = time * 1000;
    const currentIndex = findCurrentLyricIndex(ms);
    if (indexActive !== currentIndex) {
      runOnUI(() => {
        runOnJS(setIndexActive)(currentIndex);
        translateY.value = withSpring(Math.min(-currentIndex,0)*40,{
          damping: 20,// lực giảm chấn (giảm rung)
          stiffness: 90,       // độ cứng lò xo
          mass: 1,             // khối lượng ảo
          // overshootClamping: false, // true để không vượt quá target})
        },(finished) => {
          if (finished) {
            // Animation hoàn thành, có thể thực hiện các hành động khác nếu cần
            
          }
      })
      })();
    // Tách riêng phần JS ra ngoài UI thread
    }
  }
};
// const throttledUpdate = React.useRef(
//   throttle((time: number) => {
//     const ms = time * 1000;
//     const currentIndex = findCurrentLyricIndex(ms);
//     runOnUI(() => {
//       translateY.value = withSpring(Math.min(-currentIndex, 0) * 40, {
//         damping: 20,
//         stiffness: 90,
//         mass: 1,
//       });
//       runOnJS(setIndexActive)(currentIndex);
//     })();
//   }, 100) // Cập nhật tối đa mỗi 100ms
// ).current;
useEffect(() => {
  timeoutRef.current = setInterval(() => {
    
    updateLyric();
  }, 600);  // Cập nhật mỗi 200ms (5 lần mỗi giây)
  return () =>{
    if(timeoutRef.current){
      clearInterval(timeoutRef.current)
    }
  }
},[updateLyric]);
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateY: translateY.value }],
}));
useDerivedValue(()=>{
  
})
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
    <GestureDetector gesture={gesture}
    >
 
      
        <Animated.FlatList
  data={lyrics}
  ref={flatListRef}
  renderItem={({ item, index }) => (
    <LyricLine text={item.words} index={index} indexActive={indexActive} />
  )}
  keyExtractor={(_, i) => i.toString()}
  style={styles.flatList}
  contentContainerStyle={styles.contentContainer}
  scrollEnabled={true}
  windowSize={8}
  initialNumToRender={10}
  maxToRenderPerBatch={8}
  updateCellsBatchingPeriod={50}
  removeClippedSubviews={true}
  getItemLayout={(data, index) => ({
    length: lyricHeight, // 40 as defined earlier
    offset: lyricHeight * index,
    index,
  })}
/>
      
    
  </GestureDetector>
  );
};
interface LyricProps{
  text:string;
  index:number;
  indexActive: number;
}
const LyricLine: React.FC<LyricProps> = memo(({ text, index, indexActive }) => {
  const progress = useSharedValue(index === indexActive ? 1 : 0);

  'worklet';
  const animatedStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        [COLORS.primaryWhiteHex, '#ffff00']
      ),
    };
  });

  // Update progress in a worklet
  if (index === indexActive) {
    progress.value = withTiming(1, { duration: 1000 });
  } else {
    progress.value = withTiming(0, { duration: 1000 });
  }

  return (
    <Animated.Text style={[styles.lyricLine, styles.lyricText,animatedStyle]}>
      {text}
    </Animated.Text>
  );
});
const styles = StyleSheet.create({
  container: {
     
      paddingVertical: 10
    },
    flatList: {
    flex: 1,
    width: '100%',
    
   
  },
  contentContainer: {
    paddingVertical: 20,
    
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
     color:COLORS.primaryWhiteHex,
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