import React from 'react';
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
import { ModalContainer } from '../components/Modal';
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const TabNavigator = () => {
  return (
    <>
    <Tab.Navigator
      screenOptions={{
      headerStyle: { backgroundColor: COLORS.primaryBlackRGBA , elevation: 0,},
      tabBarActiveTintColor: COLORS.primaryPurpage, // Màu khi tab được chọn (active)
      tabBarInactiveTintColor: COLORS.textSecond, // Màu khi tab không được chọn (inactive)
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
      component={LibraryScreen} 
      options={{
        
        title:'Thư viện',
        tabBarPosition: 'bottom',
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name='my-library-music' size={size} color={color} />
        ),
        
      }}
      />
      <Tab.Screen name="Discovery" component={DiscoveryScreen} 
      options={{
        tabBarPosition: 'bottom',
        title: 'Khám phá',
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialIcons name='radio-button-checked' size={size} color={color} />
        ),
      }}
      />
      <Tab.Screen name="Zingchart" component={ZingChart} 
      options={{
        
        tabBarPosition: 'bottom',
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <FontAwesome name='line-chart' size={size} color={color} />
        ),
      }}
      />
      <Tab.Screen name="Radio" component={RadioScreen} 
      options={{
        tabBarPosition: 'bottom',
        tabBarLabelPosition: 'below-icon',
        tabBarIcon: ({ focused, color, size }) => (
          <Feather name='radio' size={size} color={color} />
        ),
      }}
      />
      <Tab.Screen name="Individual" component={IndividualScreen} 
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
    <FloatingPlayer/>
    <ModalContainer/>
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