import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
  Image,
  Modal,
  Linking,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useRouter } from "expo-router";

const SettingItem = ({
  icon,
  label,
  onPress,
  isToggle = false,
  value,
  onValueChange,
  iconType = "Ionicons",
}) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={isToggle ? null : onPress}
    disabled={isToggle}
  >
    <View style={styles.settingLeft}>
      {iconType === "Ionicons" ? (
        <Ionicons name={icon} size={24} color="#333" />
      ) : (
        <MaterialCommunityIcons name={icon} size={24} color="#333" />
      )}

      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <View style={styles.settingRight}>
      {isToggle ? (
        <Switch
          trackColor={{ false: "#767577", true: COLORS.primary }}
          thumbColor={value ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={onValueChange}
          value={value}
        />
      ) : (
        <Ionicons name="chevron-forward-outline" size={20} color="#999" />
      )}
    </View>
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [supportVisible, setSupportVisible] = useState(false);
  const supportPhone = "0981228204"; // 📞 Số điện thoại chủ sân

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Lỗi đăng xuất: ", error);
    }
  };

  const handleEditProfile = () => {
    router.push("/(tabs)/profile/edit");
  };

  const handleSupport = () => {
    setSupportVisible(true);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${supportPhone}`);
    setSupportVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image
            source={
              user?.avtUrl
                ? { uri: user.avtUrl }
                : {
                    uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
                  }
            }
            style={styles.avatarPlaceholder}
          />

          <Text style={styles.userName}>{user?.username}</Text>
          <Text style={styles.userPhone}>ĐT: {user?.phone}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditProfile}
          >
            <Text style={styles.editButtonText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <SettingItem
            icon="lock-closed-outline"
            label="Đổi mật khẩu"
            onPress={() => router.push("/(tabs)/profile/changePassword")}
          />

          <SettingItem
            icon="headset-outline"
            label="Trợ giúp & Hỗ trợ"
            onPress={handleSupport}
          />

          <SettingItem
            icon="log-out-outline"
            label="Đăng xuất"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>

      {/* --- MODAL HỖ TRỢ --- */}
      <Modal
        visible={supportVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSupportVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Liên hệ hỗ trợ</Text>
            <Text style={styles.modalText}>
              Gặp vấn đề khi đặt sân hoặc cần hỗ trợ? Hãy gọi cho chủ sân:
            </Text>

            <TouchableOpacity onPress={handleCall}>
              <Text style={styles.modalPhone}>{supportPhone}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setSupportVisible(false)}
            >
              <Text style={styles.modalCloseText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },
  scrollContent: { flex: 1 },

  // --- Header ---
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#eee",
    marginBottom: 10,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userPhone: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    marginBottom: 10,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // --- Settings Section ---
  settingsSection: {
    marginHorizontal: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  settingRight: {},

  // --- Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 15,
    textAlign: "center",
    color: "#666",
  },
  modalPhone: {
    marginTop: 15,
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: "bold",
  },
  modalCloseButton: {
    marginTop: 25,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  bottomSpacer: { height: Platform.OS === "ios" ? 80 : 60 },
});
