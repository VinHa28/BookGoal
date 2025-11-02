import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../../../constants/colors";
import BackHeader from "../../../components/BackHeader";
import { useAuth } from "../../../context/AuthContext";
import { getUserInfo, updateUser } from "../../../services/authServices";

const EditProfileScreen = ({ navigation }) => {
  const { user, setUser } = useAuth();
  const [fullname, setFullName] = useState(user ? user.username : "");
  const fetchUser = async () => {
    try {
      const data = await getUserInfo(user._id);
      setUser(data);
    } catch (error) {
      console.error(error);
    }
  };
  const hanldeUpdate = async () => {
    try {
      const data = await updateUser(user._id, fullname);
      if (data)
        Alert.alert("Thành công", "Cập nhập thông tin người dùng thành công.");
    } catch (error) {
      console.error(error);
    } finally {
      fetchUser();
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
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full name</Text>
              <TextInput
                style={styles.input}
                value={fullname}
                onChangeText={(text) => {
                  setFullName(text);
                }}
                autoCapitalize="words"
              />
              <View style={styles.inputUnderline} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={[styles.input, { opacity: 0.5 }]}
                value={user ? user.phone : ""}
                keyboardType="phone-pad"
                autoCapitalize="none"
                editable={false}
              />
              <View style={styles.inputUnderline} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, { opacity: 0.5 }]}
                value={user ? user.email : ""}
                keyboardType="email"
                autoCapitalize="none"
                editable={false}
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
              onPress={hanldeUpdate}
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
