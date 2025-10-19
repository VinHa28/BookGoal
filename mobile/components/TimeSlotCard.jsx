import { Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../constants/colors";

const TimeSlotCard = ({ slot, onSelect, isSelected }) => {
  return (
    <TouchableOpacity
      style={[
        style.timeSlotCard,
        slot.booked && style.timeSlotUnavailable,
        isSelected && style.timeSlotSelected,
      ]}
      onPress={() => !slot.booked && onSelect(slot)}
      disabled={slot.booked}
    >
      <Text
        style={[style.timeSlotHour, isSelected && style.timeSlotHourSelected]}
      >
        {slot.timeSlot}
      </Text>
      <Text
        style={[style.timeSlotPrice, isSelected && style.timeSlotPriceSelected]}
      >
        {!slot.booked ? `${(slot.price / 1000).toFixed(0)}k VNĐ` : "Đã thuê"}
      </Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  timeSlotRow: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  timeSlotCard: {
    width: "32%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  timeSlotUnavailable: {
    backgroundColor: "#f1f1f1",
    borderColor: "#e0e0e0",
    opacity: 0.6,
  },
  timeSlotSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  timeSlotHour: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  timeSlotHourSelected: {
    color: "#fff",
  },
  timeSlotPrice: {
    fontSize: 13,
    color: "green",
    fontWeight: "bold",
    marginTop: 3,
  },
  timeSlotPriceSelected: {
    color: "#fff",
  },
});

export default TimeSlotCard;
