import Notification from "../models/Notification.js";
import User from "../models/User.js";
import UserNotification from "../models/UserNotification.js";

export const createNotification = async (req, res) => {
  try {
    const { targetType, userId, title, message, link, data } = req.body;

    const notification = await Notification.create({
      targetType,
      title,
      message,
      link,
      data,
    });

    if (targetType === "single") {
      await UserNotification.create({
        userId,
        notificationId: notification._id,
      });
    } else if (targetType === "all") {
      const users = await User.find({}, "_id");
      const records = users.map((u) => ({
        userId: u._id,
        notificationId: notification._id,
      }));
      await UserNotification.insertMany(records);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const markAsRead = async (req, res) => {
  const userId = req.user.id;
  const { notificationId } = req.body;

  await UserNotification.findOneAndUpdate(
    { userId, notificationId },
    { isRead: true, readAt: new Date() }
  );

  res.status(200).json({ success: true });
};

export const getUnreadCount = async (req, res) => {
  const userId = req.user.id;
  const count = await UserNotification.countDocuments({
    userId,
    isRead: false,
  });
  res.json({ unreadCount: count });
};

export const getUserNotifications = async (req, res) => {
  const userId = req.user.id;
  const notifications = await UserNotification.find({ userId })
    .populate("notificationId")
    .sort({ createdAt: -1 });
  res.json(notifications);
};
