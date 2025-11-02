import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Linking,
  Image,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import colors from "../../../constants/colors";
import BackHeader from "../../../components/BackHeader";
import TimeSlotCard from "../../../components/TimeSlotCard";
import BookingCalendar from "../../../components/BookingCalendar";
import { getAllSlots, getFieldById } from "../../../services/fieldService";
import { formatDateToYYYYMMDD } from "../../../utils/utils";
import { createBooking } from "../../../services/bookingService";
import Loading from "../../../components/Loading";

const { height, width } = Dimensions.get("window");

const amenities = [
  { icon: "shower-head", label: "Phòng tắm" },
  { icon: "wifi", label: "Wifi miễn phí" },
  { icon: "car-side", label: "Bãi đỗ xe" },
  { icon: "storefront-outline", label: "Căn-tin" },
];

export default function FieldDetailScreen() {
  const { id } = useLocalSearchParams();

  const [field, setField] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingBooking, setLoadingBooking] = useState(false);
  const [slots, setSlots] = useState([]);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchAllSlots = async () => {
    try {
      const allSlots = await getAllSlots(
        id,
        formatDateToYYYYMMDD(selectedDate)
      );
      setSlots(allSlots);
    } catch (error) {
      console.error("Error fetching fields", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchAllSlots();
  }, [id, selectedDate]);

  useEffect(() => {
    if (!id) return;
    const fetchField = async () => {
      try {
        const data = await getFieldById(id);
        setField(data);
      } catch (error) {
        console.error("Error fetching fields", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchField();
  }, [id]);

  const handleBooking = async () => {
    try {
      setLoadingBooking(true);
      const newBooking = await createBooking(
        field._id,
        formatDateToYYYYMMDD(selectedDate),
        selectedSlot.timeSlot
      );
      if (newBooking) {
        fetchAllSlots();
        setSelectedSlot(null);
        Alert.alert("Thành công", "Đặt sân thành công");
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sân:", error);
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoadingBooking(false);
    }
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(selectedSlot?.timeSlot === slot.timeSlot ? null : slot);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const openMap = () => {
    const url = field.address;
    Linking.openURL(url);
  };

  const formatPrice = (price) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formattedDate = selectedDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  if (loading)
    return (
      <View style={detailStyles.container}>
        <BackHeader />
        <ScrollView style={detailStyles.scrollContent}>
          <Loading />
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    );
  return (
    <View style={detailStyles.container}>
      <BackHeader />
      <ScrollView style={detailStyles.scrollContent}>
        <View style={{ marginBottom: 16 }}>
          <Image
            source={{
              uri: field.image || "",
            }}
            style={detailStyles.imagePlaceholder}
          />
        </View>
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
            <Text style={detailStyles.fieldAddress}>{field.location}</Text>
            <Ionicons
              name="arrow-forward-circle-outline"
              size={20}
              color={colors.tertiaryBrand}
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
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
            {amenities.map((item, index) => (
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
          {/* Booking calendar */}
          <Text style={detailStyles.sectionTitle}>Chọn Ngày Đặt Sân</Text>
          <BookingCalendar onDateSelect={handleDateSelect} />

          {/* Time slots */}
          <Text style={[detailStyles.sectionTitle, { marginTop: 20 }]}>
            Khung Giờ ({formattedDate})
          </Text>
          <FlatList
            data={slots}
            keyExtractor={(item) => item.timeSlot}
            numColumns={3}
            columnWrapperStyle={detailStyles.timeSlotRow}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <TimeSlotCard
                slot={item}
                onSelect={handleSlotSelect}
                isSelected={selectedSlot?.timeSlot === item.timeSlot}
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
              onPress={handleBooking}
              disabled={loadingBooking}
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
    backgroundColor: "white",
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
