import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors, { hexToRgba } from "../constants/colors";
import { BOOKING_STATUS } from "../constants";
import { useRouter } from "expo-router";
import { formatCurrency } from "../utils/utils";

const UpcomingBookingCard = ({ booking }) => {
  const router = useRouter();
  const dateObject = new Date(booking.date);
  return (
    <TouchableOpacity
      style={{
        borderRadius: 16,
        padding: 10,
        backgroundColor: hexToRgba("#ACB5FF", 0.1),
        marginBottom: 8,
      }}
      onPress={() => router.push(`booking/${booking._id}`)}
    >
      <Text
        style={{
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        {booking.fieldName}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          marginTop: 4,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons name="calendar-outline" size={16} color={colors.primary} />
          <Text style={{ fontWeight: 500 }}>
            {dateObject.toLocaleDateString("vi-VN", {
              weekday: "long",
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Ionicons name="time-outline" size={16} color={colors.primary} />
          <Text style={{ fontWeight: 500 }}>{booking.timeSlot}</Text>
        </View>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          marginTop: 4,
        }}
      >
        <Ionicons name="location-outline" size={16} color={colors.primary} />
        <Text style={{ fontWeight: 500 }}>{booking.location}</Text>
      </View>
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: 8,
        }}
      >
        <Text
          style={
            booking.status === "pending"
              ? styles.statusPeding
              : booking.status === "cancelled"
              ? styles.statusCancelled
              : styles.statusConfirm
          }
        >
          {BOOKING_STATUS[booking.status]}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: colors.tertiaryBrand,
            backgroundColor: hexToRgba(colors.tertiaryBrand, 0.1),
            padding: 8,
            borderRadius: 5,
          }}
        >
          {formatCurrency(booking.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default UpcomingBookingCard;

const styles = StyleSheet.create({
  bookingCard: {},
  bookingFieldName: {},
  bookingDetailRow: {},
  bookingText: {},
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
    color: colors.pedding,
  },
  statusCancelled: {
    color: colors.cancelled,
  },
  statusConfirm: {
    color: colors.confirmed,
  },
});
