import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import styles from "../../assets/styles/auth.styles.js";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext.jsx";
import { useState } from "react";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone || !password) {
      return setError("Vui lòng nhập đầy đủ thông tin!");
    }

    setError("");
    setLoading(true);

    try {
      await login(phone, password);
      console.log("Login thành công");
      router.replace("/(tabs)");
    } catch (error) {
      // Nhận đúng message từ service
      setError(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };
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
              onChangeText={setPhone}
              placeholderTextColor="#9EA1AE"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              onChangeText={setPassword}
              placeholderTextColor="#9EA1AE"
            />
          </View>
        </View>
        {error ? (
          <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
        ) : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            disabled={loading}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;
