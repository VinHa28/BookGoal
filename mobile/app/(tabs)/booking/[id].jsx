import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert, // Import StyleSheet
} from "react-native";
import BackHeader from "../../../components/BackHeader";
import { useCallback, useEffect, useState } from "react";
import Loading from "../../../components/Loading";
import { Ionicons } from "@expo/vector-icons";
import colors, { hexToRgba } from "../../../constants/colors";
import { formatCurrency } from "../../../utils/utils";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import {
  cancelBooking,
  getBookingById,
  requestCancelBooking,
} from "../../../services/bookingService";
import { BOOKING_STATUS } from "../../../constants";

const BookingDetail = () => {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState({});
  const dateObject = new Date(booking.date);

  const openMap = () => {
    const url = booking.field?.address || "";
    Linking.openURL(url);
  };
  const handleCancelBooking = async () => {
    try {
      const res = await cancelBooking(booking._id);
      if (res)
        Alert.alert(
          "Thành công",
          `Lịch đặt sân ${booking.field?.name} vào lúc ${
            booking.timeSlot
          } ${dateObject.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })} đã được hủy.`
        );
    } catch (error) {
      console.error(error);
    } finally {
      fetchBooking();
    }
  };

  const hanldeRequestCancel = async () => {
    try {
      const res = await requestCancelBooking(booking._id);
      if (res) {
        const message = `Yêu cầu hủy đặt sân ${booking.field?.name} vào lúc ${
          booking.timeSlot
        } ${dateObject.toLocaleDateString("vi-VN", {
          weekday: "long",
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })} đã được ${res.request ? "gửi, chờ xác nhận." : "hủy"}`;
        Alert.alert("Thành công", message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      fetchBooking();
    }
  };

  const fetchBooking = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (error) {
      console.error("Error fetching booking!", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchBooking();
    }, [fetchBooking])
  );

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
            source={{
              uri: booking.field?.image || "",
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{booking.field?.name || ""}</Text>
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
                <Text style={styles.infoMainText}>
                  {dateObject.toLocaleDateString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}
                </Text>
                <Text style={styles.infoSubText}>{booking.timeSlot || ""}</Text>
              </View>
            </View>

            {/* Location Row */}
            <View style={styles.infoRow}>
              <View style={styles.iconContainer}>
                <Ionicons name="map-outline" size={25} color={colors.primary} />
              </View>
              <TouchableOpacity style={styles.mapTouchable} onPress={openMap}>
                <Text style={styles.infoMainText}>
                  {booking.field?.location || "Xem trên bản đồ"}
                </Text>
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
                  {formatCurrency(booking.price)}
                </Text>
              </View>
            </View>

            {/* Status Row */}
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Trạng thái:</Text>
              <Text
                style={[
                  styles.statusBadge,
                  booking.status === "pending"
                    ? styles.pendding
                    : booking.status === "cancelled"
                    ? styles.cancelled
                    : booking.status === "confirmed"
                    ? styles.confirmed
                    : booking.status === "completed"
                    ? styles.completed
                    : styles.requestCancel,
                ]}
              >
                {BOOKING_STATUS[booking.status]}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {booking.status === "requestCancel" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={hanldeRequestCancel}
        >
          <Text style={styles.cancelButtonText}>Hủy yêu cầu</Text>
        </TouchableOpacity>
      )}

      {booking.status === "confirmed" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={hanldeRequestCancel}
        >
          <Text style={styles.cancelButtonText}>Yêu cầu hủy</Text>
        </TouchableOpacity>
      )}

      {booking.status === "pending" && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancelBooking}
        >
          <Text style={styles.cancelButtonText}>Hủy đặt sân</Text>
        </TouchableOpacity>
      )}
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
    borderRadius: 7,
    fontWeight: "500",
  },
  requestCancel: {
    color: colors.requestCancel,
    backgroundColor: hexToRgba(colors.requestCancel, 0.12),
  },
  pendding: {
    color: colors.pendding,
    backgroundColor: hexToRgba(colors.pendding, 0.12),
  },
  confirmed: {
    color: colors.confirmed,
    backgroundColor: hexToRgba(colors.confirmed, 0.12),
  },
  cancelled: {
    color: colors.cancelled,
    backgroundColor: hexToRgba(colors.cancelled, 0.12),
  },
  completed: {
    color: colors.completed,
    backgroundColor: hexToRgba(colors.completed, 0.12),
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
