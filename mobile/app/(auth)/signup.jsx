import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import styles from "../../assets/styles/auth.styles.js";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signUp } from "../../services/authServices.js";

const Signup = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const phoneRegex = /^(0|\+84)[1-9]\d{8,9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSigup = async () => {
    if (!fullName || !email || !phone || !password)
      return setError("Vui lòng nhập đầy đủ thông tin");

    if (!emailRegex.test(email.trim())) return setError("Email không hợp lệ");

    if (!phoneRegex.test(phone.trim()))
      return setError("Số điện thoại không hợp lệ");

    setError("");
    setLoading(true);

    try {
      const res = await signUp(
        fullName.trim(),
        email.trim(),
        phone.trim(),
        password
      );
      Alert.alert(
        "Đăng ký thành công",
        "Vui lòng kiểm tra email để lấy mã OTP xác thực.",
        [
          {
            text: "OK",
            onPress: () =>
              router.push({
                pathname: "/(auth)/verifyEmail",
                params: { email: email.trim() },
              }),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Đăng ký thất bại");
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
              placeholder="Nhập họ và tên"
              onChangeText={setFullName}
              value={fullName}
              placeholderTextColor="#9EA1AE"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập email"
              keyboardType="email-address"
              onChangeText={setEmail}
              value={email}
              placeholderTextColor="#9EA1AE"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              onChangeText={setPhone}
              value={phone}
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
              value={password}
              placeholderTextColor="#9EA1AE"
            />
          </View>

          {error ? (
            <Text style={{ color: "red", marginTop: 10 }}>{error}</Text>
          ) : null}
        </View>

        <View style={styles.buttonSignup}>
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
