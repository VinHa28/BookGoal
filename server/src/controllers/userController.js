import User from "../models/User.js";
import bcrypt from "bcrypt";

// Lấy danh sách tất cả người dùng (chỉ admin)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -accessToken");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ message: "Error getting users" });
  }
};

// Lấy thông tin chi tiết 1 người dùng theo ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -accessToken"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).json({ message: "Error getting user" });
  }
};

// Cập nhật người dùng (chỉ admin)
export const updateUser = async (req, res) => {
  try {
    const { username, phone, password, role, avtUrl, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (avtUrl) user.avtUrl = avtUrl;
    if (status) user.status = status; 

    if (password) {
      const saltRounds = 10;
      user.password = await bcrypt.hash(password, saltRounds);
    }

    const updatedUser = await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        username: updatedUser.username,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
        avtUrl: updatedUser.avtUrl,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Error updating user" });
  }
};

// Xóa người dùng (chỉ admin)
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user" });
  }
};
