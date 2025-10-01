// app/index.jsx
import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";
export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  if (!user) {
    return <Redirect href="/(auth)" />;
  }
  return <Redirect href="/(tabs)" />;
}
