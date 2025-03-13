import React from 'react';
import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation,useRoute } from '@react-navigation/native';
import { COLORS } from '../types/theme';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"; // hoặc Feather
interface HeaderTabProps{
 title:string;
}
interface HeaderProps extends HeaderTabProps{
    headerLeft:React.FC;
    headerRigth:React.FC;
    headerCenter:React.FC
    headerShow : boolean;
}
export const Header: React.FC<HeaderProps> = ({title, headerLeft:Left,headerCenter:Center, headerRigth:Right, headerShow}) =>{
    const navigation = useNavigation();
    return (
        <View style={container_1}>
        <View style={styles.header_left}>
                <Left/>
        </View>
        <View style={styles.header_center}>
            <Center/>
        </View>
        <View style={styles.header_right}>
            <Right/>
            
            </View>
    </View>
    )
}
export const HeaderTab:React.FC<HeaderTabProps> = ({ title }) => {
  const navigation = useNavigation();
    const route = useRoute()
  return (
    <View style={styles.container}>
        <View style={styles.header_left}>
            {/* <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity> */}
            <Text style={{ fontSize: 24, fontWeight: 'bold',color:'#fff' }}>{title}</Text>
        </View>
        <View style={styles.header_right}>
            <TouchableOpacity>
                <FontAwesome
                name="microphone"
                size={20}
                color="#FFFFFF"
                />
            </TouchableOpacity>
            <TouchableOpacity>
                <FontAwesome
                name="search"
                size={20}
                color="#FFFFFF"
                
                />
            </TouchableOpacity>
            
            </View>
    </View>
  );
};
const styles = StyleSheet.create({
    container:{
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent:'space-between',
        paddingVertical:12,
        paddingHorizontal:20,
        backgroundColor:COLORS.primaryBlackRGBA,
        elevation: 3,
    },
    
    header_left:{
        flexDirection: 'row', 
        alignItems: 'center', 
        gap:12,
    },
    header_right: {
        gap:20,
        flexDirection:'row',
    },
    header_center:{
        gap:12,
        flexDirection:'row',
    }
})
const container_1 = {
    ...styles.container,
    paddingVertical:8,
}
