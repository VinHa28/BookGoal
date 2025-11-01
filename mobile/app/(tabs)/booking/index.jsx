import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from "react-native";

import { getUserBookings } from "../../../services/bookingService";

import COLORS from "../../../constants/colors.js";
import UpcomingBookingCard from "../../../components/UpcomingBookingCard.jsx";
import BookingCalendar from "../../../components/BookingCalendar.jsx";
import Loading from "../../../components/Loading.jsx";

const UserBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBookings = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    try {
      const data = await getUserBookings();
      setBookings(data);
    } catch (err) {
      console.error("Lỗi khi fetch bookings:", err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(false);
  }, [fetchBookings]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchBookings(true);
  };

  if (isLoading && !isRefreshing) {
    return (
      <View>
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView
      style={{
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: "white",
      }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.text,
          marginBottom: 28,
        }}
      >
        Lịch sử đặt sân
      </Text>
      <BookingCalendar />

      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <UpcomingBookingCard booking={item} />}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({});

export default UserBookingsScreen;
