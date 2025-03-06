import { View,ScrollView,Text,StyleSheet } from "react-native"
import { COLORS } from "../types/theme"

export const LibraryScreen = () =>{
    return (
        
            <View style={styles.container}>
                <Text>Ok</Text>
            </View>
        
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:COLORS.primaryBlackRGBA
      },
      scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems:'center',
        paddingHorizontal: 42,
        gap:20,
      },
})