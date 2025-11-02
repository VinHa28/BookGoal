import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import BackHeader from "../../../components/BackHeader";
import colors from "../../../constants/colors";
import { changePassword } from "../../../services/authServices";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword)
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");

    if (newPassword !== confirmPassword)
      return Alert.alert("Lỗi", "Mật khẩu mới không trùng khớp");

    setLoading(true);
    try {
      const res = await changePassword(oldPassword, newPassword);
      Alert.alert("Thành công", res.message || "Đổi mật khẩu thành công 🎉");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackHeader title="Đổi mật khẩu" />

      <View style={styles.content}>
        <Text style={styles.title}>Thay đổi mật khẩu của bạn</Text>
        <Text style={styles.subtitle}>
          Vui lòng nhập mật khẩu cũ và mật khẩu mới
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu hiện tại</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Nhập mật khẩu cũ"
            placeholderTextColor="#9EA1AE"
            value={oldPassword}
            onChangeText={setOldPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor="#9EA1AE"
            value={newPassword}
            onChangeText={setNewPassword}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Xác nhận mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Nhập lại mật khẩu mới"
            placeholderTextColor="#9EA1AE"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Đang xử lý..." : "XÁC NHẬN ĐỔI MẬT KHẨU"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 24,
    marginTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#8C8CA1",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#000",
  },
  button: {
    height: 60,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ChangePassword;
