import React,{useRef,memo} from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Video,{OnProgressData } from 'react-native-video';
import useVideoPlayer from '../service/playbackService'; // Đường dẫn đến file playbackService.ts
import { useSongStore } from '../store/songStore';
import { useShallow } from 'zustand/shallow';

const MusicPlayer: React.FC<{url:string}> = ({url}) => {
  const {
    onLoad,
  } = useVideoPlayer();
 
  const {play:isPlaying,setPlay,setCurrentTime,videoRef,currentTime,isSliding} = useSongStore(useShallow((state) => ({
    play: state.play,
    setPlay: state.setPlay,
    setCurrentTime: state.setCurrentTime,
    videoRef: state.videoRef,
    currentTime: state.currentTime,
    isSliding:state.isSliding
  })));
  return (
      <Video
        ref={videoRef}
        source={{ uri: url }} // Đường dẫn đến file nhạc
        paused={!isPlaying} // Điều khiển phát/tạm dừng
        onLoad={onLoad} // Gọi khi file được tải
        onProgress={(data:OnProgressData ) => {
          if ((!isSliding)  && Math.abs(data.currentTime - currentTime) > 0.4) { // Chỉ cập nhật nếu chênh lệch > 0.5s   
            setCurrentTime((data.currentTime));
           
          }
        }}
        style={styles.video}
        // onEnd={handleEnd}
        repeat={true} // Lặp lại video
      />
  );
};

const styles = StyleSheet.create({
  container: {

    alignItems: 'center',
    padding: 20,
  },
  video: {
    width: 0, // Không hiển thị video (chỉ phát âm thanh)
    height: 0,
  },
  text_info: {
    color: '#fff',
   
  }

});

export default memo(MusicPlayer);