import React, { useState } from "react";
import { Layout, Menu, Button, Space, Avatar } from "antd";
import {
  UserOutlined,
  FieldTimeOutlined,
  CalendarOutlined,
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import DashboardOverview from "./admin/DashboardOverview";
import UserManagement from "./admin/UserManagement";
import FieldManagement from "./admin/FieldManagement";
import BookingManagement from "./admin/BookingManagement";
import NotificationManagement from "./admin/NotificationManagement";

const { Header, Sider, Content } = Layout;

const AdminDashboard = ({ onLogout }) => {
  const [currentMenu, setCurrentMenu] = useState("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    if (onLogout) onLogout();
  };

  const renderContent = () => {
    switch (currentMenu) {
      case "dashboard":
        return <DashboardOverview />;
      case "users":
        return <UserManagement />;
      case "fields":
        return <FieldManagement />;
      case "bookings":
        return <BookingManagement />;
      case "notifications":
        return <NotificationManagement />;
      default:
        return null;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="dark" width={250}>
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            paddingLeft: 24,
            borderBottom: "1px solid #ffffff20",
          }}
        >
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentMenu]}
          onClick={({ key }) => setCurrentMenu(key)}
          style={{ marginTop: 16 }}
        >
          <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Người dùng
          </Menu.Item>
          <Menu.Item key="fields" icon={<FieldTimeOutlined />}>
            Quản lý sân
          </Menu.Item>
          <Menu.Item key="bookings" icon={<CalendarOutlined />}>
            Booking
          </Menu.Item>
          <Menu.Item key="notifications" icon={<BellOutlined />}>
            Thông báo
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: 20 }}>Hệ thống quản lý đặt sân</h1>
          <Space>
            <Avatar icon={<UserOutlined />} />
            <span>Admin</span>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: "#fff",
            minHeight: 280,
          }}
        >
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
