import { View, Text,ScrollView,StyleSheet,Image } from "react-native"
import { useSongStore } from "../store/songStore"
import { LinearGradientProps,LinearGradient } from "react-native-linear-gradient";
export const SongInfo:React.FC = () =>{
    const song = useSongStore(state=>state.song);

    return (
        <View style={styles.container}>

        <LinearGradient
        colors={['#3A3B3F', '#1E1F23', '#121316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.box}
      >
        <View style={styles.flex_row}>
            <Image
            source={{ uri: song.image_cover }}
            style={styles.image}
            />
            <View style={styles.textContainer}>
            <Text style={styles.title}>{song.name}</Text>
            <Text style={styles.artist}>{song.artist_name}</Text>
            <Text style={styles.info}>2,2M ❤️   104M 🎧</Text>
            </View>
        </View>
        <View>
            <View style={styles.flex_info}>
                <Text style={styles.label}>Album</Text>
                <Text style={styles.text_info}>Chẳng Thể Tìm Được Em (Single)</Text>
            </View>
            <View style={styles.flex_info}>
                <Text style={styles.label}>Thể loại</Text>
                <Text style={styles.text_info}>Việt Nam, R&B Việt</Text>
            </View>
            <View style={styles.flex_info}>
                <Text style={styles.label}>Phát hành</Text>
                <Text style={styles.text_info}>25/11/2020</Text>
            </View>
            <View style={styles.flex_info}>
                <Text style={styles.label}>Cung cấp</Text>
                <Text style={styles.text_info}>DAO Music Entertainment</Text>
            </View>
        </View>
      </LinearGradient>
      </View>
    )
}
const styles = StyleSheet.create({
    container:{
        
        width:'100%',
        paddingHorizontal:24
    },
    box: {
        borderRadius: 16,
        padding: 12,
        borderWidth: 1,
        gap:16,
      },
      flex_row:{
        flexDirection:'row',
        gap:8,
        alignItems:'center',
        borderBottomWidth: 1,
        borderColor:'#fff',
        paddingBottom:16,
      },
      flex_info:{
        flexDirection:'row',
        gap:8,
        alignItems:'center',
        paddingBottom:16,
      },
      image: {
        width: 80,
        height: 80,
        borderRadius: 8,
      },
      textContainer: {
        marginLeft: 12,
        flex: 1,
        gap:8,
      },
      title: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
      artist: {
        color: '#bbb',
      },
      info: {
        color: '#888',
      },
      text_info:{
        color:'#fff',
      },
      label: {
        color: '#aaa',
        fontSize: 14,
       
        width: 80,
      },
})