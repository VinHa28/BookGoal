import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../constants/colors";

const UpcomingBookingCard = ({ booking }) => {
  const dateObject = new Date(booking.date);
  return (
    <View style={styles.bookingCard}>
      <Text style={styles.bookingFieldName}>{booking.fieldName}</Text>
      <View style={styles.bookingDetailRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.primary} />
        <Text style={styles.bookingText}>
          {dateObject.toLocaleDateString("vi-VN", {
            weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </Text>
      </View>
      <View style={styles.bookingDetailRow}>
        <Ionicons name="time-outline" size={16} color={colors.primary} />
        <Text style={styles.bookingText}>{booking.timeSlot}</Text>
      </View>
      <View style={styles.bookingDetailRow}>
        <Ionicons name="pricetag-outline" size={16} color={colors.primary} />
        <Text style={styles.bookingPrice}>{booking.price}</Text>
      </View>
      <View style={styles.bookingDetailRow}>
        <Text
          style={
            booking.status === "pending"
              ? styles.statusPeding
              : booking.status === "cancelled"
              ? styles.statusCancelled
              : styles.statusConfirm
          }
        >
          {booking.status}
        </Text>
      </View>
      <TouchableOpacity style={styles.bookingActionButton}>
        <Text style={styles.bookingActionText}>Chi tiết lịch hẹn</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpcomingBookingCard;

const styles = StyleSheet.create({
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 5,
    borderLeftColor: colors.primary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginBottom: 20,
  },
  bookingFieldName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.primary,
  },
  bookingDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  bookingText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 10,
  },
  bookingPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "red",
    marginLeft: 10,
  },
  bookingActionButton: {
    marginTop: 15,
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  bookingActionText: {
    color: colors.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  statusPeding: {
    color: "#31D0AA",
  },
  statusCancelled: {
    color: "#FE7474",
  },
  statusConfirm: {
    color: "#5265FF",
  },
});
