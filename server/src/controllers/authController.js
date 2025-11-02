import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../config/mailer.js";

const SALT_ROUNDS = 10;

// ✅ Đăng ký + gửi OTP
export const register = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;

    if (!username || !phone || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đủ thông tin" });
    }

    const existingUser = await User.findOne({ email });

    // 🔹 Nếu đã có user với email này
    if (existingUser) {
      // Trường hợp user đã xác thực thì không cho đăng ký lại
      if (existingUser.verified) {
        return res
          .status(400)
          .json({ message: "Email đã được sử dụng. Vui lòng đăng nhập." });
      }

      // 🔹 Nếu chưa xác thực → cập nhật lại OTP, password, username, phone
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

      existingUser.username = username;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;

      await existingUser.save();

      // 🔹 Gửi lại OTP qua email
      const subject = "Xác thực tài khoản BookGoal";
      const text = `Mã OTP của bạn là: ${otp}`;
      const html = `
        <div style="font-family: Arial, sans-serif; padding: 12px;">
          <h2>Xin chào ${username},</h2>
          <p>Bạn đã yêu cầu xác thực lại tài khoản BookGoal.</p>
          <p>Mã xác thực (OTP) của bạn là:</p>
          <h1 style="color:#007bff;">${otp}</h1>
          <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
        </div>
      `;
      await sendEmail(email, subject, text, html);

      return res.status(200).json({
        message:
          "Email đã tồn tại nhưng chưa xác thực. OTP mới đã được gửi lại qua email.",
        user: {
          id: existingUser._id,
          username: existingUser.username,
          phone: existingUser.phone,
          email: existingUser.email,
        },
      });
    }

    // 🔹 Nếu email chưa tồn tại → tạo user mới
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    const newUser = new User({
      username,
      phone,
      email,
      password: hashedPassword,
      otp,
      otpExpires,
      verified: false,
    });

    await newUser.save();

    // 🔹 Gửi email OTP cho tài khoản mới
    const subject = "Xác thực tài khoản BookGoal";
    const text = `Mã OTP của bạn là: ${otp}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 12px;">
        <h2>Xin chào ${username},</h2>
        <p>Cảm ơn bạn đã đăng ký tài khoản BookGoal!</p>
        <p>Mã xác thực (OTP) của bạn là:</p>
        <h1 style="color:#007bff;">${otp}</h1>
        <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
      </div>
    `;
    await sendEmail(email, subject, text, html);

    res.status(201).json({
      message:
        "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP xác thực.",
      user: {
        id: newUser._id,
        username: newUser.username,
        phone: newUser.phone,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (user.verified)
      return res.status(400).json({ message: "Email đã được xác thực" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Mã OTP không đúng" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "Mã OTP đã hết hạn" });

    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Xác thực email thành công 🎉" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Vui lòng nhập email và mật khẩu" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    if (user.status === "inactive")
      return res.status(401).json({ message: "Tài khoản đã bị vô hiệu hóa" });

    if (!user.verified)
      return res.status(401).json({
        message: "Email chưa được xác thực. Vui lòng kiểm tra hộp thư.",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Email hoặc mật khẩu không đúng" });

    // Tạo JWT Token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.accessToken = accessToken;
    await user.save();

    res.json({
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avtUrl: user.avtUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logout thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng với email này" });

    if (!user.verified)
      return res.status(400).json({
        message: "Email chưa được xác thực. Không thể đặt lại mật khẩu.",
      });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    await user.save();

    const subject = "Đặt lại mật khẩu - BookGoal";
    const text = `Mã OTP để đặt lại mật khẩu của bạn là: ${otp}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 12px;">
        <h2>Xin chào ${user.username},</h2>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản BookGoal.</p>
        <p>Mã OTP của bạn là:</p>
        <h1 style="color:#007bff;">${otp}</h1>
        <p>Mã này sẽ hết hạn sau <b>5 phút</b>.</p>
      </div>
    `;
    await sendEmail(email, subject, text, html);

    res.json({ message: "Đã gửi mã OTP đặt lại mật khẩu đến email của bạn." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: "Thiếu thông tin cần thiết" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Mã OTP không đúng" });

    if (user.otpExpires < Date.now())
      return res.status(400).json({ message: "Mã OTP đã hết hạn" });

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.password = hashedPassword;

    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công 🎉" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword)
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đủ mật khẩu cũ và mới" });

    const user = await User.findById(userId);
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Đổi mật khẩu thành công 🎉" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};
