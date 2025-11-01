import React from "react";
import { View, Image } from "react-native";
const Logo = () => {
  return (
    <View
      style={{
        width: 50,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        overflow: "hidden",
        borderRadius: 6,
      }}
    >
      <Image
        source={require("../assets/images/book_goal.png")}
        style={{ width: 94, height: 94 }}
      />
    </View>
  );
};

export default Logo;
