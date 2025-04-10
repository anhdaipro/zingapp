import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  runOnJS,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useSongStore } from '../store/songStore';
import { COLORS } from '../types/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6;

export const ModalContainer = () => {
  const translateY = useSharedValue(MODAL_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const {visible: isVisible,setVisible:setIsVisible} = useSongStore()
  useEffect(() => { 
    if (!isVisible) return;
    openModal();
  }
  , [isVisible]);
  const openModal = () => {
    translateY.value = withSpring(0, {
      damping: 40,
      stiffness: 400,
    });
    backdropOpacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.ease,
    });
    setIsVisible(true);
  };

  const closeModal = () => {
    translateY.value = withSpring(MODAL_HEIGHT, {
      damping: 40,
      stiffness: 400,
    });
    backdropOpacity.value = withTiming(0, {
      duration: 300,
      easing: Easing.ease,
    }, () => {
      runOnJS(setIsVisible)(false);
    });
  };

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newTranslateY = ctx.startY + event.translationY;
      if (newTranslateY >= 0) {
        translateY.value = newTranslateY;
        backdropOpacity.value = 1 - (newTranslateY / MODAL_HEIGHT);
      }
    },
    onEnd: (event) => {
      if (event.translationY > MODAL_HEIGHT / 3) {
        runOnJS(closeModal)();
      } else {
        translateY.value = withSpring(0, {
          damping: 40,
          stiffness: 400,
        });
        backdropOpacity.value = withTiming(1, {
          duration: 300,
          easing: Easing.ease,
        });
      }
    },
  });

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));
  console.log(isVisible)
  return (
      isVisible && (
        <>
         
          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View style={[styles.modal, modalStyle]}>
              <TouchableWithoutFeedback onPress={closeModal}>
                <View>
                  <View style={styles.dragHandle} />
                  <Text style={styles.modalTitle}>Custom Modal</Text>
                  <Text style={styles.modalText}>
                    Press outside or swipe down to close
                  </Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                    <Text>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </Animated.View>
          </PanGestureHandler>
         
        </>
      )
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    padding: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
  
    backgroundColor: COLORS.secondaryGreyHex,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    zIndex:10000,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});
