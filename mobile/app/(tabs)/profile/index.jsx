import React, { use, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Switch,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import COLORS from "../../../constants/colors.js";
import { useAuth } from "../../../context/AuthContext.jsx";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const mockUser = {
  username: "Hà Văn Vinh",
  phone: "0987654321",
  avatar: "https://placehold.co/100x100/CCCCCC/5e56d4?text=NA",
};

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
          <SettingItem icon="lock-closed-outline" label="Đổi Mật khẩu" />

          {/* Hỗ trợ */}
          <SettingItem icon="headset-outline" label="Trợ giúp & Hỗ trợ" />

          {/* Đăng xuất */}
          <SettingItem
            icon="log-out-outline"
            label="Đăng xuất"
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
      <View style={styles.bottomSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollContent: {
    flex: 1,
  },

  // --- Header & User Info ---
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
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 3,
    borderColor: COLORS.primary,
    position: "relative",
  },
  avatarText: {
    position: "absolute",
    fontSize: 12,
    color: "#666",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginTop: 2,
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
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
    marginBottom: 20,
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
  settingRight: {
    // Chỉ để chứa chevron hoặc switch
  },
  bottomSpacer: {
    height: Platform.OS === "ios" ? 80 : 60,
  },
});
