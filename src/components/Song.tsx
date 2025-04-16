import React from 'react';
import { TouchableHighlight, Text,View,Image,StyleSheet,Dimensions } from 'react-native';
import { useSongActive } from '../hooks/setup/activeSong';
import { COLORS } from '../types/theme';
import Icon from "react-native-vector-icons/MaterialIcons"; // hoặc Feather
import { Song } from '../types/song';
const screenWidth = Dimensions.get('window').width;//chiệu rộng màn hình
// const itemWidth = screenWidth/1.5;
export const SongItem: React.FC<{song:Song,itemWidth:any}> = ({ song,itemWidth }) => {
  const { setSongActive } = useSongActive(song);
  const handlePress = () => {
    setSongActive();
  };

  return (
    <TouchableHighlight
        onPress={() => {
            handlePress();
        }}
        key={song.id}
        activeOpacity={0.6}
        underlayColor = {COLORS.textSecond}
        style={styles.button}
    >
        <View  style={[styles.songItem,{ width: itemWidth }]}>
        <Image style={styles.img_small} source={{uri: song.image_cover}}/>
        <View style={styles.flex_1}>
        <Text numberOfLines={1}  style={styles.text_info}>{song.name}</Text>
        <Text  style={styles.text_info}>{song.artist_name}</Text>
        </View>
        <Icon name="more-vert" size={24} color={COLORS.primaryWhiteHex} /> 
        </View>
    </TouchableHighlight>
  );
};
const styles = StyleSheet.create({
    flex_1:{
      flex:1
    },
    flex_center:{
      flexDirection:'row',
      alignItems:'center',
      gap:12,
    },
    boxContainer: {
      position: 'absolute',
      bottom: 0,  // Adjust this value if necessary to place the box right above the tab
      left: 0,
      right: 0,
      backgroundColor: COLORS.primaryBlackRGBA,
      padding: 15,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,  // Make sure the box is on top of other elements
    },
    boxText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    row_center:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      
    },
    container: {
        flexGrow: 1,
        backgroundColor:COLORS.primaryBlackRGBA,
        padding:20,
        gap:20,
        
      },
      scrollContainer: {
        flexGrow: 1,
        gap:12,
      },
      column: {
        flexDirection: 'column', // Các phần tử trong mỗi cột sắp xếp theo chiều dọc
        gap: 12,
        alignItems:'flex-start',
        justifyContent:'flex-start',
      },
      item_view:{
        gap: 8,
        flexDirection:'column',
        alignItems:'flex-start',
        justifyContent:'flex-start',
      },
      button_fresh:{
        flexDirection:'row',
        alignItems:'center',
        gap:4,
        borderWidth:1,
        borderColor:COLORS.primaryWhiteHex,
        borderRadius:8,
        paddingHorizontal:8,
        paddingVertical:4
      },
      songItem: {
        alignItems: 'center',
        flexDirection:'row',
        paddingHorizontal:6,
        paddingVertical: 6,
        borderRadius: 20,
        gap:12,
      },
      button:{
        borderRadius:4
      },
      img_small:{
        width:40,
        height:40,
        borderRadius:4,
        resizeMode:'contain',
      },
      img:{
        width:100,
        height:100,
        borderRadius:6,
        resizeMode:'contain',
      },
      img_large:{
        width:160,
        height:160,
        borderRadius:8,
        resizeMode:'contain',
      },
      text_info:{
        color:COLORS.primaryWhiteHex,
        
      },
      title:{
        color:COLORS.primaryWhiteHex,
        fontSize:20,
        fontWeight:600
      },
      btn_tab:{
        paddingHorizontal:16,
        paddingVertical:4,
        borderRadius:12,
        borderWidth:1,
        borderColor:COLORS.primaryGreyHex
      }
  })
export default SongItem;
