import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
import {
  UserOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
} from "@ant-design/icons";

const DashboardOverview = () => {
  const [stats, setStats] = useState({});
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Mock data
    setStats({
      totalUsers: 50,
      totalBookings: 120,
      totalFields: 8,
      revenue: 25000000,
    });
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

  const columns = [
    { title: "Sân", dataIndex: ["field", "name"], key: "fieldName" },
    { title: "Khách hàng", dataIndex: ["user", "username"], key: "username" },
    { title: "Ngày đặt", dataIndex: "date", key: "date" },
    { title: "Giờ", dataIndex: "timeSlot", key: "timeSlot" },
  ];

  return (
    <>
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
        <Table dataSource={bookings} columns={columns} pagination={false} rowKey="_id" />
      </Card>
    </>
  );
};

export default DashboardOverview;
