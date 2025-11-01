import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import NotificationCard from "./NotificationCard";

const NotificationWarning = () => {
  return (
    <View style={styles.warningContainer}>
      <Text style={styles.warningText}>Không có thông báo nào</Text>
    </View>
  );
};

const NotificationModal = ({ open, setOpen, notificationList }) => {
  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setOpen(false)}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Thông báo</Text>
          <TouchableOpacity onPress={() => setOpen(false)}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </View>

        {/* Nội dung */}
        <ScrollView style={styles.notificationList}>
          {notificationList && notificationList.length > 0 ? (
            notificationList.map((item) => (
              <NotificationCard
                setOpen={setOpen}
                key={item._id || item.id}
                notification={item.notificationId}
                isRead={item.isRead}
              />
            ))
          ) : (
            <NotificationWarning />
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeText: {
    fontSize: 16,
    color: "#007bff",
  },
  notificationList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  warningContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  warningText: {
    color: "#888",
    fontStyle: "italic",
  },
});

export default NotificationModal;
