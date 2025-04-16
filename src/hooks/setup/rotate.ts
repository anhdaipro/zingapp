// hooks/useRotationAnimation.ts
import { useEffect } from 'react';
import { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

const useRotationAnimation = (duration = 80000) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 9000, // Xoay 360 độ trong 2 giây
        easing: Easing.linear, // Tốc độ đều
      }),
      -1, // Lặp vô hạn
      false // Không đảo chiều
    );

    return () => {
      // Dọn dẹp khi component unmount
      rotation.value = 0;
    };
  }, []);

  return rotation;
};

export default useRotationAnimation;