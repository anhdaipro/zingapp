import { View,Text } from "react-native"
import { RoutePros } from "../types/props";

export const CategoryScreen : React.FC<RoutePros> = ({ route }) => {
    console.log(route)
    return (
        <View >
          <Text >Bạn chọn: {route?.params.name}</Text>
          <Text >Bạn chọn: {route?.params.title}</Text>
        </View>
      );
}