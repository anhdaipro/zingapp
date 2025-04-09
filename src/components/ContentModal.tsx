import { useSongStore } from "../store/songStore"
import { ActionSong } from "./ActionSong"
import { SongPlayer } from "./SongPlayer"
import { View, Text, TouchableOpacity, Image } from "react-native"
export const ContentModal = () => {     
    const {song,visible,setVisible,stylesModal,viewVisible} = useSongStore()
    if(viewVisible == 2){
        return (<SongPlayer/>)
    }
    return (
        <ActionSong/>
    )
}