import { autoUpdateExpiredBookings } from "../helpers/helplers.js";
import Booking from "../models/Booking.js";
import Field from "../models/Field.js";
import User from "../models/User.js";

export const getStats = async (req, res) => {
  try {
    await autoUpdateExpiredBookings();
    const totalUsers = await User.countDocuments();
    const totalFields = await Field.countDocuments();
    const totalBookings = await Booking.countDocuments();

    const revenueData = await Booking.aggregate([
      {
        $match: {
          status: { $in: ["completed"] },
          price: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$price" },
          count: { $sum: 1 },
        },
      },
    ]);

    const revenue = revenueData.length > 0 ? revenueData[0].total : 0;
    res.status(200).json({
      totalUsers,
      totalBookings,
      totalFields,
      revenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
