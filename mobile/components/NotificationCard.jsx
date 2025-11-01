import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { markIsReaded } from "../services/notificationServices";

const NotificationCard = ({ notification, setOpen, isRead = false }) => {
  const router = useRouter();
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;

    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Bây giờ";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} tiếng trước`;
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const markAsReaded = async (notificationId) => {
    try {
      await markIsReaded(notificationId);
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra!");
    }
  };

  const timeAgo = getTimeAgo(notification.date);

  const handleGoToLink = () => {
    if (!isRead) markAsReaded(notification._id);
    if (!notification.link) return;
    router.push(notification.link);
    setOpen(false);
  };

  return (
    <TouchableOpacity
      style={[styles.container, !isRead && styles.unreadContainer]}
      onPress={handleGoToLink}
    >
      <View style={styles.header}>
        <Text
          style={[styles.title, !notification.isRead && styles.unreadTitle]}
        >
          {notification.title}
        </Text>
        <Text style={styles.time}>{timeAgo}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.message}>{notification.message}</Text>
      </View>

      {notification.link && (
        <TouchableOpacity style={styles.button} onPress={handleGoToLink}>
          <Text style={styles.buttonText}>Xem</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff", // Màu nền mặc định (đã đọc)
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
    borderLeftWidth: 0, // Mặc định không có đường viền trái
  },

  // Style cho thông báo CHƯA ĐỌC
  unreadContainer: {
    backgroundColor: "#e8f0fe", // Nền nhạt hơn để thu hút sự chú ý
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222", // Màu mặc định (đã đọc)
    flex: 1,
    marginRight: 10,
  },

  // Style cho tiêu đề CHƯA ĐỌC
  unreadTitle: {
    fontWeight: "700", // In đậm hơn
    color: "#000", // Màu đậm hơn
  },

  time: {
    fontSize: 13,
    color: "#777",
  },
  content: {
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  button: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
  },
});

export default NotificationCard;
