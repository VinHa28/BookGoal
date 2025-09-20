import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullName: {
      type: String,
      minlength: [2, "Full name phải ít nhất 2 ký tự"],
      trim: true,
    },
    email: { type: String, unique: true, sparse: true },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      match: [
        /^(0|\+84)[1-9]\d{8,9}$/,
        "Phone không hợp lệ (ví dụ: 0123456789 hoặc +84123456789)",
      ],
    },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  if (!this.email && !this.phone) {
    return next(new Error("Phải cung cấp ít nhất email hoặc phone"));
  }
  next();
});

export default mongoose.model("User", userSchema);
