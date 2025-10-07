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
    type: {
      type: String,
      enum: ["sân 5", "sân 7", "sân 11"], 
      required: true,
    },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Field", fieldSchema);
