import cron from "node-cron";
import Booking from "../models/Booking.js";
import Field from "../models/Field.js";
import Notification from "../models/Notification.js";
import { autoUpdateExpiredBookings } from "../helpers/helplers.js";

cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const result = await Booking.updateMany(
      {
        date: { $lt: todayString },
        status: "pending",
      },
      { $set: { status: "cancelled" } }
    );

    console.log(`Auto-cancelled ${result.modifiedCount} expired bookings`);
  } catch (error) {
    console.error("Error in auto-cancel cron job:", error);
  }
});

export const createBooking = async (req, res) => {
  try {
    const { fieldId, date, timeSlot } = req.body;
    const userId = req.user.id;
    const field = await Field.findById(fieldId);
    if (!field) return res.status(404).json({ message: "Field not found" });

    const existingBooking = await Booking.findOne({
      field: fieldId,
      date,
      timeSlot,
      status: { $ne: "cancelled" },
    });

    if (existingBooking)
      return res.status(400).json({ message: "Slot already booked" });

    const priceObj = field.prices.find((p) => p.timeSlot === timeSlot);
    const price = priceObj ? priceObj.price : 0;
    const booking = await Booking.create({
      field: fieldId,
      date,
      user: userId,
      timeSlot,
      price,
    });
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating booking" }, error);
  }
};

export const getAllBookings = async (req, res) => {
  try {
    await autoUpdateExpiredBookings();

    const bookings = await Booking.find()
      .populate("field", "name location")
      .populate("user", "username phone");

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    await autoUpdateExpiredBookings();

    const { search, fromDate, toDate, status } = req.body;
    const filter = { user: req.user.id };

    // ⏰ Lọc theo khoảng ngày
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = fromDate;
      if (toDate) filter.date.$lte = toDate;
    }

    // ⚙️ Lọc theo trạng thái
    if (status && status !== "all") {
      filter.status = status;
    }

    // 🔍 Lọc theo từ khóa
    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search, "i");
      const fields = await Field.find({
        $or: [{ name: searchRegex }, { location: searchRegex }],
      }).select("_id");

      filter.$or = [
        { field: { $in: fields.map((f) => f._id) } },
        { date: searchRegex },
        { status: searchRegex },
      ];
    }

    let bookings = await Booking.find(filter)
      .populate("field", "name location")
      .lean();

    // 🔽 Sắp xếp: date giảm dần, timeSlot tăng dần
    bookings.sort((a, b) => {
      const dateDiff = new Date(b.date) - new Date(a.date);
      if (dateDiff !== 0) return dateDiff;

      const getStartTime = (slot) => slot.split(" - ")[0];
      return getStartTime(a.timeSlot).localeCompare(getStartTime(b.timeSlot));
    });

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
};

