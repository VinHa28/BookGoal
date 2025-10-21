/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table, Tag, Dropdown, message } from "antd";
import {
  UserOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  getRecentBookings,
  getStats,
  updateBookingStatus,
} from "../../services/api";

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

  const colors = {
    pending: "orange",
    confirmed: "blue",
    completed: "green",
    cancelled: "red",
    requestCancel: "volcano",
  };

  const statusOptions = [
    { key: "pending", label: "Chờ xác nhận" },
    { key: "confirmed", label: "Đã xác nhận" },
    { key: "completed", label: "Hoàn tất" },
    { key: "cancelled", label: "Đã hủy" },
    { key: "requestCancel", label: "Yêu cầu hủy" },
  ];

  const columns = [
    { title: "Sân", dataIndex: "fieldName", key: "fieldName" },
    { title: "Khách hàng", dataIndex: "user", key: "username" },
    { title: "Ngày đặt", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "timeSlot", key: "timeSlot" },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <Dropdown
          menu={{
            items: statusOptions.map((item) => ({
              key: item.key,
              label: item.label,
              onClick: () => handleQuickUpdate(record._id, item.key),
            })),
          }}
        >
          <Tag
            color={colors[record.status]}
            style={{
              cursor: "pointer",
              padding: "6px 10px",
              fontSize: "14px",
              borderRadius: "6px",
            }}
          >
            {statusOptions.find((s) => s.key === record.status)?.label ||
              record.status}
            <DownOutlined style={{ marginLeft: 6, fontSize: 10 }} />
          </Tag>
        </Dropdown>
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
