import { View, Text, TouchableOpacity, Image,StyleSheet } from "react-native"
import { COLORS } from "../types/theme";
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { iconList } from "../utils/data";
import AppIcon from "./AppIcon";
import { useSongStore } from "../store/songStore";
export const ActionSong = () => {
    const song = useSongStore(state=>state.song)
    return (
    <View style={styles.modalContent}>
    <View style={[styles.flex_row,styles.song_info]}>
        <View  style={[styles.songItem]}>
          <Image style={styles.img_small} source={{uri: song.image_cover}}/>
          <View style={styles.flex_1}>
              <Text numberOfLines={2}  style={styles.text_info}>{song.name}</Text>
              <View style={{flexDirection:'row', gap:4,alignItems:'center'}}>
                  <AntDesign
                  name='download'
                  size={12}
                  color={COLORS.primaryPurpage}
                  />
                  
                  <Text style={styles.text_info}>{song.artist_name}</Text>
              </View>
          </View>
      </View>
      <TouchableOpacity>
          <FontAwesome6
          name='share'
          size={24}
          color={'#fff'}
          />
      </TouchableOpacity>
    </View>
    <View style={styles.items}>
      {iconList.map(item=>
        <View key={item.title} style={styles.item}>
          <AppIcon 
            icon={item.icon}
            name={item.name}
          />
          <Text style={styles.text_info}>{item.title}</Text>
        </View>
      )}
    </View>
  </View>
  );
}
const styles = StyleSheet.create({
    flex_1:{
        flex:1
    },
    items:{
      gap:12
    },
    item:{
      gap:12,
      flexDirection:'row',
        alignItems:'center',
    },
    flex_row:{
        flexDirection:'row',
        alignItems:'center',
        width:'100%'
    },
    song_info:{
        paddingBottom:12,
        borderBottomWidth:0.5,
        borderColor:'#fff'
    },
    modal: {
        justifyContent: "flex-end", // Đưa modal xuống dưới cùng
        margin: 0, // Loại bỏ khoảng cách xung quanh
    },
    modalContent: {
      padding: 20,
      backgroundColor: COLORS.primaryGreyHex,
      borderRadius: 10,
      gap:12,
     
    },
     songItem: {
        alignItems: 'center',
        flexDirection:'row',
        paddingHorizontal:6,
        paddingVertical: 6,
        borderRadius: 20,
        gap:12,
        flex:1
      },
      img_small:{
        width:40,
        height:40,
        borderRadius:4,
        resizeMode:'contain',
      },
      button:{
        borderRadius:4
      },
      text_info:{
        color:COLORS.primaryWhiteHex,
          
      },
  });