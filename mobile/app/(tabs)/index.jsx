import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import COLORS from "../../constants/colors";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Logo from "../../components/Logo";
import UpcomingBookingCard from "../../components/UpcomingBookingCard.jsx";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getFields } from "../../services/fieldService.js";
import FiedlCard from "../../components/FiealCard";
import { getLatestBooking } from "../../services/bookingService.js";

const HEADER_PADDING_TOP =
  Platform.OS === "adroid" ? StatusBar.currentHeight + 10 : 30;

const categories = [
  { key: "5", label: "Sân 5" },
  { key: "7", label: "Sân 7" },
  { key: "11", label: "Sân 11" },
];
export default function Index() {
  const [fields, setFields] = useState([]);
  const [latestBooking, setLatestBooking] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchFields = async () => {
    try {
      setLoading(true);
      const data = await getFields();
      setFields(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sân:", error);
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatesBooking = async () => {
    try {
      setLoading(true);
      const data = await getLatestBooking();
      if (data) setLatestBooking(data);
    } catch (error) {
      console.error("Lỗi khi lấy booking: ", error);
      Alert.alert("Lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryPill}>
      <Text style={styles.categoryText}>{item.label}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    fetchFields();
    fetchLatesBooking();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View></View>
          <View style={styles.logoContainer}>
            <Logo size={40} />
          </View>
          <TouchableOpacity style={styles.topRowButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.userLocation}>
          <Ionicons name="location-outline" color={"white"} size={24} />
          <Text style={{ color: "white" }}> Địa chỉ chỗ này</Text>
        </View>
      </View>
      {/* Content */}
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.contentContainer}>
          {/* Categories */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tìm kiếm nhanh</Text>
            </View>
            <FlatList
              data={categories}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
              renderItem={renderCategoryItem}
            />
          </View>

          {/* Near Me */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sân bóng gần bạn</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={fields}
              renderItem={({ item }) => <FiedlCard field={item} />}
              keyExtractor={(item, index) =>
                item._id?.toString() || item.id?.toString() || index.toString()
              }
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{}}
            />
          </View>

          {/* Upcoming Booking */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lịch đặt sân sắp tới</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            {Object.keys(latestBooking).length === 0 ? (
              <Text style={{ fontStyle: "italic" }}>
                Chưa có lịch đặt sân nào sắp tới
              </Text>
            ) : (
              <UpcomingBookingCard booking={latestBooking} />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,

    paddingTop: HEADER_PADDING_TOP,
    paddingBottom: 24,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  topRowButton: {
    padding: 5,
  },
  logoContainer: {
    alignItems: "center",
  },
  userLocation: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  userLocationText: {
    color: "#fff",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: 500,
    color: COLORS.text,
    fontSize: 16,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "500",
  },

  // Categories
  categoryList: {
    paddingBottom: 20,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    height: 42,
    paddingHorizontal: 24,
    marginRight: 10,
    borderRadius: 10,
  },
  categoryText: {
    color: "white",
    fontSize: 16,
    fontWeight: 300,
  },
});
