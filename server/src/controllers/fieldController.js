import Booking from "../models/Booking.js";
import Field from "../models/Field.js";

export const getFields = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const fields = await Field.find();

    const bookings = await Booking.find({
      date: today,
      status: { $in: ["pending", "confirmed"] },
    }).select("field timeSlot");

    const bookedMap = {};
    bookings.forEach((b) => {
      const fieldId = b.field.toString();
      if (!bookedMap[fieldId]) bookedMap[fieldId] = new Set();
      bookedMap[fieldId].add(b.timeSlot);
    });

    const formatted = fields.map((field) => {
      const totalSlots = field.prices?.length || 0;
      const bookedSlots = bookedMap[field._id]?.size || 0;
      const available = Math.max(totalSlots - bookedSlots, 0);

      return {
        _id: field._id,
        name: field.name,
        location: field.location,
        image: field.images?.[0] || null,
        available,
      };
    });
    res.json(formatted);
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({ message: "Error fetching fields", error });
  }
};

export const getFieldById = async (req, res) => {
  try {
    const field = await Field.findById(req.params.id);
    if (!field) return res.status(404).json({ message: "Field not found" });
    res.json(field);
  } catch (error) {
    res.status(500).json({ message: "Error fetching field", error });
  }
};

// Add Field
export const addField = async (req, res) => {
  try {
    const { name, location, address, images, prices, description, type } =
      req.body;

    if (
      !name ||
      !location ||
      !prices ||
      !address ||
      !Array.isArray(prices) ||
      prices.length === 0 ||
      !type
    ) {
      return res.status(400).json({
        message: "Missing required fields or invalid prices/type format",
      });
    }

    const newField = new Field({
      name,
      location,
      address,
      images: images || [],
      prices,
      description: description || "",
      type,
    });

    const savedField = await newField.save();
    res
      .status(201)
      .json({ message: "Thêm sân mới thành công", field: savedField });
  } catch (error) {
    console.error("Error creating field:", error);
    res.status(500).json({ message: "Error creating field", error });
  }
};

// Update field
export const updateField = async (req, res) => {
  const { id } = req.params;
  const { name, location, address, images, prices, description, type } =
    req.body;

  try {
    const field = await Field.findById(id);
    if (!field) return res.status(404).json({ message: "Field not found" });

    if (name) field.name = name;
    if (location) field.location = location;
    if (address) field.address = address;
    if (Array.isArray(images)) field.images = images;
    if (Array.isArray(prices)) field.prices = prices;
    if (description !== undefined) field.description = description;
    if (type) field.type = type; // 🆕 cho phép update loại sân

    const updatedField = await field.save();
    res
      .status(200)
      .json({ message: "Field updated successfully", field: updatedField });
  } catch (error) {
    console.log("Error updating field", error);
    res.status(500).json({ message: "Error updating field", error });
  }
};

export const getBookedSlots = async (req, res) => {
  const id = req.params;
  const date = req.query; //YYYY-MM-DD

  try {
    const bookings = await Booking.find({
      field: id,
      date: new Date(date),
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot");
    const bookedSlot = bookings.map((b) => b.timeSlot);
    res.json(bookedSlot);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booked slots", error });
  }
};

export const getAllSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query; //YYYY-MM-DD

  try {
    const field = await Field.findById(id).lean();

    if (!field) return res.status(404).json({ message: "Field not found!" });
    const bookings = await Booking.find({
      field: id,
      date: new Date(date),
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot");
    const bookedSlots = bookings.map((b) => b.timeSlot);
    const allSlots = field.prices.map((slot) => ({
      timeSlot: slot.timeSlot,
      price: slot.price,
      booked: bookedSlots.includes(slot.timeSlot),
      status: bookedSlots.includes(slot.timeSlot) ? "booked" : "available",
    }));
    res.json(allSlots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all slots", error });
  }
};
