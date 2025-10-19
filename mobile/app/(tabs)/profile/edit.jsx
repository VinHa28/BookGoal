import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  BackHandler, // Dùng để thông báo lỗi hoặc yêu cầu quyền
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // 💡 Import thư viện ImagePicker
import colors from "../../../constants/colors";
import BackHeader from "../../../components/BackHeader";

// Khởi tạo dữ liệu người dùng mẫu
const initialProfile = {
  fullName: "Ebenezer Omosuli",
  email: "ebenux123@gmail.com",
  tag: "eben",
  avatarUrl: "https://i.imgur.com/8f10j7T.png", // URL ảnh 3D mẫu
};

const EditProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState(initialProfile);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // --- Hàm xử lý chọn ảnh ---
  const handleImagePick = async () => {
    // 1. Yêu cầu quyền truy cập thư viện ảnh (chỉ cần thiết trên iOS/Web trong một số trường hợp)
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Lỗi quyền truy cập",
          "Bạn cần cấp quyền truy cập thư viện ảnh để thay đổi avatar."
        );
        return;
      }
    }

    // 2. Mở thư viện ảnh
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Cho phép người dùng crop (cắt) ảnh
      aspect: [1, 1], // Tỷ lệ 1:1 (hình vuông)
      quality: 1, // Chất lượng ảnh
    });

    if (!result.canceled) {
      // 3. Cập nhật URL ảnh mới vào state
      setProfile((prev) => ({
        ...prev,
        avatarUrl: result.assets[0].uri, // Lấy URI của ảnh đã chọn
      }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackHeader title="Profile" backTo={"/(tabs)/profile"} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingContainer}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Avatar và nút chỉnh sửa */}
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.avatar}
              // Thêm defaultSource để tránh crash khi URI không hợp lệ
              defaultSource={
                Platform.OS === "web"
                  ? null
                  : require("../../../assets/images/avatar.png")
              }
            />
            {/* 💡 Gắn hàm handleImagePick vào sự kiện onPress */}
            <TouchableOpacity
              style={styles.cameraIcon}
              onPress={handleImagePick}
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Form nhập liệu */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={styles.input}
                value={profile.fullName}
                onChangeText={(text) => handleInputChange("fullName", text)}
                autoCapitalize="words"
              />
              <View style={styles.inputUnderline} />
            </View>

            {/* Email address */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(text) => handleInputChange("email", text)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.inputUnderline} />
            </View>
            <TouchableOpacity
              style={{
                width: 100,
                height: 40,
                borderRadius: 999,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
                marginHorizontal: "auto",
                marginTop: 30,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... (Giữ nguyên các style đã có)
  container: { flex: 1, backgroundColor: "#fff" },
  keyboardAvoidingContainer: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  backButton: { padding: 10 },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 44,
  },
  avatarContainer: {
    alignSelf: "center",
    marginVertical: 30,
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6C63FF",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  form: { paddingHorizontal: 10 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, color: "#8e8e93", marginBottom: 5 },
  input: { fontSize: 18, color: "#000", paddingVertical: 10 },
  tagInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  tagPrefix: { fontSize: 18, color: "#000", marginRight: 5 },
  tagInput: { flex: 1, fontSize: 18, color: "#000", padding: 0 },
  inputUnderline: { height: 1, backgroundColor: "#ccc", marginTop: 0 },
  activeUnderline: { backgroundColor: "#6C63FF", height: 2 },
});

export default EditProfileScreen;
