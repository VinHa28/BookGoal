import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet, // Import StyleSheet
} from "react-native";
import BackHeader from "../../../components/BackHeader";
import { useState } from "react";
import Loading from "../../../components/Loading";
import { Ionicons } from "@expo/vector-icons";
import colors, { hexToRgba } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/utils";

const BookingDetail = () => {
  const [loading, setLoading] = useState(false);

  if (loading)
    return (
      <View style={styles.container}>
        <BackHeader />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.loadingContentContainer}
        >
          <Loading />
        </ScrollView>
      </View>
    );

  return (
    <View style={styles.container}>
      <BackHeader />
      <ScrollView>
        <View>
          <Image
            source={require("../../../assets/images/image_7.png")}
            style={styles.image}
          />
        </View>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Sân bóng Hoàng Gia</Text>
          <View style={styles.infoSection}>
            {/* Date/Time Row */}
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={25}
                  color={colors.primary}
                />
              </View>
              <View>
                <Text style={styles.infoMainText}>10 December, 2023</Text>
                <Text style={styles.infoSubText}>Tuesday, 4:00PM - 9:00PM</Text>
              </View>
            </View>

            {/* Location Row */}
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="map-outline" size={25} color={colors.primary} />
              </View>
              <TouchableOpacity style={styles.mapTouchable}>
                <Text style={styles.infoMainText}>Gala Convention Center</Text>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={20}
                  color={colors.tertiaryBrand}
                  style={styles.mapIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Price Row */}
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="pricetag-outline"
                  size={25}
                  color={colors.primary}
                />
              </View>
              <View style={styles.priceContainer}>
                <Text style={styles.infoMainText}>
                  {formatCurrency(150000)}
                </Text>
              </View>
            </View>

            {/* Status Row */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Trạng thái:</Text>
              <Text style={styles.statusBadge}>Chờ xác nhận</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.cancelButton}>
        <Text style={styles.cancelButtonText}>Hủy yêu cầu</Text>
      </TouchableOpacity>
    </View>
  );
};

// --- Stylesheet Definition ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: 250,
    objectFit: "cover",
  },
  contentWrapper: {
    paddingHorizontal: 26,
    paddingVertical: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    margin: 0,
  },
  infoSection: {
    marginTop: 26,
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: hexToRgba(colors.primary, 0.1),
    borderRadius: 12,
  },
  infoMainText: {
    fontSize: 16,
    fontWeight: "500",
    color: hexToRgba(colors.text, 0.84),
  },
  infoSubText: {
    fontSize: 14,
    color: colors.subtleText,
  },
  mapTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  mapIcon: {
    marginLeft: "auto",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: hexToRgba(colors.text, 0.84),
  },
  statusBadge: {
    fontSize: 16,
    paddingHorizontal: 22,
    paddingVertical: 8,
    backgroundColor: hexToRgba(colors.requestCancel, 0.12),
    borderRadius: 7,
    fontWeight: "500",
    color: colors.requestCancel,
  },
  cancelButton: {
    position: "absolute",
    left: 78,
    right: 78,
    bottom: 36,
    height: 58,
    backgroundColor: colors.requestCancel,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
  },
});

export default BookingDetail;
