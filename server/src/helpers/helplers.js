import Booking from "../models/Booking.js";

export const autoUpdateExpiredBookings = async () => {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
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
