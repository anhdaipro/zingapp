import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {Text,Alert,View, StyleSheet, TouchableOpacity} from 'react-native'
import { COLORS } from '../types/theme';
import { IndividualScreen } from '../screens/IndividualScreen';
import { DiscoveryScreen } from '../screens/DiscoveryScreen';
import { ZingChart } from '../screens/ZingChart';
import { RadioScreen } from '../screens/RadioScreen';
import { LibraryScreen } from '../screens/LibraryScreen';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Thay đổi tên Icon theo bộ bạn chọn
import { FloatingPlayer } from '../components/FloatingPlayer';
import {ModalContainer}  from '../components/Modal';
import { CategoryScreen } from '../screens/CategoryScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSongStore } from '../store/songStore';
import { setupPlayer } from '../hooks/setup/trackPlay';
import useVideoPlayer from '../service/playbackService';
import MusicPlayer from '../components/Player';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const createStack = (MainScreen:React.FC<any>) => {
  return function StackNavigator() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Category" component={CategoryScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    );
  }
 };
 // Tạo từng Stack sử dụng hàm chung
const Tab1Stack = createStack(LibraryScreen);
const Tab2Stack = createStack(DiscoveryScreen);
const Tab3Stack = createStack(ZingChart);
const Tab4Stack = createStack(RadioScreen);
const Tab5Stack = createStack(IndividualScreen);
export const TabNavigator: React.FC<any>  = ({navigation,route}) => {
  const {song,play:playIng} = useSongStore()
  const {play,pause} = useVideoPlayer()
  // useEffect(() => {
  //   const init = async () => {
  //     await setupPlayer()
  //     if(song.id){
  //       await TrackPlayer.add([
  //         {
  //           id: song.id,
  //           url: song.file,
  //           title: song.name,
  //           artist: song.artist_name,
  //           artwork: song.image_cover,
  //         },
  //       ])
  //     }
  //   };
  //   init();
  //   return () => {
  //     TrackPlayer.reset(); // Dọn dẹp khi component unmount
  //   };
  // }, [song.file]);
  useEffect(() => {
    if (playIng && song.file) {
      play();
    } else {
      pause();
    }
  }, [playIng, play, pause,song.file]);
  
  return (
    <>
    <Tab.Navigator
      screenOptions={{
      headerStyle: { backgroundColor: COLORS.primaryBlackRGBA , elevation: 0,},
      tabBarActiveTintColor: COLORS.primaryPurpage, // Màu khi tab được chọn (active)
      tabBarInactiveTintColor: COLORS.textSecond, // Màu khi tab không được chọn (inactive)
      headerShown: false ,
      tabBarLabelStyle: {
        fontSize: 12, // Kích thước chữ
      },
      tabBarStyle: {
        paddingBottom: 10, // Padding dưới cho Tab Bar
        paddingTop: 5, // Padding trên cho Tab Bar
        height: 60, // Chiều cao của Tab Bar
        backgroundColor: COLORS.primaryBlackRGBA, // Nền xanh dương
        elevation: 1, // Tạo bóng đổ cho Android
      },
      headerTintColor: '#FFFFFF', // Chữ trắng
      headerTitleStyle: { fontWeight: 'bold', fontSize: 24 }, // Tùy c
      headerLeft: ()=>(
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.header_right}>
          <TouchableOpacity>
            <FontAwesome
              name="microphone"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 15 }}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome
              name="search"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 15 }}
              
            />
          </TouchableOpacity>
          
        </View>
        
      ),
      
    }}
    >
      <Tab.Screen name="Library" 
      component={Tab1Stack} 
      options={{
        title:'Thư viện',
        headerShown: true ,
        tabBarPosition: 'bottom',
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name='my-library-music' size={size} color={color} />
        ),
        
      }}
      />
      <Tab.Screen name="Discovery" component={Tab2Stack} 
      
      options={{
        tabBarPosition: 'bottom',
        title: 'Khám phá',
        
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name='radio-button-checked' size={size} color={color} />
        ),
      }}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          e.preventDefault(); // Ngăn không cho Tab tự động chuyển
          navigation.navigate('Discovery',{screen:'Main'}); // Chuyển đến màn hình Settings
        }
      })}
      />
      <Tab.Screen name="Zingchart" component={Tab3Stack} 
      options={{
        
        tabBarPosition: 'bottom',
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <FontAwesome name='line-chart' size={size} color={color} />
        ),
      }}
      />
      <Tab.Screen name="Radio" component={Tab4Stack} 
      options={{
        tabBarPosition: 'bottom',
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <Feather name='radio' size={size} color={color} />
        ),
      }}
      />
      <Tab.Screen name="Individual" component={Tab5Stack} 
      options={{
        title: 'Cá nhân',
        tabBarPosition: 'bottom',
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <AntDesign name='user' size={size} color={color} />
        ),
      }}
      />
    </Tab.Navigator>
    <ModalContainer/>
    <FloatingPlayer/>
    <MusicPlayer url={song.file}/>
    </>
  );
}
const styles = StyleSheet.create({
  header_right: {
    gap:12,
    flexDirection:'row',
  },
  items:{
    flexDirection:'row',
    paddingHorizontal:10,
  },
  img_item:{
    flex:1,
    resizeMode:'contain',
    
  },
  item_end: {
    alignSelf:'flex-end'
  },
  text_white:{
    color:'#fff',
    fontSize:14,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    gap:20,
  },
  img:{
    width:'60%',
    resizeMode:'contain',
    marginTop:'-20%',
    marginBottom:'-20%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button:{ 
    paddingVertical: 12, // Tương đương top và bottom
    paddingHorizontal: 8, // Tương đương left và right
    borderRadius:12,
    width:'100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
  },
  linkText: {
    fontSize: 16,
    color: '#333',
  },
  link: {
    color: '#1E90FF',
    textDecorationLine: 'underline',
  },
});