export const getUserLatestBooking = async (req, res) => {
  try {
    await autoUpdateExpiredBookings(); // ✅ cập nhật trước khi lấy dữ liệu

    const booking = await Booking.findOne({ user: req.user.id })
      .sort({ date: -1, timeSlot: 1 })
      .populate("field", "name location");

    if (!booking) return res.status(200).json({});

    const formatted = {
      _id: booking._id,
      fieldName: booking.field.name,
      date: booking.date,
      timeSlot: booking.timeSlot,
      price: booking.price,
      status: booking.status,
    };

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching latest booking:", error);
    res.status(500).json({ message: "Error fetching user booking" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    // 🔍 Tìm booking theo ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // ⛔ Kiểm tra quyền
    if (booking.user.toString() !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    // ⛔ Kiểm tra trạng thái hiện tại
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }
    if (booking.status === "requestCancel") {
      return res
        .status(400)
        .json({ message: "Booking already requested to cancel" });
    }

    // ⚙️ Xử lý logic theo vai trò
    if (isAdmin) {
      // Admin có thể hủy bất kỳ booking nào
      booking.status = "cancelled";
    } else {
      // User hủy booking
      if (booking.status === "pending") {
        booking.status = "cancelled"; // pending → cancelled
      } else if (booking.status === "confirmed") {
        booking.status = "requestCancel"; // confirmed → requestCancel
      } else {
        return res.status(400).json({
          message: `Cannot cancel booking in '${booking.status}' status`,
        });
      }
    }

    await booking.save();

    res.status(200).json({
      message: isAdmin
        ? "Booking cancelled successfully by admin"
        : booking.status === "requestCancel"
        ? "Cancel request sent successfully"
        : "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error("Error cancelling booking:", err);
    res.status(500).json({ message: "Error cancelling booking" });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("user", "name email")
      .populate("field", "name");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admin can confirm bookings" });
    }

    if (booking.status === "confirmed") {
      return res.status(400).json({ message: "Booking already confirmed" });
    }
    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Cannot confirm a cancelled booking" });
    }

    booking.status = "confirmed";
    await booking.save();

    res.status(200).json({
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error confirming booking" });
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const bookings = await Booking.find({ date: { $gte: todayStr } })
      .populate("field", "name")
      .populate("user", "username")
      .select("_id field user date timeSlot status")
      .sort({ date: 1, timeSlot: 1 });

    // Format kết quả trả về
    const formatted = bookings.map((b) => ({
      _id: b._id,
      fieldName: b.field?.name || "Chưa có tên sân",
      user: b.user?.username || "Ẩn danh",
      date: b.date,
      timeSlot: b.timeSlot,
      status: b.status,
    }));

    res.status(200).json({ recentBookings: formatted });
  } catch (error) {
    console.error("Error getting recent bookings:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy booking gần đây", error });
  }
};

// 🔔 Hàm helper tạo notification
const createBookingNotification = async (booking, newStatus, oldStatus) => {
  try {
    const statusMessages = {
      pending: {
        title: "Đặt sân đang chờ xử lý",
        message: `Booking của bạn tại ${booking.field.name} vào ${booking.date} (${booking.timeSlot}) đang chờ xác nhận.`,
      },
      confirmed: {
        title: "Đặt sân đã được xác nhận",
        message: `Booking của bạn tại ${booking.field.name} vào ${booking.date} (${booking.timeSlot}) đã được xác nhận.`,
      },
      cancelled: {
        title: "Đặt sân đã bị hủy",
        message: `Booking của bạn tại ${booking.field.name} vào ${booking.date} (${booking.timeSlot}) đã bị hủy bởi admin.`,
      },
      requestCancel: {
        title: "Yêu cầu hủy đặt sân",
        message: `Yêu cầu hủy booking tại ${booking.field.name} vào ${booking.date} (${booking.timeSlot}) đang được xử lý.`,
      },
      completed: {
        title: "Đặt sân đã hoàn thành",
        message: `Booking của bạn tại ${booking.field.name} vào ${booking.date} (${booking.timeSlot}) đã hoàn thành.`,
      },
    };

    const notificationData = statusMessages[newStatus];
    if (!notificationData) return;

    await Notification.create({
      targetType: "single",
      userId: booking.user._id,
      title: notificationData.title,
      message: notificationData.message,
      link: `/bookings/${booking._id}`,
      data: {
        bookingId: booking._id,
        fieldName: booking.field.name,
        date: booking.date,
        timeSlot: booking.timeSlot,
        oldStatus,
        newStatus,
      },
    });

    console.log(`Notification created for user ${booking.user._id} - Status: ${newStatus}`);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Kiểm tra có status không
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Thiếu trường 'status'",
      });
    }

    // Danh sách trạng thái hợp lệ
    const validStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "requestCancel",
      "completed",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Trạng thái không hợp lệ",
      });
    }

    // Lấy booking trước khi update để có oldStatus
    const oldBooking = await Booking.findById(id);
    if (!oldBooking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking",
      });
    }

    const oldStatus = oldBooking.status;

    // Tìm và cập nhật booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("user", "username")
      .populate("field", "name");

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking",
      });
    }

    // 🔔 Tạo notification cho user nếu status thay đổi
    if (oldStatus !== status) {
      await createBookingNotification(updatedBooking, status, oldStatus);
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái booking thành công",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật trạng thái booking",
    });
  }
}; 