/* eslint-disable no-empty */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Input,
  Modal,
  Form,
  Switch,
  Select,
  Popconfirm,
} from "antd";
import { message } from "antd";

import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { deleteUser, getAllUsers, updateUserStatus } from "../../services/api";

const { Search } = Input;
const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      const data =
        res.data?.map((user, index) => ({
          index: index + 1,
          ...user,
          status: user.status || "active",
        })) || [];
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      messageApi.error("Không thể tải danh sách người dùng!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔍 Tìm kiếm
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = users.filter((u) =>
      [u.username, u.phone, u.role]
        .join(" ")
        .toLowerCase()
        .includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  // ⚙️ Đổi trạng thái (active/inactive)
  const toggleStatus = async (id, status) => {
    try {
      const res = await updateUserStatus(id, { status });
      if (res) {
        messageApi.success("Đã cập nhật trạng thái người dùng!");
      }
    } catch (error) {
      messageApi.error("Lỗi không thể cập nhật trạng thái người dùng!");
    } finally {
      fetchUsers();
    }
  };

  // ❌ Xóa người dùng
  const handleDelete = async (id) => {
    try {
      const res = await deleteUser(id);
      if (res) {
        messageApi.success("Đã xóa người dùng!");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          error.message ||
          "Lỗi không thể xóa người dùng"
      );
    } finally {
      fetchUsers();
    }
  };

  const openModal = () => {
    form.resetFields();
    setIsModalOpen(true);
  };

  // 💾 Lưu user mới
  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        const newUser = {
          _id: Date.now().toString(),
          index: users.length + 1,
          username: values.username,
          phone: values.phone,
          role: values.role || "user",
          status: "active",
        };
        const updated = [...users, newUser];
        setUsers(updated);
        setFilteredUsers(updated);
        messageApi.success("Đã thêm người dùng!");
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch(() => {});
  };

  const columns = [
    { title: "ID", dataIndex: "index", key: "index", width: 60 },
    { title: "Tên", dataIndex: "username", key: "username" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (st, r) => (
        <Space>
          <Tag color={st === "active" ? "green" : "gray"}>
            {st === "active" ? "Kích hoạt" : "Vô hiệu hóa"}
          </Tag>
          <Switch
            checked={st === "active"}
            onChange={() =>
              toggleStatus(r._id, r.status === "active" ? "inactive" : "active")
            }
          />
          {st === "inactive" && (
            <Popconfirm
              title="Xóa người dùng này?"
              onConfirm={() => handleDelete(r._id)}
            >
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                style={{ marginLeft: 8 }}
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0 }}>Quản lý người dùng</h2>
        <Space>
          <Search
            placeholder="Tìm theo tên, SĐT, vai trò..."
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
            value={searchText}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
            Thêm người dùng
          </Button>
        </Space>
      </div>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
      />

      <Modal
        title="Thêm người dùng"
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên người dùng"
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập SĐT!" },
              {
                pattern: /^(0|\+84)[1-9]\d{8,9}$/,
                message: "SĐT không hợp lệ!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;
