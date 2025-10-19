import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import BackHeader from "../../components/BackHeader";
import colors from "../../constants/colors";

const resetPassword = () => {
  return (
    <View style={style.container}>
      <BackHeader />
      <View style={{ flex: 1, marginTop: 100, paddingHorizontal: 24 }}>
        <Text style={style.title}>Lấy lại mật khẩu</Text>
        <Text style={style.desc}>Vui lòng nhập số điện thoại của bạn</Text>

        <View style={style.ctaContainer}>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#807A7A",
              borderRadius: 12,
              height: 65,
              width: 355,
              paddingHorizontal: 16,
            }}
          >
            <TextInput
              style={style.textbox}
              placeholder="Nhập số điện thoại"
              placeholderTextColor="#9EA1AE"
            />
          </View>

          <View style={style.buttonContainer}>
            <TouchableOpacity style={style.button}>
              <Text style={{ color: "#FFF", fontSize: 16 }}>SEND</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 15,
  },
  desc: {
    fontSize: 16,
    color: "#8C8CA1",
  },
  textbox: {
    flex: 1,
  },
  buttonContainer: {},
  button: {
    width: 303,
    height: 67,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    marginTop: 47,
  },
  ctaContainer: {
    marginTop: 30,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
});

export default resetPassword;
