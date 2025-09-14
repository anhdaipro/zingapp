import {View, Text, StyleSheet, TouchableOpacity,Image, Animated} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS } from "../types/theme";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Thay đổi tên Icon theo bộ bạn chọn
import { useSongStore } from '../store/songStore';
import { useShallow } from 'zustand/shallow';
import React,{useEffect, useState} from 'react';
export const PlayerControls = React.memo(() => { 
     const{play, setPlay} = useSongStore(useShallow((state) => ({
        play:state.play,
        setPlay:state.setPlay
      }))
    );   
    const handlePlay = () => {
        setPlay(!play) // Đảo ngược trạng thái phát/tạm dừng    
    }  
    const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(prevCount => prevCount + 1);
    }, 4000);

    return () => clearInterval(intervalId); // Cleanup function
  }, []); // Empty dependency array to run only once on mount
    return (
    <View style={[styles.container]}>
        <View>
            <Text>{count}</Text>
        </View>
        <View style={styles.row}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePlay()}>
                <Ionicons 
                    name='shuffle'
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePlay()}>
                <Ionicons 
                    name='play-skip-back'
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePlay()}>
                <Ionicons 
                    name={!play ? 'play' : 'pause'}
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePlay()}>
                <Ionicons 
                    name='play-skip-forward'
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePlay()}>
                <Ionicons 
                    name='repeat'   
                    size={30}
                    color={COLORS.primaryWhiteHex}
                />
            </TouchableOpacity>
        </View>
    </View>
    )
})

const styles = StyleSheet.create({
	container: {
		width: '100%',
        paddingHorizontal:24,
        marginTop:24
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
})