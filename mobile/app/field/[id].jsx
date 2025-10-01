import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
  Linking,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import BackHeader from "../../components/BackHeader";

const { height, width } = Dimensions.get("window");

// Dữ liệu giả định chi tiết cho sân bóng
const mockFieldData = {
  id: "1",
  name: "Rạp Xiếc Trung Ương",
  type: "Sân 5 Người",
  address: "36 Đường Tàu, Rau Má, Thanh Hóa",
  distance: "3.6 km",
  reviews: 128,
  description:
    "Sân cỏ nhân tạo chất lượng cao, có mái che, hệ thống đèn chiếu sáng tiêu chuẩn. Luôn có nước uống, khăn lạnh và dịch vụ giữ đồ miễn phí.",
  amenities: [
    { icon: "shower-head", label: "Phòng tắm" },
    { icon: "wifi", label: "Wifi miễn phí" },
    { icon: "car-side", label: "Bãi đỗ xe" },
    { icon: "storefront-outline", label: "Căn-tin" },
  ],
  latitude: 10.7769,
  longitude: 106.7019,
  openingHours: "06:36 - 23:36",
};

// Dữ liệu giả định về khung giờ và giá
const mockSchedule = [
  { hour: "06:00 - 07:00", price: 150000, available: true },
  { hour: "07:00 - 08:00", price: 150000, available: true },
  { hour: "17:00 - 18:00", price: 200000, available: true },
  { hour: "18:00 - 19:00", price: 250000, available: false },
  { hour: "19:00 - 20:00", price: 250000, available: true },
  { hour: "20:00 - 21:00", price: 220000, available: true },
  { hour: "21:00 - 22:00", price: 200000, available: true },
];

// Component Card hiển thị Khung giờ và Giá
const TimeSlotCard = ({ slot, onSelect, isSelected }) => (
  <TouchableOpacity
    style={[
      detailStyles.timeSlotCard,
      !slot.available && detailStyles.timeSlotUnavailable,
      isSelected && detailStyles.timeSlotSelected,
    ]}
    onPress={() => slot.available && onSelect(slot)}
    disabled={!slot.available}
  >
    <Text
      style={[
        detailStyles.timeSlotHour,
        isSelected && detailStyles.timeSlotHourSelected,
      ]}
    >
      {slot.hour}
    </Text>
    <Text
      style={[
        detailStyles.timeSlotPrice,
        isSelected && detailStyles.timeSlotPriceSelected,
      ]}
    >
      {slot.available ? `${(slot.price / 1000).toFixed(0)}k VNĐ` : "Đã thuê"}
    </Text>
  </TouchableOpacity>
);

// --- COMPONENT LỊCH MỚI (Đã cập nhật) ---
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

  // Kiểm tra xem ngày có phải là ngày trong quá khứ không
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
// --- KẾT THÚC COMPONENT LỊCH MỚI ---

