import React, { useEffect, useState } from "react";
import { Table, Button, Tag, Space, message } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    setBookings([
      {
        _id: "1",
        field: { name: "Sân ABC" },
        user: { username: "Nguyễn Văn A", phone: "0123456789" },
        date: "2024-10-25",
        timeSlot: "06:00-08:00",
        price: 200000,
        status: "pending",
      },
    ]);
  }, []);

  const handleConfirm = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "confirmed" } : b))
    );
    message.success("Đã xác nhận!");
  };

  const handleCancel = (id) => {
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
    );
    message.info("Đã hủy!");
  };

  const columns = [
    { title: "Sân", dataIndex: ["field", "name"], key: "field" },
    { title: "Khách hàng", dataIndex: ["user", "username"], key: "user" },
    { title: "Ngày đặt", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "timeSlot", key: "timeSlot" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (st) => (
        <Tag
          color={
            st === "confirmed"
              ? "green"
              : st === "pending"
              ? "orange"
              : st === "cancelled"
              ? "red"
              : "blue"
          }
        >
          {st}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, r) => (
        <Space>
          {r.status === "pending" && (
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleConfirm(r._id)}
            >
              Xác nhận
            </Button>
          )}
          {r.status !== "cancelled" && (
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleCancel(r._id)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>Quản lý booking</h2>
      <Table dataSource={bookings} columns={columns} rowKey="_id" />
    </div>
  );
};

export default BookingManagement;
