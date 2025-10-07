import Booking from "../models/Booking.js";
import Field from "../models/Field.js";

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
    console.log(error);
    res.status(500).json({ message: "Error creating booking" }, errors);
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("field", "name location")
      .populate("user", "username phone");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "field",
      "name location"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user bookings" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm booking theo ID
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (err) {
    console.error(err);
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
