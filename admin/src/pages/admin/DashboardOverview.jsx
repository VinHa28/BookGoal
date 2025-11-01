/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Dropdown,
  message,
  Space,
  Popconfirm,
  Button,
} from "antd";
import {
  UserOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  DownOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  getRecentBookings,
  getStats,
  updateBookingStatus,
} from "../../services/api";
import dayjs from "dayjs";
import { statusColors, statusLabels } from "../../constants";

const DashboardOverview = () => {
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ tạo message instance local
  const [messageApi, contextHolder] = message.useMessage();

  const fetchStats = async () => {
    try {
      const res = await getStats();
      setStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchRecentBookings = async () => {
    try {
      const res = await getRecentBookings();
      setBookings(res?.data?.recentBookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
  }, []);

  const handleQuickUpdate = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      const res = await updateBookingStatus(bookingId, newStatus);
      messageApi.success(`Đã cập nhật trạng thái thành "${newStatus}"`);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating booking:", error);
      messageApi.error("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Sân",
      dataIndex: "fieldName",
      key: "fieldName",
    },
    {
      title: "Khách hàng",
      dataIndex: "user",
      key: "userName",
      render: (user) => (
        <span>
          {user?.username} <Tag color="default">{user?.phone}</Tag>
        </span>
      ),
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    { title: "Giờ", dataIndex: "timeSlot", key: "timeSlot" },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (p) => (
        <span style={{ fontWeight: "bold", color: "#333" }}>
          {p ? p.toLocaleString() : 0} ₫
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (st) => (
        <Tag color={statusColors[st] || "default"}>
          {statusLabels[st] || st}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, r) => (
        <Space size="small">
          {(r.status === "pending" || r.status === "cancelled") && (
            <Popconfirm
              title="Xác nhận booking này?"
              onConfirm={() => handleQuickUpdate(r._id, "confirmed")}
            >
              <Button size="small" type="primary" icon={<CheckOutlined />}>
                Xác nhận
              </Button>
            </Popconfirm>
          )}
          {r.status === "requestCancel" && (
            <Popconfirm
              title="Đồng ý hủy booking này?"
              onConfirm={() => handleQuickUpdate(r._id, "cancelled")}
            >
              <Button size="small" danger icon={<CloseOutlined />}>
                Hủy
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <h2 style={{ marginBottom: 24 }}>Dashboard</h2>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng booking"
              value={stats.totalBookings}
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng sân"
              value={stats.totalFields}
              prefix={<FieldTimeOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu"
              value={stats.revenue}
              suffix="đ"
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Booking gần đây">
        <Table
          dataSource={Array.isArray(bookings) ? bookings : []}
          columns={columns}
          pagination={false}
          rowKey="_id"
          loading={loading}
        />
      </Card>
    </>
  );
};

export default DashboardOverview;
