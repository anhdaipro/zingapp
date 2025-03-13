import { NativeStackNavigationProp  } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
export interface NavigativePros{
    navigation?: {
        navigate: any;
    };
    route?:{
    params:any,
    name:string
}
}

export interface StackProps{
    MainScreen:React.FC,

}



// Định nghĩa danh sách màn hình trong Stack Navigator
type RootStackParamList = {
  Home: undefined;
  Discovery:undefined
  Category: { name:string,slug:string }; // Details có tham số id
};

// Kiểu cho navigation
type NavigationType = NativeStackNavigationProp<RootStackParamList>;

// Kiểu cho route
type RouteType<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;

// Giao diện Props chuẩn cho React Navigation
export interface NavigativeProps<T extends keyof RootStackParamList> {
  navigation: NavigationType;
  route: RouteType<T>;
}