import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignupScreen from './src/screens/SignUpScreen';
import LoginScreen from './src/screens/LoginScreen';
import { TabNavigator } from './src/navigation/TabNavigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
    <NavigationContainer>
      {/* Bọc trong Provider để chia sẻ dữ liệu toàn cục (nếu có sử dụng context) */}
      
        {/* SafeAreaView giúp ứng dụng tránh bị che khuất bởi notch hoặc các yếu tố trên màn hình */}
        <SafeAreaView style={{ flex: 1 }}>
          {/* Định nghĩa các màn hình với Stack Navigator */}
          <Stack.Navigator>
          <Stack.Screen name="Home" component={TabNavigator} 
            options={{headerShown:false}}
            />
            <Stack.Screen name="Signup" component={SignupScreen} 
            options={{title:'Đăng ký'}}
            />
            <Stack.Screen name="Login" component={LoginScreen} 
            options={{title:'Đăng nhập'}}
            />
           
          </Stack.Navigator>
        </SafeAreaView>
    </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;