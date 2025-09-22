import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>This is Home Screen</Text>
      <Link href={"/(auth)/signup"}>SignUp</Link>
      <Link href={"/(auth)"}>login</Link>
    </View>
  );
}
