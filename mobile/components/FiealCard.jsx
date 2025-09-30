import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const FiealCard = ({ field }) => {
  const router = useRouter();
  const fieldDetail = () => {
    router.replace("/field/1");
  };
  return (
    <TouchableOpacity style={styles.fieldCard} onPress={fieldDetail}>
      <Image
        source={{ uri: field.image }}
        style={styles.fieldImagePlaceholder}
      />
      <View style={styles.fieldInfo}>
        <Text style={styles.fieldName}>{field.name}</Text>
        <View style={styles.fieldDetailRow}>
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text style={styles.fieldAddress}>{field.address}</Text>
        </View>

        <View style={styles.fieldDetailRow}>
          <Ionicons name="walk-outline" size={14} color="#666" />
          <Text style={styles.fieldDistance}>{field.distance}</Text>
        </View>
        <Text style={styles.fieldAvailability}>
          Còn trống: {field.availability} khung giờ
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FiealCard;

const styles = StyleSheet.create({
  fieldCard: {
    borderRadius: 12,
    marginRight: 15,
    width: width * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#eee",
  },
  fieldImagePlaceholder: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fieldInfo: {
    padding: 10,
    backgroundColor: "white",
  },
  fieldName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.text,
  },
  fieldDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  fieldAddress: {
    fontSize: 13,
    color: "#666",
    marginLeft: 5,
    fontWeight: "600",
  },
  fieldDistance: {
    fontSize: 13,
    color: colors.primary,
    marginLeft: 5,
    fontWeight: "600",
  },
  fieldAvailability: {
    marginTop: 8,
    fontSize: 13,
    color: "green",
    fontWeight: "600",
  },
});
