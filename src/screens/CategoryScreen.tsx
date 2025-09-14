import { View,Text, ScrollView, StyleSheet,ActivityIndicator,TouchableOpacity, Image,FlatList,TouchableHighlight } from "react-native"
import { NavigativeProps } from "../types/props";
import { COLORS } from "../types/theme";
import { useSongStore } from "../store/songStore";
import { useEffect,useState,useLayoutEffect  } from "react";
import { useGenreStore } from "../store/genreStore";
import { HeaderTab, Header } from "../components/Header";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // hoặc Feather
import { useNavigation,useRoute } from "@react-navigation/native";
import { useGenre } from "../hooks/queries/useCategory";
import { useShallow } from "zustand/react/shallow";
const HeaderLeft  = () =>{
  const navigation = useNavigation<any>()
  return (
    <>
    <TouchableOpacity onPress={() => navigation.navigate('Discovery',{screen:'Main'})} style={{ marginRight: 10 }}>
        <Icon name="arrow-back" size={20} color="#fff" />
    </TouchableOpacity>
    </>
  )
}
const HeaderRight = () =>{
  return(
    <>
    <MaterialIcons name="more-vert" size={20} color={COLORS.primaryWhiteHex} /> 
    </>
  )
}
const HeaderCenter = () =>{
  return <></>
}
export const CategoryScreen : React.FC = () => {
    const navigation = useNavigation<any>();
    const route = useRoute<any>()
    const param = route.params.slug
    const {setSongPlay,song} = useSongStore(useShallow((state) => ({
      setSongPlay: state.setSongPlay,
      song: state.song,
    })));
    const {data:genre, isLoading} = useGenre(param)
    // useEffect(()=>{
    //   if(route?.params.slug){
    //     fetchGenre(route?.params.slug)
    //   }
    // },[route?.params.slug])
    // useLayoutEffect(() => {
    //   if(route.name == 'Category'){
    //     navigation.getParent().setOptions({
    //       headerShown: false, // Ẩn header khi ở màn hình "Category"
    //     });
    //   }else{
    //     navigation.getParent().setOptions({
    //       headerShown: true, // Ẩn header khi ở màn hình "Category"
    //     });
    //   }
      
    // }, [navigation, route.name]);
    if(!genre){
      return (
        <View style={{backgroundColor:COLORS.primaryBlackRGBA,flex:1}}>
          <ActivityIndicator size="large" color='#fff' style={{paddingTop:20}} />
      </View>
      )
    }
    const image_genre = genre.songs[0].image_cover
    const songs = genre.songs
    return (
      <>
        <Header
          headerLeft={HeaderLeft}
          headerRigth={HeaderRight}
          headerCenter={HeaderCenter}
          title=''
          headerShow={true}
        />
       
        <View style={{flex:1}}>
          <FlatList
            contentContainerStyle={[styles.container,{paddingBottom: song.id ? 64 : 4}]}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={{ alignItems: 'center', gap: 16 }}>
                <Image source={{ uri: image_genre }} style={styles.img_large} />
                <View style={{ gap: 4 }}>
                  <Text style={[styles.title, styles.text_center]}>Top 100 {route?.params.name} hay nhất</Text>
                  <Text style={[styles.text_info, styles.text_center]}>Zingmp3</Text>
                  <Text style={[styles.text_info, styles.text_center]}>Zingmp3</Text>
                </View>
              </View>
            }
            data={songs}
            renderItem={({ item }) => (
              <View style={styles.column}>
                <TouchableHighlight
                  activeOpacity={0.6}
                  underlayColor = {COLORS.textSecond}
                  style={styles.button}
                  onPress={() => setSongPlay(item)}
                >
                  <View  style={[styles.songItem,{ width: '100%' }]}>
                  <Image style={styles.img_small} source={{uri: item.image_cover}}/>
                  <View style={styles.flex_1}>
                  <Text numberOfLines={2}  style={styles.text_info}>{item.name}</Text>
                  <Text  style={styles.text_info}>{item.artist_name}</Text>
                  </View>
                  
                  <TouchableOpacity>
                    <MaterialIcons name="more-vert" size={24} color={COLORS.primaryWhiteHex} /> 
                  </TouchableOpacity>
                </View>
                
                </TouchableHighlight>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </>
    );
}
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
      width:200,
      height:200,
      borderRadius:8,
      resizeMode:'contain',
    },
    text_info:{
      color:COLORS.primaryWhiteHex,
    },
    text_center:{
      textAlign:'center'
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