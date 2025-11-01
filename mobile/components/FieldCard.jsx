import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors, { hexToRgba } from "../constants/colors";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const FieldCard = ({ field, isVertical = false }) => {
  const router = useRouter();
  const fieldDetail = () => {
    router.push(`/field/${field._id}`);
  };

  const cardStyles = [
    baseStyles.fieldCard,
    isVertical ? verticalStyles.card : horizontalStyles.card,
  ];

  return (
    <TouchableOpacity style={cardStyles} onPress={fieldDetail}>
      <Image
        source={{ uri: field.image || "" }}
        style={baseStyles.fieldImage}
      />
      <View
        style={{
          width: 45,
          height: 45,
          position: "absolute",
          top: 8,
          left: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: hexToRgba("#ffffff", 0.7),
          borderRadius: 10,
        }}
      >
        <Text style={{ color: colors.tertiaryBrand, fontSize: 10 }}>
          {`${field.type.split(" ")[0].charAt(0).toUpperCase()}${field.type
            .split(" ")[0]
            .slice(1)}`}
        </Text>
        <Text
          style={{ color: colors.tertiaryBrand, fontSize: 18, fontWeight: 600 }}
        >
          {field.type.split(" ")[1]}
        </Text>
      </View>
      <View style={baseStyles.fieldInfo}>
        <Text style={baseStyles.fieldName}>{field.name}</Text>
        <View style={baseStyles.fieldDetailRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.subtleText}
          />
          <Text style={baseStyles.fieldAddress}>{field.location}</Text>
        </View>

        <View style={baseStyles.fieldDetailRow}>
          <Ionicons name="walk-outline" size={14} color={colors.subtleText} />
          <Text style={baseStyles.fieldDistance}>
            {field.distance || "1.5 km"}
          </Text>
        </View>
        <Text style={baseStyles.fieldAvailability}>
          Còn trống: {field.available || 5} khung giờ
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FieldCard;

const baseStyles = StyleSheet.create({
  fieldCard: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: "#FFFFFF",
  },
  fieldImage: {
    height: 130,
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  fieldInfo: {
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
  },
  fieldDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  fieldAddress: {
    fontSize: 14,
    color: colors.subtleText,
    marginLeft: 8,
    fontWeight: "500",
  },
  fieldDistance: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
    fontWeight: "600",
  },
  fieldAvailability: {
    marginTop: 6,
    fontSize: 14,
    color: colors.tertiaryBrand,
    fontWeight: "700",
  },
});

// ----------------------------------------------------------------
// 2. HORIZONTAL STYLES (FlatList ngang)
// ----------------------------------------------------------------
const horizontalStyles = StyleSheet.create({
  card: {
    width: width * 0.6,
    marginRight: 15,
  },
});

// ----------------------------------------------------------------
// 3. VERTICAL STYLES (FlatList dọc - Full Width)
// ----------------------------------------------------------------
const verticalStyles = StyleSheet.create({
  card: {
    // Mặc định chiếm full width của View cha
    width: "100%",
    marginBottom: 15,
  },
});
