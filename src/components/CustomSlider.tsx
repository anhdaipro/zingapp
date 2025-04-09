import { GestureDetector, Gesture,PanGestureHandler,PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {Text,StyleSheet} from 'react-native'
type ContextType = {
  startX: number;
  startY: number;
};

export function CustomSlider() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = useAnimatedGestureHandler<
  PanGestureHandlerGestureEvent,
  ContextType
>({
  onStart: (_, context) => {
    context.startX = translateX.value;
    context.startY = translateY.value;
  },
  onActive: (event, context) => {
    translateX.value = context.startX + event.translationX;
    translateY.value = context.startY + event.translationY;
  },
});

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <PanGestureHandler onGestureEvent={panGesture}>
      <Animated.View style={[styles.box, animatedStyle]} />
    </PanGestureHandler>
  );
}
const styles = StyleSheet.create({
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'tomato',
    borderRadius: 8,
  },
});