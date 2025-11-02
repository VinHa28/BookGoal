import cron from "node-cron";
import Booking from "../models/Booking.js";
import Field from "../models/Field.js";
import Notification from "../models/Notification.js";
import {
  autoUpdateExpiredBookings,
  createNotification,
} from "../helpers/helplers.js";

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

    const { date } = req.body;
    const filter = { user: req.user.id };

    if (date) {
      filter.date = date;
    }

    let bookings = await Booking.find(filter).populate("field").lean();

    bookings.sort((a, b) => {
      const dateDiff = b.date.localeCompare(a.date);
      if (dateDiff !== 0) return dateDiff;

      const getStartTime = (slot) => slot.split(" - ")[0];
      return getStartTime(a.timeSlot).localeCompare(getStartTime(b.timeSlot));
    });

    const formatted = bookings.map((b) => ({
      _id: b._id,
      fieldName: b.field?.name,
      location: b.field?.location,
      date: b.date,
      timeSlot: b.timeSlot,
      price: b.price,
      status: b.status,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ message: "Error fetching user bookings" });
  }
};

export const getUserLatestBooking = async (req, res) => {
  try {
    await autoUpdateExpiredBookings();

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayString = `${year}-${month}-${day}`;

    const todayBookings = await Booking.find({
      user: req.user.id,
      date: todayString,
    })
      .sort({ timeSlot: 1 })
      .populate("field", "name location");
    if (todayBookings.length > 0) {
      const formatted = todayBookings.map((b) => ({
        _id: b._id,
        fieldName: b.field?.name,
        location: b.field?.location,
        date: b.date,
        timeSlot: b.timeSlot,
        price: b.price,
        status: b.status,
      }));
      return res.status(200).json(formatted);
    }

    const nextBooking = await Booking.findOne({
      user: req.user.id,
      date: { $gt: todayString },
    })
      .sort({ date: 1, timeSlot: 1 })
      .populate("field", "name location");

    if (!nextBooking) {
      return res.status(200).json([]);
    }

    const formattedNext = [
      {
        _id: nextBooking._id,
        fieldName: nextBooking.field?.name,
        location: nextBooking.field?.location,
        date: nextBooking.date,
        timeSlot: nextBooking.timeSlot,
        price: nextBooking.price,
        status: nextBooking.status,
      },
    ];

    res.status(200).json(formattedNext);
  } catch (error) {
    console.error("Error fetching latest booking:", error);
    res.status(500).json({ message: "Error fetching user booking" });
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
      .populate("user")
      .select("_id field user date timeSlot status price")
      .sort({ date: 1, timeSlot: 1 });

    // Format kết quả trả về
    const formatted = bookings.map((b) => ({
      _id: b._id,
      fieldName: b.field?.name || "Chưa có tên sân",
      user: {
        username: b.user?.username || "Ẩn danh",
        phone: b.user?.phone || null,
      },
      date: b.date,
      timeSlot: b.timeSlot,
      status: b.status,
      price: b.price,
    }));

    res.status(200).json({ recentBookings: formatted });
  } catch (error) {
    console.error("Error getting recent bookings:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi lấy booking gần đây", error });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === "admin";

    const booking = await Booking.findById(id).populate("field");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== userId && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (isAdmin) {
      booking.status = "cancelled";
    } else {
      if (booking.status === "pending") {
        booking.status = "cancelled";
      } else if (booking.status === "confirmed") {
        booking.status = "requestCancel";
      } else {
        return res.status(400).json({
          message: `Cannot cancel booking in '${booking.status}' status`,
        });
      }
    }

    await booking.save();

    const title = "Booking bị hủy";
    const message = `Yêu cầu đặt sân "${booking.field.name}" của bạn đã bị hủy.`;
    await createNotification({
      targetType: "single",
      userId: booking.user._id,
      title,
      message,
      link: `booking/${booking._id}`,
      data: { bookingId: booking._id, status: booking.status },
    });

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

    const title = "Booking được chấp nhận";
    const message = `Yêu cầu đặt sân "${booking.field.name}", vào lúc "${booking.timeSlot}" của bạn đã được chấp nhận.`;

    await createNotification({
      targetType: "single",
      userId: booking.user._id,
      title,
      message,
      link: `booking/${booking._id}`,
      data: { bookingId: booking._id, status: booking.status },
    });

    res.status(200).json({
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error confirming booking" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Thiếu trường 'status'",
      });
    }

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

    const booking = await Booking.findById(id)
      .populate("user", "username")
      .populate("field", "name");
    if (!booking)
      return res.status(404).json({ message: "Không tìm thấy booking" });

    booking.status = status;
    await booking.save();

    let title, message;
    switch (status) {
      case "confirmed":
        title = "Booking được chấp nhận";
        message = `Yêu cầu đặt sân "${booking.field.name}" vào lúc "${booking.timeSlot}" của bạn đã được chấp nhận.`;
        break;
      case "cancelled":
        title = "Booking bị hủy";
        message = `Yêu cầu đặt sân "${booking.field.name}"  vào lúc "${booking.timeSlot}" của bạn đã bị hủy.`;
        break;
      case "completed":
        title = "Booking hoàn tất";
        message = `Cảm ơn bạn, booking sân "${booking.field.name}"  vào lúc "${booking.timeSlot}" đã hoàn tất.`;
        break;
      case "requestCancel":
        title = "Yêu cầu hủy booking";
        message = `Bạn đã gửi yêu cầu hủy booking sân "${booking.field.name}".`;
        break;
      default:
        title = "Cập nhật booking";
        message = `Trạng thái booking sân "${booking.field.name}" đã được cập nhật.`;
        break;
    }

    await createNotification({
      targetType: "single",
      userId: booking.user._id,
      title,
      message,
      link: `booking/${booking._id}`,
      data: { bookingId: booking._id, status },
    });

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái booking thành công",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res
      .status(500)
      .json({ message: "Lỗi server khi cập nhật trạng thái booking" });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("field", "name location address image")
      .lean();
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
};

export const requestCancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this booking" });
    }

    if (booking.status === "requestCancel") {
      booking.status = "confirmed";
      await booking.save();
      return res
        .status(200)
        .json({ request: false, message: "Đã hủy yêu cầu" });
    }

    if (booking.status === "confirmed") {
      booking.status = "requestCancel";
      await booking.save();
      return res
        .status(200)
        .json({ request: true, message: "Đã yêu cầu hủy đặt sân" });
    }

    return res
      .status(400)
      .json({ message: "Không thể yêu cầu hủy ở trạng thái hiện tại" });
  } catch (error) {
    console.error("Error server:", error);
    res.status(500).json({ message: "Error server" });
  }
};
