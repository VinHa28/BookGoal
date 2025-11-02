import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import styles from "../../assets/styles/auth.styles.js";
import api from "../../config/api";

const VerifyEmail = () => {
  const { email } = useLocalSearchParams(); // nhận email từ signup
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async () => {
    if (!otp.trim()) return Alert.alert("Lỗi", "Vui lòng nhập mã OTP.");

    setLoading(true);
    try {
      const res = await api.post("/auth/verify-email", {
        email,
        otp: otp.trim(),
      });

      Alert.alert("Thành công", res.data.message || "Xác thực thành công!", [
        {
          text: "OK",
          onPress: () => router.replace("/(auth)"),
        },
      ]);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Mã OTP không hợp lệ hoặc đã hết hạn.";
      Alert.alert("Lỗi", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Xác thực Email</Text>
        <Text style={styles.subtitle}>
          Nhập mã OTP được gửi đến email:{" "}
          <Text style={{ color: "#007bff" }}>{email}</Text>
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Mã OTP</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mã OTP gồm 6 số"
            keyboardType="number-pad"
            onChangeText={setOtp}
            value={otp}
            maxLength={6}
            placeholderTextColor="#9EA1AE"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleVerify}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Đang xác thực..." : "Xác nhận"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 15, alignSelf: "center" }}
        >
          <Text style={{ color: "#007bff" }}>← Quay lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyEmail;
