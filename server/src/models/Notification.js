import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["single", "all"],
      required: true,
      default: "single",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    data: { type: mongoose.Schema.Types.Mixed },
    date: { type: Date, default: Date.now },
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: "30d" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
