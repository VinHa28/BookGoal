import {
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Image,
} from "react-native";
import COLORS, { hexToRgba } from "../../constants/colors";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import UpcomingBookingCard from "../../components/UpcomingBookingCard.jsx";
import { useCallback, useState } from "react";
import { getFields } from "../../services/fieldService.js";
import FieldCard from "../../components/FieldCard.jsx";
import { getLatestBooking } from "../../services/bookingService.js";
import { useFocusEffect, useRouter } from "expo-router";
import NotificationModal from "../../components/NotificationModal.jsx";
import {
  getNotifications,
  getUnreadNotifications,
} from "../../services/notificationServices.js";
import Loading from "../../components/Loading.jsx";

const HEADER_PADDING_TOP =
  Platform.OS === "adroid" ? StatusBar.currentHeight + 10 : 20;

export default function Index() {
  const router = useRouter();
  const [fields, setFields] = useState([]);
  const [latestBooking, setLatestBooking] = useState({});
  const [loading, setLoading] = useState(false);
  const [unreadNumber, setUnreadNumber] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [openNotiModal, setOpenNotiModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      const unreadNumberData = await getUnreadNotifications();
      setUnreadNumber(unreadNumberData.unreadCount);
      setNotifications(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFields = async () => {
    try {
      const data = await getFields();
      setFields(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sân:", error);
      Alert.alert("Lỗi", error.message);
    }
  };

  const fetchLatesBooking = async () => {
    try {
      const data = await getLatestBooking();
      if (data) setLatestBooking(data);
    } catch (error) {
      console.error("Lỗi khi lấy booking: ", error);
      Alert.alert("Lỗi", error.message);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([
      fetchFields(),
      fetchLatesBooking(),
      fetchNotifications(),
    ]);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([
      fetchFields(),
      fetchLatesBooking(),
      fetchNotifications(),
    ]);
    setIsRefreshing(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <TouchableOpacity onPress={onRefresh}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Text
                  style={{ color: hexToRgba("#ffffff", 0.7), fontSize: 12 }}
                >
                  Vị trí của bạn
                </Text>
                <Image
                  source={require("../../assets/images/rectangle_down.png")}
                  style={{
                    objectFit: "contain",
                  }}
                />
              </View>
              <Text style={{ color: "white", fontWeight: 500 }}>
                Hòa Lạc, Thạch Thất
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.topRowButton}
            onPress={() => {
              setOpenNotiModal(true);
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="white" />
            {unreadNumber !== 0 && (
              <Text style={styles.numberNotification}>{unreadNumber}</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.userLocation}>
          <Ionicons name="location-outline" color={"white"} size={24} />
          <Text style={{ color: "white" }}> {"userAddress"}</Text>
        </View>
      </View>
      {/* Content */}
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          style={styles.contentContainer}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {/* Near Me */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sân bóng gần bạn</Text>
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
                onPress={() => router.replace("/(tabs)/field")}
              >
                <Text style={styles.seeAll}>Xem tất cả</Text>
                <Image
                  source={require("../../assets/images/rectangle_right.png")}
                  style={{
                    width: 7,
                    height: 9,
                    marginTop: 3,
                    objectFit: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={fields}
              renderItem={({ item }) => <FieldCard field={item} />}
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
              <TouchableOpacity
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
                onPress={() => router.replace("/(tabs)/booking")}
              >
                <Text style={styles.seeAll}>Xem tất cả</Text>
                <Image
                  source={require("../../assets/images/rectangle_right.png")}
                  style={{
                    width: 7,
                    height: 9,
                    marginTop: 3,
                    objectFit: "contain",
                  }}
                />
              </TouchableOpacity>
            </View>
            {Object.keys(latestBooking).length === 0 ||
            (Array.isArray(latestBooking) && latestBooking.length === 0) ? (
              <Text style={{ fontStyle: "italic" }}>
                Chưa có lịch đặt sân nào sắp tới
              </Text>
            ) : (
              <FlatList
                data={
                  Array.isArray(latestBooking) ? latestBooking : [latestBooking]
                }
                renderItem={({ item }) => (
                  <UpcomingBookingCard booking={item} />
                )}
                keyExtractor={(item, index) =>
                  item._id?.toString() ||
                  item.id?.toString() ||
                  index.toString()
                }
                showsVerticalScrollIndicator={false}
                vertical
                scrollEnabled={false}
              />
            )}
          </View>
          <NotificationModal
            open={openNotiModal}
            setOpen={setOpenNotiModal}
            notificationList={notifications}
          />
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
    paddingHorizontal: 16,
    paddingTop: HEADER_PADDING_TOP,
  },

  numberNotification: {
    color: COLORS.tertiaryBrand,
    position: "absolute",
    left: 20,
    top: "-3",
    backgroundColor: "white",
    textAlign: "center",
    lineHeight: 16,
    fontSize: 12,
    fontWeight: "600",
    width: 16,
    height: 16,
    borderRadius: 8,
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
    paddingBottom: 15,
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
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontWeight: "500",
    color: COLORS.text,
    fontSize: 16,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.subtleText,
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
    fontWeight: "300", // Fix style string
  },
});
