import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const SALT_ROUNDS = 10; // hash strong

// Register
export const register = async (req, res) => {
  try {
    const { username, fullName, email, phone, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { phone }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username, email hoặc phone đã tồn tại" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new user
    const newUser = new User({
      username,
      fullName: fullName || null,
      email: email || null,
      phone: phone || null,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser._id,
        username,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server: " + error.message });
  }
};

// Login (identifier: username, email or phone)
export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = await User.findOne({
      $or: [
        { username: identifier },
        { phone: identifier },
        { email: identifier },
      ],
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không đúng" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Thông tin đăng nhập không đúng" });

    // Token
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" + error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    // Xóa refresh token
    user.refreshToken = null;
    await user.save();

    res.json({ message: "Logout thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
