import { useId } from "react";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ role: 1 })
      .select("-password -accessToken");
    res.status(200).json(users);
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).json({ message: "Error getting users" });
  }
};

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

export const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const userId = req.params.id;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    user.status = status;
    await user.save();

    res.status(200).json({
      message: "Cập nhật trạng thái thành công!",
      user: {
        _id: user._id,
        username: user.username,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ message: "Error updating user status" });
  }
};

export const updateUserName = async (req, res) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!username || username.trim() === "")
      return res.status(400).json({ message: "Username cannot be empty" });

    user.username = username;
    await user.save();

    return res.status(200).json({
      message: "Username updated successfully",
    });
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ message: "Error updating user" });
  }
};
