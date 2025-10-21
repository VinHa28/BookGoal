import React, { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Popconfirm, message } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const FieldManagement = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    setFields([
      { _id: "1", name: "Sân ABC", location: "Quận 1", address: "123 Nguyễn Huệ", type: "sân 5" },
      { _id: "2", name: "Sân XYZ", location: "Quận 3", address: "456 Lê Lợi", type: "sân 7" },
    ]);
  }, []);

  const handleDelete = (id) => {
    setFields(fields.filter((f) => f._id !== id));
    message.success("Đã xóa sân!");
  };

  const columns = [
    { title: "Tên sân", dataIndex: "name" },
    { title: "Vị trí", dataIndex: "location" },
    { title: "Địa chỉ", dataIndex: "address" },
    { title: "Loại sân", dataIndex: "type", render: (t) => <Tag color="blue">{t}</Tag> },
    {
      title: "Hành động",
      key: "action",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EyeOutlined />}>Xem</Button>
          <Button size="small" icon={<EditOutlined />}>Sửa</Button>
          <Popconfirm title="Xóa sân?" onConfirm={() => handleDelete(r._id)}>
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
        <h2>Quản lý sân</h2>
        <Button type="primary" icon={<PlusOutlined />}>
          Thêm sân
        </Button>
      </div>
      <Table dataSource={fields} columns={columns} rowKey="_id" />
    </div>
  );
};

export default FieldManagement;
