import { View, Text, TouchableOpacity, TextInput } from "react-native";
import styles from "../../assets/styles/auth.styles.js";
import { useRouter } from "expo-router";

const Login = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Xin chào!</Text>
        <Text style={styles.subtitle}>Chào mừng bạn trở lại</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={styles.tabTextActive}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(auth)/signup")}
          style={styles.tab}
        >
          <Text style={styles.tabText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View>
          <Text style={styles.formTitle}>Đăng nhập</Text>
          <Text style={styles.formSubtitle}>
            Chắc chắn rằng bạn đã có tài khoản
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              keyboardType="phone"
              placeholderTextColor="#9EA1AE"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              placeholderTextColor="#9EA1AE"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
