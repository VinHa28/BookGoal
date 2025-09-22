import { View, Text, TouchableOpacity, TextInput } from "react-native";
import styles from "../../assets/styles/auth.styles.js";
import { useRouter } from "expo-router";

const Signup = () => {
  const router = useRouter();
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
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại"
              keyboardType="phone"
              placeholderTextColor="#9EA1AE"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mật khẩu"
              secureTextEntry
              placeholderTextColor="#9EA1AE"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Signup;
