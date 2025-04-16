import { View,Text,StyleSheet, Image,TouchableOpacity } from "react-native"
import { COLORS } from "../types/theme"
import { useSongStore } from "../store/songStore"
import React,{memo} from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Fontisto from 'react-native-vector-icons/Fontisto' 
import { useLyrics } from "../hooks/queries/useSong"
import { useSongActive } from "../hooks/setup/activeSong"
export const FloatingPlayer = React.memo(() =>{
    const {song,play,setPlay,setVisible,setStyles,setViewVisible} = useSongStore();
    const {setLyrics} =  useSongActive(song)
    const handlePlay = () => {
        setPlay(!play)
    }
    const handleShowVisible = () => {
        setVisible(true)
        // setStyles({justifyContent:'flex-end',margin:0})
        setLyrics();
        
    }   
  
    return song.id && (
        <>
        <TouchableOpacity style={styles.container} onPress={() =>handleShowVisible()}>
            
            <Image style={styles.img} source={{uri: song.image_cover}}/>
            <View style={styles.info}>
                <Text style={styles.text_primary}>{song.artist_name}</Text>
                <Text style={styles.text_primary}>{song.name}</Text>
            </View>
            <View style={styles.item_center}>
                <TouchableOpacity>
                    <AntDesign 
                        name="heart" 
                        size={24}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={handlePlay}>
                    {play ? <FontAwesome
                        name='pause'
                        size={24}
                        color='#fff'
                    />: <FontAwesome 
                        name="play"
                        size={24}
                        color="#fff"
                    />}
                </TouchableOpacity>
                
                <TouchableOpacity>
                    <Fontisto 
                        name="step-forward"
                        size={16}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
                
            </View>
        </TouchableOpacity>
        </>
        
    )
})
const styles = StyleSheet.create({
    container:{
        position: 'absolute',
        bottom: 60,  // Adjust this value if necessary to place the box right above the tab
        left: 0,
        right: 0,
        backgroundColor: COLORS.primaryDarkGreyHex,
        padding: 4,
        alignItems: 'center',
        flexDirection:'row',
        gap:12,
        paddingHorizontal:12,
        paddingVertical:4,
        zIndex: 10,  // Make sure the box is on top of other elements  
    },
    img:{
        width:52,
        height:52,
        resizeMode:'contain',
    },
    text_primary: {
        color:COLORS.primaryWhiteHex,
        fontSize:12
    },
    info:{
        flex:1,
    },
    item_center:{
        flexDirection:'row',
        alignItems:'center',
        gap:12,
    }
})