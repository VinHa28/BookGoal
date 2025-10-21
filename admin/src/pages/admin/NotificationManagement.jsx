import React from "react";
import { Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const NotificationManagement = () => {
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <h2>Quản lý thông báo</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          Tạo thông báo
        </Button>
      </div>
      <Card>
        <p>
          Chức năng gửi thông báo cho người dùng. Click "Tạo thông báo" để bắt
          đầu.
        </p>
      </Card>
    </div>
  );
};

export default NotificationManagement;
