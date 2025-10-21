import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import * as api from "../services/api";

const LoginPage = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await api.login(values.phone, values.password);
      const { accessToken, user } = response.data;

      if (user.role !== "admin") {
        throw new Error("Chỉ quản trị viên có quyền đăng nhập");
      }
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      message.success("Đăng nhập thành công!");
      onLoginSuccess(user);
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message || error?.message || "Đăng nhập thất bại"
      );
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card title="Đăng nhập quản trị viên" style={{ width: 400 }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Số điện thoại" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>
          {errorMessage !== "" && (
            <p style={{ color: "red" }}>{errorMessage}</p>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
