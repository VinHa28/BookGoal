import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import BackHeader from "../../components/BackHeader";
import colors from "../../constants/colors";
import { forgotPassword, resetPassword } from "../../services/authServices";

const ResetPassword = () => {
  const [step, setStep] = useState(1); // 1: nhập email, 2: nhập OTP + mật khẩu mới
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Gửi OTP qua email
  const handleSendOTP = async () => {
    if (!email) return Alert.alert("Lỗi", "Vui lòng nhập email của bạn");

    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      Alert.alert("Thành công", res.message || "Đã gửi OTP đến email của bạn");
      setStep(2);
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể gửi OTP");
    } finally {
      setLoading(false);
    }
  };

  // Đặt lại mật khẩu
  const handleResetPassword = async () => {
    if (!otp || !newPassword)
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ OTP và mật khẩu mới");

    setLoading(true);
    try {
      const res = await resetPassword(email.trim(), otp.trim(), newPassword);
      Alert.alert("Thành công", res.message || "Đặt lại mật khẩu thành công", [
        { text: "OK" },
      ]);
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      Alert.alert("Lỗi", error.message || "Không thể đặt lại mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={style.container}>
      <BackHeader />
      <View style={{ flex: 1, marginTop: 100, paddingHorizontal: 24 }}>
        <Text style={style.title}>Lấy lại mật khẩu</Text>
        <Text style={style.desc}>
          {step === 1
            ? "Vui lòng nhập email đã đăng ký để nhận mã OTP"
            : "Nhập mã OTP và mật khẩu mới của bạn"}
        </Text>

        {step === 1 ? (
          <>
            <View style={style.ctaContainer}>
              <View style={style.inputContainer}>
                <TextInput
                  style={style.textbox}
                  placeholder="Nhập email"
                  keyboardType="email-address"
                  placeholderTextColor="#9EA1AE"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity
                style={style.button}
                onPress={handleSendOTP}
                disabled={loading}
              >
                <Text style={style.buttonText}>
                  {loading ? "Đang gửi..." : "GỬI OTP"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={style.ctaContainer}>
              <View style={style.inputContainer}>
                <TextInput
                  style={style.textbox}
                  placeholder="Nhập mã OTP"
                  keyboardType="number-pad"
                  placeholderTextColor="#9EA1AE"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                />
              </View>

              <View style={style.inputContainer}>
                <TextInput
                  style={style.textbox}
                  placeholder="Nhập mật khẩu mới"
                  secureTextEntry
                  placeholderTextColor="#9EA1AE"
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <TouchableOpacity
                style={style.button}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={style.buttonText}>
                  {loading ? "Đang xử lý..." : "ĐẶT LẠI MẬT KHẨU"}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 15,
  },
  desc: {
    fontSize: 16,
    color: "#8C8CA1",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#807A7A",
    borderRadius: 12,
    height: 65,
    width: "100%",
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  textbox: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  button: {
    width: "100%",
    height: 67,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 30,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  ctaContainer: {
    marginTop: 30,
    flex: 1,
    alignItems: "center",
    gap: 10,
  },
});

export default ResetPassword;
