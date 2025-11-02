import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^(0|\+84)[1-9]\d{8,9}$/,
        "Phone không hợp lệ (ví dụ: 0123456789 hoặc +84123456789)",
      ],
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    accessToken: { type: String },
    avtUrl: { type: String },

    verified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.phone) return next(new Error("Phải cung cấp phone"));
  next();
});

export default mongoose.model("User", userSchema);
