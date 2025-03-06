import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Image } from 'react-native';
import { useAuthStore } from '../store/authStore';
import LinearGradient from 'react-native-linear-gradient';
interface LoginProps {
  navigation?: {
    navigate: any;
  };
}

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
  const { email, password, setEmail, setPassword, reset } = useAuthStore();

  const handleLogin = (): void => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    Alert.alert('Đăng nhập thành công!', `Email: ${email}`);
    reset(); // Xóa trạng thái sau khi đăng nhập (tuỳ chọn)
  };
  const handleHome = () => {
    if (navigation) {
      console.log(navigation)
    navigation.navigate('Home',{screen: 'Library'});
    }
  }
  const handleNavigateToSignUp = (): void => {
    if (navigation) {
      navigation.navigate('Signup');
    } else {
      Alert.alert('Chuyển đến màn hình đăng ký!');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../assets/logo.png')}/>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.item_end} onPress={handleHome}>
        <Text>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <LinearGradient
        colors={['rgba(212, 121, 227, 1)', 'rgba(120, 85, 132, 1)']} // Các màu gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 1]}
        style={styles.button}
        >
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>
      </LinearGradient>
      <Text>Tiếp tục với</Text>
      <View style={styles.items}>
        <Image style={styles.img_item} source={require('../assets/icons_google.png')}/>
        <Image style={styles.img_item} source={require('../assets/icons_apple.png')}/>
        <Image style={styles.img_item} source={require('../assets/icons_facebook.png')}/>
      </View>
      <Text style={styles.linkText}>
        Bạn chưa có tài khoản?{' '}
        <Text style={styles.link} onPress={handleNavigateToSignUp}>
          Hãy đăng ký
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default LoginScreen;
