import { createNotification } from "../helpers/helplers.js";
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
        type: field.type,
        location: field.location,
        image: field.image,
        available,
        prices: field.prices,
        address: field.address,
        description: field.description,
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
    const { name, location, address, image, prices, description, type } =
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
      image,
      prices,
      description: description || "",
      type,
    });

    const savedField = await newField.save();

    await createNotification({
      targetType: "all",
      userId: null,
      title: `Sân mới ${newField.name}`,
      message: `Khám phá ngay ${newField.name} với cơ sở vật chất đỉnh cao, đặt lịch ngay!`,
      link: `field/${newField._id}`,
      data: null,
    });
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
  const { name, location, address, image, prices, description, type } =
    req.body;

  try {
    const field = await Field.findById(id);
    if (!field) return res.status(404).json({ message: "Field not found" });

    if (name) field.name = name;
    if (location) field.location = location;
    if (address) field.address = address;
    if (image) field.image = image;
    if (Array.isArray(prices)) field.prices = prices;
    if (description !== undefined) field.description = description;
    if (type) field.type = type;

    const updatedField = await field.save();
    res
      .status(200)
      .json({ message: "Field updated successfully", field: updatedField });
  } catch (error) {
    console.error("Error updating field", error);
    res.status(500).json({ message: "Error updating field", error });
  }
};

export const getBookedSlots = async (req, res) => {
  const { id } = req.params;
  const { date } = req.query; //YYYY-MM-DD
  if (!id || !date) {
    return res.status(400).json({ message: "Field ID và ngày là bắt buộc." });
  }
  try {
    const bookings = await Booking.find({
      field: id,
      date: date,
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot");
    const bookedSlot = bookings.map((b) => b.timeSlot);
    res.json(bookedSlot);
  } catch (error) {
    console.error("Error fetching booked slots", error);
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
      date: date,
      status: { $in: ["pending", "confirmed"] },
    }).select("timeSlot");
    const bookedSlots = bookings.map((b) => b.timeSlot);
    const allSlots = field.prices.map((slot) => ({
      timeSlot: slot.timeSlot,
      price: slot.price,
      booked: bookedSlots.includes(slot.timeSlot),
    }));
    res.json(allSlots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all slots", error });
  }
};

export const deleteField = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedField = await Field.findByIdAndDelete(id);
    if (!deletedField) {
      return res.status(404).json({ message: "Field not found" });
    }
    res.status(200).json({ message: "Field deleted successfully" });
  } catch (error) {
    console.error("Error deleting field", error);
    res.status(500).json({ message: "Error deleting field", error });
  }
};
