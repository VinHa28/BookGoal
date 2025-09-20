import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    prices: [
      {
        timeSlot: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Field", fieldSchema);
