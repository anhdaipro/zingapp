import React,{useRef,memo,useCallback} from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import Video,{OnProgressData } from 'react-native-video';
import useVideoPlayer from '../service/playbackService'; // Đường dẫn đến file playbackService.ts
import { useSongStore } from '../store/songStore';
import { useShallow } from 'zustand/shallow';
import { runOnJS } from 'react-native-reanimated';

const MusicPlayer: React.FC = () => {
  const {
    onLoad,
  } = useVideoPlayer();
  const {play:isPlaying,videoRef,song} = useSongStore(useShallow((state) => ({
    play: state.play,
    song: state.song,
    videoRef: state.videoRef,
  })));
  if(!song.file){
    return <View>
      <Text style={styles.text_info}>Không có bài hát nào đang phát</Text>
      <Text style={styles.text_info}>Vui lòng chọn một bài hát để phát</Text>
    </View>
  }
  return (
      <Video
        ref={videoRef}
        source={{ uri: song.file }} // Đường dẫn đến file nhạc
        paused={!isPlaying} // Điều khiển phát/tạm dừng
        onLoad={onLoad} // Gọi khi file được tải
        progressUpdateInterval={1000}
        // onProgress={(data:OnProgressData ) => {
        //   const now = Date.now();
        //   if (now - lastUpdate.current < 500) return; // Chỉ cập nhật mỗi 500ms
        //   if ((!isSliding)  && Math.abs(data.currentTime - currentTime) > 0.4) { // Chỉ cập nhật nếu chênh lệch > 0.5s   
        //     // runOnJS(setCurrentTime)(data.currentTime);
        //     lastUpdate.current = now;
        //   }
        // }}
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