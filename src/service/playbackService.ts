import { useState, useRef } from 'react';
import Video, { OnProgressData, OnLoadData } from 'react-native-video';
import { useSongStore } from '../store/songStore';

const useVideoPlayer = () => {
  const videoRef = useRef<React.ElementRef<typeof Video>>(null); // Sử dụng `typeof Video`
  const [duration, setDuration] = useState(0); // Tổng thời lượng video/audio
  const [currentTime, setCurrentTime] = useState(0); // Thời gian hiện tại
  const [isPlaying, setIsPlaying] = useState(false);
 
  // Bắt đầu phát nhạc
  const play = () => {
    
    setIsPlaying(true);
  };

  // Tạm dừng nhạc
  const pause = () => {
    setIsPlaying(false);
  };

  // Tua đến thời gian cụ thể
  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seek(time);
      setCurrentTime(time);
    }
  };

  // Xử lý khi video/audio được tải
  const onLoad = (data: OnLoadData) => {
    setDuration(data.duration);
  };

  // Xử lý khi video/audio đang phát
  const onProgress = (data: OnProgressData) => {
    setCurrentTime(data.currentTime);
  };

  return {
    videoRef,
    isPlaying,
    play,
    pause,
    seek,
    duration,
    currentTime,
    onLoad,
    onProgress,
  };
};

export default useVideoPlayer;