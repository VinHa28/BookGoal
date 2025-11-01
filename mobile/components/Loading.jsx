import React from "react";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";

const Loading = ({ message = "" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
});
