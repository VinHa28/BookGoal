import {
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
import mockFields, { mockUpcoming } from "../../constants/data.js";
import Logo from "../../components/Logo";
import FiealCard from "../../components/FiealCard";
import UpcomingBookingCard from "../../components/UpcomingBookingCard.jsx";

const HEADER_PADDING_TOP =
  Platform.OS === "adroid" ? StatusBar.currentHeight + 10 : 30;

const categories = [
  { key: "5", label: "Sân 5" },
  { key: "7", label: "Sân 7" },
  { key: "11", label: "Sân 11" },
  { key: "popular", label: "Phổ biến" },
];
export default function Index() {
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryPill}>
      <Text style={styles.categoryText}>{item.label}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity style={styles.topRowButton}>
            <Ionicons name="menu-outline" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.logoContainer}>
            <Logo size={40} />
          </View>

          <TouchableOpacity style={styles.topRowButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search-outline"
            size={24}
            color={COLORS.dark}
            style={styles.searchIcon}
          />
          <TextInput style={styles.searchInput} />
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options-outline" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>
      {/* Content */}
      <ScrollView style={styles.contentContainer}>
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tìm kiếm nhanh</Text>
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.key}
            horizontal
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
            data={mockFields}
            renderItem={({ item }) => <FiealCard field={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{}}
          />
        </View>

        {/* Upcoming Booking */}
        {mockUpcoming.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Lịch đặt sân sắp tới</Text>
              <TouchableOpacity>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <UpcomingBookingCard booking={mockUpcoming[0]} />
          </View>
        )}
      </ScrollView>
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
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 38,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
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
