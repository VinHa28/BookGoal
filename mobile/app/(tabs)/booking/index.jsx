import { useState, useEffect } from "react";
import {
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
import { formatDateToYYYYMMDD } from "../../../utils/utils.js";

const UserBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await getUserBookings(formatDateToYYYYMMDD(selectedDate));
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  const onRefresh = () => {
    fetchBookings(true);
  };

  return (
    <ScrollView
      style={{
        paddingHorizontal: 24,
        paddingVertical: 20,
        backgroundColor: "white",
      }}
      refreshControl={
        <RefreshControl
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
      <BookingCalendar onDateSelect={setSelectedDate} selectInPast={true} />
      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <UpcomingBookingCard booking={item} />}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({});

export default UserBookingsScreen;
