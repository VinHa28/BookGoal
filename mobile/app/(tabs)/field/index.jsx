import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import Colors from "../../../constants/colors.js";
import FieldCard from "../../../components/FieldCard.jsx";
import { getFields } from "../../../services/fieldService.js";
import Loading from "../../../components/Loading.jsx";

const FIELD_TYPES = ["sân 5", "sân 7", "sân 11"];

const FilterModal = ({ isVisible, onClose, currentFilter, onApplyFilter }) => {
  const [selectedType, setSelectedType] = useState(currentFilter.type);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(
    currentFilter.timeSlot
  );

  const handleApply = () => {
    onApplyFilter({ type: selectedType, timeSlot: selectedTimeSlot });
    onClose();
  };

  const handleClear = () => {
    setSelectedType(null);
    setSelectedTimeSlot(null);
    onApplyFilter({ type: null, timeSlot: null });
    onClose();
  };

  const renderFilterOptions = (options, currentSelected, onSelect) => (
    <View style={modalStyles.filterOptions}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            modalStyles.filterButton,
            currentSelected === option && modalStyles.filterButtonSelected,
          ]}
          onPress={() => onSelect(option === currentSelected ? null : option)}
        >
          <Text
            style={[
              modalStyles.filterButtonText,
              currentSelected === option &&
                modalStyles.filterButtonTextSelected,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.centeredView}>
        <View style={modalStyles.modalView}>
          <ScrollView style={{ width: "100%" }}>
            <Text style={modalStyles.modalSubTitle}>Loại Sân</Text>
            {renderFilterOptions(FIELD_TYPES, selectedType, setSelectedType)}
          </ScrollView>

          <View style={modalStyles.modalActions}>
            <TouchableOpacity
              style={modalStyles.clearButton}
              onPress={handleClear}
            >
              <Text style={modalStyles.clearButtonText}>Xóa Lọc</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={modalStyles.applyButton}
              onPress={handleApply}
            >
              <Text style={modalStyles.applyButtonText}>Áp Dụng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SearchHeader = React.memo(
  ({ searchQuery, setSearchQuery, activeFiltersCount, setModalVisible }) => (
    <View style={screenStyles.headerContainer}>
      <View style={screenStyles.searchBar}>
        <Icon
          name="search"
          size={20}
          color={Colors.subtleText}
          style={screenStyles.searchIcon}
        />
        <TextInput
          style={screenStyles.searchInput}
          placeholder="Tìm kiếm theo tên hoặc vị trí..."
          placeholderTextColor={Colors.subtleText}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          key="search-input"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="close-circle" size={20} color={Colors.subtleText} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[
          screenStyles.filterButtonHeader,
          activeFiltersCount > 0 && screenStyles.filterButtonHeaderActive,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Icon
          name="options-outline"
          size={24}
          color={activeFiltersCount > 0 ? Colors.background : Colors.primary}
        />
        {activeFiltersCount > 0 && (
          <Text style={screenStyles.filterTextActive}>
            ({activeFiltersCount})
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
);
SearchHeader.displayName = "SearchHeader";

const FieldListScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fields, setFields] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState({ type: null, timeSlot: null });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // ✅ Thêm state refresh

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

  // ✅ Thêm hàm handleRefresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchFields();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const filteredFields = useMemo(() => {
    let result = fields;
    const filterType = filter.type ? filter.type.toLowerCase().trim() : null;
    if (filterType) {
      result = result.filter(
        (field) => field.type.toLowerCase().trim() === filterType
      );
    }

    if (filter.timeSlot) {
      result = result.filter((field) =>
        field.prices.some((price) => price.timeSlot === filter.timeSlot)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (field) =>
          field.name.toLowerCase().includes(query) ||
          field.location.toLowerCase().includes(query)
      );
    }

    return result;
  }, [fields, searchQuery, filter]);

  const activeFiltersCount = [filter.type, filter.timeSlot].filter(
    Boolean
  ).length;

  if (loading)
    return (
      <View>
        <Loading />
      </View>
    );

  return (
    <View style={screenStyles.container}>
      <FlatList
        ListHeaderComponent={
          <SearchHeader
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeFiltersCount={activeFiltersCount}
            setModalVisible={setModalVisible}
          />
        }
        data={filteredFields}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <FieldCard isVertical={true} field={item} />}
        contentContainerStyle={screenStyles.listContent}
        ListEmptyComponent={
          <Text style={screenStyles.emptyText}>
            Không tìm thấy sân bóng nào phù hợp.
          </Text>
        }
        refreshing={refreshing} // ✅ Bật state refresh
        onRefresh={handleRefresh} // ✅ Gọi hàm khi kéo xuống
      />

      <FilterModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        currentFilter={filter}
        onApplyFilter={setFilter}
      />
    </View>
  );
};

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.background,
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxHeight: "70%",
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalSubTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.subtleText,
  },
  filterButtonSelected: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  filterButtonText: {
    color: Colors.text,
    fontSize: 14,
  },
  filterButtonTextSelected: {
    fontWeight: "bold",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
  },
  applyButton: {
    backgroundColor: Colors.primary, // Màu primary cho nút áp dụng
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginLeft: 10,
  },
  applyButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: Colors.tertiaryBrand, // Màu tertiaryBrand cho nút xóa
    borderRadius: 10,
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  clearButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});

const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  headerContainer: {
    display: "flex",
    flexDirection: "row",

    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
    backgroundColor: Colors.background,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 45,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 16,
    color: Colors.text,
  },
  filterButtonHeader: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 50,
    justifyContent: "center",
    height: 45,
  },
  filterButtonHeaderActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTextActive: {
    color: Colors.background,
    marginLeft: 4,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: Colors.subtleText,
  },
});

export default FieldListScreen;
