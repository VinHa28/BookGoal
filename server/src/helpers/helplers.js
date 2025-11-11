import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import UserNotification from "../models/UserNotification.js";

export const autoUpdateExpiredBookings = async () => {
  const today = new Date().toISOString().split("T")[0];
  const cancelledResult = await Booking.updateMany(
    { date: { $lt: today }, status: "pending" },
    { $set: { status: "cancelled" } }
  );

  const completedResult = await Booking.updateMany(
    { date: { $lt: today }, status: "confirmed" },
    { $set: { status: "completed" } }
  );
  if (cancelledResult.modifiedCount > 0) {
    console.log(
      `Auto-cancelled ${cancelledResult.modifiedCount} expired bookings`
    );
  }
  if (completedResult.modifiedCount > 0) {
    console.log(
      `Auto-completed ${completedResult.modifiedCount} expired bookings`
    );
  }
};

export const createNotification = async ({
  targetType = "single",
  userId,
  title,
  message,
  link,
  data,
}) => {
  try {
    const notification = await Notification.create({
      targetType,
      title,
      message,
      link,
      data,
    });

    if (targetType === "all") {
      const user = await User.find({}, "_id");
      const userNotifitions = user.map((u) => ({
        userId: u._id,
        notificationId: notification._id,
      }));
      await UserNotification.insertMany(userNotifitions);
    } else if (targetType === "single" && userId) {
      await UserNotification.create({
        userId,
        notificationId: notification._id,
      });
    }
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw new Error("Không thể tạo thông báo");
  }
};
