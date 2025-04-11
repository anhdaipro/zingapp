import {Alert, View,Text,StyleSheet,ActivityIndicator,FlatList,Dimensions, Image, TouchableHighlight,ScrollView} from "react-native"
import React,{useEffect,useState,useMemo,useRef,useLayoutEffect} from 'react'
import { useSongStore,Song } from "../store/songStore"
import { fetchArrSongApi } from "../api/song"
import { COLORS } from "../types/theme";
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Icon from "react-native-vector-icons/MaterialIcons"; // hoặc Feather
import { defaultTabs } from "../utils/data";
import LinearGradient from 'react-native-linear-gradient'
import { NavigativePros,NavigativeProps } from "../types/props";
import { useGenreStore } from "../store/genreStore";
import { Genre } from "../types/genre";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {HeaderTab} from "../components/Header";
import { useNavigation,useRoute } from "@react-navigation/native";
import { useShallow } from 'zustand/react/shallow'
import { useSongs,useStreaming,useTopSongs } from "../hooks/queries/useSong";
import { useGenre,useGenres } from "../hooks/queries/useCategory";
import { useSongActive } from "../hooks/setup/activeSong";
import SongItem from "../components/Song";
import CustomSlider  from "../components/CustomSlider";
const chunkSongs = (songs: Song[], chunkSize: number = 3) => {
    return songs.reduce((chunks, song, index) => {
      const chunkIndex = Math.floor(index / chunkSize);
      if (!chunks[chunkIndex]) {
        chunks[chunkIndex] = [];
      }
      chunks[chunkIndex].push(song);
      return chunks;
    }, [] as Song[][]);
  };
