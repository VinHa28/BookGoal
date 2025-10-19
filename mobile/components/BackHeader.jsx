import { View, Text, Image, TouchableOpacity } from "react-native";
import colors from "../constants/colors";
import { useRouter } from "expo-router";

const BackHeader = ({ title = "Quay lại", variant = "", backTo }) => {
  const color = variant === "dark" ? colors.text : "white";
  const background = variant === "dark" ? colors.accent : "black";
  const router = useRouter();

  const handleBack = () => {
    if (backTo) return router.push(backTo);
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: "transparent",
        zIndex: 10,
        top: 0,
        height: 50,
        width: "100%",
      }}
    >
      <TouchableOpacity
        onPress={handleBack}
        style={{
          alignItems: "center",
          flexDirection: "row",
          flex: 1,
          gap: 6,
          paddingLeft: 16,
        }}
      >
        {variant === "dark" ? (
          <Image
            source={require("../assets/images/back_icon_dark.png")}
            style={{ width: 24, height: 24 }}
          />
        ) : (
          <Image
            source={require("../assets/images/back_icon.png")}
            style={{ width: 24, height: 24 }}
          />
        )}

        <Text style={{ color: color, fontSize: 24, fontWeight: "500" }}>
          {title}
        </Text>
      </TouchableOpacity>

      <View
        style={{
          backgroundColor: background,
          inset: 0,
          position: "absolute",
          opacity: 0.25,
          zIndex: -1,
        }}
      />
    </View>
  );
};

export default BackHeader;
