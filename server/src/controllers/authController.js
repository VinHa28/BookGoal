import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const SALT_ROUNDS = 10; // hash strong

export const register = async (req, res) => {
  try {
    const { username, phone, password } = req.body;

    if (!username || !phone || !password) {
      return res.status(400).json({ message: "Vui lòng điền đủ thông tin" });
    }

    const existingUser = await User.findOne({
      phone,
    });
    if (existingUser) {
      return res.status(400).json({ message: "Số điện thoại đã được sử dụng" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      username,
      phone,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        username: newUser.username,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Vui lòng điền đủ thông tin" });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không đúng" });
    }

    if (user.role === "inactive") {
      return res
        .status(401)
        .json({ message: "Tài khoản này đã bị vô hiệu hóa" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không đúng" });
    }

    // Token
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
        id: user._id,
        username: user.username,
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