const screenWidth = Dimensions.get('window').width;//chiệu rộng màn hình
const itemWidth = screenWidth/1.5;
const itemWithView = screenWidth/3.5;
const itemWithLarge = screenWidth/2.5
export const DiscoveryScreen:React.FC= () =>{
  const {setSongPlay,song,tab_id,setTab} = useSongStore();
  const navigation = useNavigation<any>();
  const {fetchGenre}  = useGenreStore();
  const fetchSongs = useSongStore((state) => state.fetchSongs);
  const fetchGenres = useGenreStore((state) => state.fetchGenres);
  const {data:songs, isLoading:isLoadingSong} = useSongs();
  const {data:topsongs, isLoading:isLoadingTopSong} = useTopSongs();
  const {data:genres, isLoading:isLoadingGenres} = useGenres();
  if (isLoadingSong || isLoadingTopSong || isLoadingGenres) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const topsong = topsongs?.topsongs
  
 
  // useEffect(()=>{
  //   console.log("useEffect running...");
  //   if(isLoading){
  //     console.log(1)
  //     fetchSongs();
  //     fetchGenres()
  //   }
      
  // },[])
  // useLayoutEffect(() => {
   
  //     navigation.getParent().setOptions({
  //       headerShown: true, // Ẩn header khi ở màn hình "Category"
  //     });
    
  // }, [navigation, route.name]);
  const chunkedSongs = chunkSongs(songs)
  const lSongLast = songs.slice(6)
  
  const setFreshSong = async () => {
  }
  const changeScreem = async (item:Genre) =>{
    navigation.navigate('Category' ,{slug: item.slug, name: item.name});
  }
  return(
    <>
      <HeaderTab title='Khám phá' />
      
      <ScrollView contentContainerStyle={[styles.container,{paddingBottom: song.id ? 64 : 4}]}>
        
        <View style={styles.row_center}>
          <Text style={styles.title}>Gợi ý cho bạn xin chào việt nam </Text>
          <TouchableHighlight
            onPress={() => setFreshSong()}
            activeOpacity={0.6}
            underlayColor = {COLORS.textSecond}
            
          >
            <View 
            style={styles.button_fresh}
            >
              <Text style={{color:'#fff',fontSize:10}}>Làm mới</Text>
              <Ionicons
              name="refresh"
              size={12}
              color="#FFFFFF"
              />
            </View>
            
          </TouchableHighlight>
          
        </View>
        <View style={{gap:32}}>
          <View style={{flex:0}}>
            <FlatList
              data={chunkedSongs}
              horizontal
              contentContainerStyle={styles.scrollContainer}
              renderItem={({ item }) => (
                <View style={styles.column}>
                  {item.map((song) => (
                    <SongItem
                      key={song.id}
                      song={song}
                    />
                  ))}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          
          <View style={{gap:12}}>
            <View style={{ flexDirection: "row", gap:8,alignItems:'center'}}>
              <Text style={styles.title}>Nghe gần đây 100</Text>
              <AntDesign
                name="right"
                size={16}
                color={COLORS.secondaryLightGreyHex}
                />
            </View>
            <View style={{flex:0}}>
              <FlatList 
              data={genres}
              contentContainerStyle={[styles.scrollContainer]}
              horizontal
              renderItem={({ item }) => (
                <View style={[styles.item_view,{width:itemWithView}]} 
                  onStartShouldSetResponder={() => true}
                  onResponderRelease={() => changeScreem(item) }
                >
                    <Image style={styles.img} source={{uri: item.songs[0].image_cover}}/>
                    <View>
                    <Text style={styles.text_info}>{item.name}</Text>
                    </View>
                    
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
          <View style={{gap:12}}>
            <View style={{ flexDirection: "row",gap:8,alignItems:'center'}}>
              <Text style={styles.title}>Nghe gần đây</Text>
              <AntDesign
                name="right"
                size={16}
                color={COLORS.secondaryLightGreyHex}
                />
            </View>
            <View style={{flex:0}}>
              <FlatList 
              data={lSongLast}
              contentContainerStyle={[styles.scrollContainer]}
              horizontal
              renderItem={({ item }) => (
                <View style={[styles.item_view,{width:itemWithView}]}>
                    <Image style={styles.img} source={{uri: item.image_cover}}/>
                    <View>
                    <Text style={styles.text_info}>{item.name}</Text>
                    </View>
                    
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
          
          <View style={{gap:12}}>
            <View style={{ flexDirection: "row",gap:8,alignItems:'center'}}>
              <Text style={styles.title}>Có thể bạn muốn nghe</Text>
              <AntDesign
                name="right"
                size={16}
                color={COLORS.secondaryLightGreyHex}
                />
            </View>
            <View style={{flex:0}}>
              <FlatList 
              data={lSongLast}
              contentContainerStyle={[styles.scrollContainer]}
              horizontal
              renderItem={({ item }) => (
                <View style={[styles.item_view,{width:itemWithLarge}]}>
                    <Image style={styles.img_large} source={{uri: item.image_cover}}/>
                    <View>
                    <Text style={styles.text_info}>{item.name}</Text>
                    </View>
                    
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </View>
          <View style={{gap:12}}>
            <View style={{ flexDirection: "row",gap:8,alignItems:'center'}}>
              <Text style={styles.title}>Mới phát hành</Text>
              <AntDesign
                name="right"
                size={16}
                color={COLORS.secondaryLightGreyHex}
                />
            </View>
            <View style={styles.flex_center}>
              {defaultTabs.map((item)=>
                  <TouchableHighlight 
                  key={item.id} style={[styles.btn_tab,{backgroundColor: item.id == tab_id ? COLORS.primaryPurpage : COLORS.primaryBlackRGBA}]}
                  underlayColor={COLORS.primaryPurpage} // Màu nền khi nhấn
                  onPress={()=>setTab(item.id)}
                  >
                  <Text style={styles.text_info}>{item.name}</Text>
                </TouchableHighlight>
              )}
              
            </View>
            <View style={{flex:0}}>
            <FlatList
              data={chunkedSongs}
              horizontal
              contentContainerStyle={styles.scrollContainer}
              renderItem={({ item }) => (
                <View style={styles.column}>
                  {item.map((song) => (
                    <TouchableHighlight
                      onPress={() => setSongPlay(song)}
                      key={song.id}
                      activeOpacity={0.6}
                      underlayColor = {COLORS.textSecond}
                      style={styles.button}
                    >
                      <View  style={[styles.songItem,{ width: itemWidth }]}>
                      <Image style={styles.img_small} source={{uri: song.image_cover}}/>
                      <View style={styles.flex_1}>
                      <Text numberOfLines={2}  style={styles.text_info}>{song.name}</Text>
                      <Text  style={styles.text_info}>{song.artist_name}</Text>
                      </View>
                      
                      
                      <Icon name="more-vert" size={24} color={COLORS.primaryWhiteHex} /> 
                    </View>
                    
                    </TouchableHighlight>
                    
                  ))}
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
            </View>
          </View>
          <View>
            <LinearGradient
              start={{ x: 0.2, y: 0.2 }} // Bắt đầu từ trên
              end={{ x: 0.3, y: 0.6 }} // Kết thúc ở dưới
              locations={[0,0.4]}
              colors={['#170f23', COLORS.primaryBlackRGBA]}
              style={{// Gradient sẽ phủ toàn bộ màn hình
                borderRadius:12,
              }}
            >
              <View style={styles.column}>
                {topsong.map((song:Song) => (
                  <TouchableHighlight
                    onPress={() => setSongPlay(song)}
                    key={song.id}
                    activeOpacity={0.6}
                    underlayColor = {COLORS.textSecond}
                    style={[styles.button,{width:'100%'}]}
                  >
                    <View  style={[styles.songItem,]}>
                    <Image style={styles.img_small} source={{uri: song.image_cover}}/>
                    <View style={{flex:1}}>
                    <Text numberOfLines={2}  style={[styles.text_info]}>{song.name}</Text>
                    <Text  style={styles.text_info}>{song.artist_name}</Text>
                    </View>
                    
                    <Icon name="more-vert" size={24} color={COLORS.primaryWhiteHex} /> 
                  </View>
                  
                  </TouchableHighlight>
                  
                ))}
              </View>
              
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.text_info}>heloo</Text>
          </View>
          <CustomSlider/>
        </View>
        
      </ScrollView>
    </>
      
  )
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