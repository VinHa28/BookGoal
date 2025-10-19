import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import styles from "../../assets/styles/auth.styles.js";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signUp } from "../../services/authServices.js";

const Signup = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSigup = async () => {
    if (!fullName || !phone || !password) {
      return setError("Vui lòng nhập đầy đủ thông tin");
    }

    setError("");
    setLoading(true);

    try {
      const res = await signUp(fullName, phone, password);
      Alert.alert("Thành công", res.data.message || "Đăng ký thành công", [
        { text: "OK", onPress: () => router.push("/(auth)") },
      ]);
    } catch (error) {
      // Lấy message từ backend (do bạn đã ném { message } trong service)
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Xin chào!</Text>
        <Text style={styles.subtitle}>Tạo tài khoản mới</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText} onPress={() => router.back()}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={styles.tabTextActive}>Đăng ký</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View>
          <Text style={styles.formTitle}>Tạo tài khoản của bạn</Text>
          <Text style={styles.formSubtitle}>
            Hãy đảm bảo tài khoản của bạn được bảo mật
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập tên"
              keyboardType="name"
              placeholderTextColor="#9EA1AE"
              onChangeText={setFullName}
            />
          </View>

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
          {error ? (
            <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            disabled={loading}
            onPress={handleSigup}
          >
            <Text style={styles.buttonText}>
              {loading ? "Đang xử lý..." : "Đăng ký"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;
