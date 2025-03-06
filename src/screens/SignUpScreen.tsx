import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert,TouchableOpacity,Platform, Image,ScrollView ,KeyboardAvoidingView} from 'react-native';
import { useAuthStore } from '../store/authStore';
import LinearGradient from 'react-native-linear-gradient';
interface Props {
  navigation?: {
    navigate: (screen: string) => void;
  };
}
const SignupScreen: React.FC<Props> = ({navigation}) => {
  const { name, email, password, setName, setEmail, setPassword } = useAuthStore();

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
    } else {
      Alert.alert('Thành công', `Đăng ký thành công cho: ${name}`);
    }
  };
  const handleNavigateToLogin = () => {
    if(navigation){
      navigation.navigate('Login');
    }
  };
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Điều chỉnh offset nếu cần
    >
   <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
      <Image style={styles.img} source={require('../assets/logo.png')}/>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <LinearGradient
        colors={['rgba(212, 121, 227, 1)', 'rgba(120, 85, 132, 1)']} // Các màu gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        locations={[0, 1]}
        style={styles.button}
        >
      <TouchableOpacity onPress={handleSignup} >
        <Text style={styles.text}>Đăng ký</Text>
      </TouchableOpacity>
      </LinearGradient>
      <Text style={styles.linkText}>
        Bạn đã có tài khoản?{' '}
        <Text style={styles.link} onPress={handleNavigateToLogin}>
          Hãy đăng nhập
        </Text>
      </Text>
      
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems:'center',
    paddingHorizontal: 42,
    gap:20,
  },
  img:{
    width:'60%',
    resizeMode:'contain',
    marginTop:'-20%',
    marginBottom:'-20%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text:{
    color:'#fff',
    textAlign:'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  button:{ 
    paddingVertical: 12, // Tương đương top và bottom
    paddingHorizontal: 8, // Tương đương left và right
    borderRadius:12,
    width:'100%',
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

export default SignupScreen;
