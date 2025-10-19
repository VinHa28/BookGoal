import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useMemo, useState } from "react";
import colors from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const BookingCalendar = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Lấy ngày hiện tại (reset giờ về 00:00:00 để so sánh chính xác)
  const today = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }, []);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();

    let days = [];
    for (let i = 1; i <= numDays; i++) {
      days.push(i);
    }

    let firstDay = new Date(year, month, 1).getDay();
    if (firstDay === 0) firstDay = 7;

    const startingDayOfWeek = 1;
    let offset = firstDay - startingDayOfWeek;
    if (offset < 0) offset += 7;

    for (let i = 0; i < offset; i++) {
      days.unshift(null);
    }

    return days;
  }, [currentDate]);

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "Cn"];

  const currentMonthLabel = `${
    monthNames[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  const isPastDay = (day) => {
    if (!day) return false;
    const checkDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const handleDayPress = (day) => {
    if (day && !isPastDay(day)) {
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      setSelectedDate(newDate);
      onDateSelect(newDate);
    }
  };

  const isDaySelected = (day) => {
    if (!day || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const nextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(newDate);
  };

  return (
    <View style={calendarStyles.container}>
      <View style={calendarStyles.header}>
        <Text style={calendarStyles.monthText}>{currentMonthLabel}</Text>
        <View style={calendarStyles.navigation}>
          <TouchableOpacity
            onPress={prevMonth}
            style={calendarStyles.navButton}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={nextMonth}
            style={calendarStyles.navButton}
          >
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={calendarStyles.dayLabelsRow}>
        {dayLabels.map((label, index) => (
          <Text key={index} style={calendarStyles.dayLabelText}>
            {label}
          </Text>
        ))}
      </View>

      <FlatList
        data={daysInMonth}
        keyExtractor={(item, index) => index.toString()}
        numColumns={7}
        renderItem={({ item: day }) => {
          const isPast = isPastDay(day);
          const isSelected = isDaySelected(day);

          return (
            <TouchableOpacity
              style={[
                calendarStyles.dayCell,
                isSelected && calendarStyles.daySelected,
                !day && calendarStyles.dayEmpty,
                isPast && calendarStyles.dayPast,
              ]}
              onPress={() => handleDayPress(day)}
              disabled={!day || isPast}
            >
              {day && (
                <Text
                  style={[
                    calendarStyles.dayText,
                    isSelected && calendarStyles.dayTextSelected,
                    isPast && calendarStyles.dayTextPast,
                  ]}
                >
                  {day}
                </Text>
              )}
            </TouchableOpacity>
          );
        }}
        scrollEnabled={false}
      />
    </View>
  );
};

const calendarStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  monthText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  navigation: {
    flexDirection: "row",
  },
  navButton: {
    padding: 5,
    marginHorizontal: 5,
  },
  dayLabelsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  dayLabelText: {
    width: `${100 / 7}%`,
    textAlign: "center",
    fontWeight: "600",
    color: colors.primary,
    fontSize: 14,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  dayEmpty: {
    opacity: 0,
  },
  dayText: {
    fontSize: 16,
    color: "#333",
    padding: 8,
    borderRadius: 20,
    width: 36,
    height: 36,
    textAlign: "center",
    textAlignVertical: "center",
  },
  daySelected: {
    backgroundColor: colors.secondary,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  dayTextSelected: {
    color: "#fff",
    fontWeight: "bold",
    backgroundColor: colors.primary,
  },
  // Styles mới cho ngày quá khứ
  dayPast: {
    opacity: 0.3,
  },
  dayTextPast: {
    color: "#999",
    textDecorationLine: "line-through",
  },
});

export default BookingCalendar;