export default function FieldDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày mặc định

  const field = mockFieldData;

  const handleSlotSelect = (slot) => {
    setSelectedSlot(selectedSlot?.hour === slot.hour ? null : slot);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Reset khung giờ khi chọn ngày mới
    console.log("Ngày đã chọn:", date.toLocaleDateString("vi-VN"));
  };

  const openMap = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?ll=${field.latitude},${field.longitude}&q=${field.name}`,
      android: `geo:${field.latitude},${field.longitude}?q=${field.name}`,
      default: `https://www.google.com/maps/search/?api=1&query=${field.latitude},${field.longitude}`,
    });
    Linking.openURL(url);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Định dạng ngày đã chọn để hiển thị
  const formattedDate = selectedDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <View style={detailStyles.container}>
      <BackHeader />
      <ScrollView style={detailStyles.scrollContent}>
        {/* 1. Khu vực Hình ảnh/Map (Placeholder) */}
        <View style={{ marginBottom: 16 }}>
          <Image
            source={{
              uri: "https://www.tottenhamhotspur.com/media/34057/the-stadium.jpg",
            }}
            style={detailStyles.imagePlaceholder}
          />
        </View>

        {/* 2. Chi tiết Sân */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.fieldName}>{field.name}</Text>

          <View style={detailStyles.infoRow}>
            <Ionicons
              name="football-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={detailStyles.fieldType}>{field.type}</Text>
          </View>

          <TouchableOpacity style={detailStyles.addressRow} onPress={openMap}>
            <Ionicons name="location-outline" size={20} color={colors.text} />
            <Text style={detailStyles.fieldAddress}>{field.address}</Text>
            <Ionicons
              name="arrow-forward-circle-outline"
              size={20}
              color={colors.tertiaryBrand}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>

          <View style={detailStyles.ratingRow}>
            <Text style={detailStyles.openingHoursText}>
              Giờ mở cửa: {field.openingHours}
            </Text>
          </View>
        </View>
        {/* 3. Mô tả */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>Mô tả</Text>
          <Text style={detailStyles.descriptionText}>{field.description}</Text>
        </View>
        {/* 4. Tiện ích */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>Tiện ích nổi bật</Text>
          <View style={detailStyles.amenitiesGrid}>
            {field.amenities.map((item, index) => (
              <View key={index} style={detailStyles.amenityItem}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={colors.primary}
                />
                <Text style={detailStyles.amenityText}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>
        {/* 5. Khung giờ & Giá */}
        <View style={detailStyles.section}>
          <Text style={detailStyles.sectionTitle}>Chọn Ngày Đặt Sân</Text>

          {/* THAY THẾ TEXT CHỌN NGÀY BẰNG CALENDAR COMPONENT */}
          <BookingCalendar onDateSelect={handleDateSelect} />

          <Text style={[detailStyles.sectionTitle, { marginTop: 20 }]}>
            Khung Giờ ({formattedDate})
          </Text>

          <FlatList
            data={mockSchedule}
            keyExtractor={(item) => item.hour}
            numColumns={3}
            columnWrapperStyle={detailStyles.timeSlotRow}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TimeSlotCard
                slot={item}
                onSelect={handleSlotSelect}
                isSelected={selectedSlot?.hour === item.hour}
              />
            )}
          />
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- Footer (Nút Đặt sân) --- */}
      <View style={detailStyles.footer}>
        {selectedSlot ? (
          <View style={detailStyles.footerContent}>
            <View>
              <Text style={detailStyles.footerPriceLabel}>Tổng cộng:</Text>
              <Text style={detailStyles.footerPriceValue}>
                {formatPrice(selectedSlot.price)}
              </Text>
              <Text style={detailStyles.footerTimeText}>
                {selectedSlot.hour} ({selectedDate.toLocaleDateString("vi-VN")})
              </Text>
            </View>
            <TouchableOpacity
              style={detailStyles.bookButton}
              onPress={() => {
                console.log(
                  `Đã chọn sân ${field.name} lúc ${
                    selectedSlot.hour
                  } vào ngày ${selectedDate.toLocaleDateString("vi-VN")}.`
                );
              }}
            >
              <Text style={detailStyles.bookButtonText}>Đặt Sân Ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={detailStyles.selectSlotText}>
            Vui lòng chọn ngày và khung giờ để đặt sân
          </Text>
        )}
      </View>
    </View>
  );
}

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollContent: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 10,
  },

  // 1. Image/Map Placeholder
  imagePlaceholder: {
    width: width,
    height: height * 0.3,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: "#666",
    position: "absolute",
    top: 20,
  },
  mapPlaceholder: {
    width: "90%",
    height: "60%",
    backgroundColor: "#fff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },

  // 2. Field Info
  fieldName: {
    fontSize: 26,
    fontWeight: "600",
    color: "#120D26",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldType: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 10,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  fieldAddress: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 10,
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  ratingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 5,
    marginRight: 20,
  },
  openingHoursText: {
    fontSize: 15,
    color: "#666",
  },

  // 3. Description (Không thay đổi)
  descriptionText: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },

  // 4. Amenities (Không thay đổi)
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  amenityItem: {
    width: "23%",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  amenityText: {
    fontSize: 12,
    color: "#444",
    marginTop: 5,
    textAlign: "center",
  },

  // 5. Time Slots
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

  // --- Footer Style (Đặt sân) ---
  footer: {
    position: "absolute",
    bottom: 0,
    width: width,
    backgroundColor: "#fff",
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  footerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerPriceLabel: {
    fontSize: 14,
    color: "#666",
  },
  footerPriceValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    marginTop: 3,
  },
  footerTimeText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
    marginTop: 2,
  },
  bookButton: {
    backgroundColor: colors.tertiaryBrand,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectSlotText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    paddingVertical: 5,
  },
});

// --- KẾT THÚC COMPONENT LỊCH MỚI ---

// Thêm styles mới vào calendarStyles
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
