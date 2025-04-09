import { View } from "react-native"
import { useSongStore } from "../store/songStore"

export const IndividualScreen:React.FC = () =>{
    const {component} = useSongStore()
   
    return (
        <View></View>
    )
}