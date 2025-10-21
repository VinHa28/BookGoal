import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers([
      { _id: "1", username: "Nguyễn Văn A", phone: "0123456789", role: "user", status: "active" },
      { _id: "2", username: "Admin", phone: "0999999999", role: "admin", status: "active" },
    ]);
  }, []);

  const handleDelete = (id) => {
    setUsers(users.filter((u) => u._id !== id));
    message.success("Đã xóa người dùng!");
  };

  const columns = [
    { title: "ID", dataIndex: "_id", key: "_id" },
    { title: "Tên", dataIndex: "username", key: "username" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) => <Tag color={role === "admin" ? "red" : "blue"}>{role}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (st) => <Tag color={st === "active" ? "green" : "gray"}>{st}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />}>Sửa</Button>
          <Popconfirm title="Xóa người dùng?" onConfirm={() => handleDelete(r._id)}>
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
        <h2>Quản lý người dùng</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm người dùng
        </Button>
      </div>
      <Table dataSource={users} columns={columns} rowKey="_id" />
    </div>
  );
};

export default UserManagement;
