import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  message,
  Popconfirm,
  Select,
  Modal,
  Form,
  Input,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  getAllBookings,
  confirmBooking,
  cancelBooking,
  createNotification,
  updateBookingStatus,
} from "../../services/api";
import dayjs from "dayjs";

const { Option } = Select;
const { Search } = Input; // Import Search từ Input

const statusColors = {
  confirmed: "green",
  pending: "orange",
  cancelled: "red",
  requestCancel: "volcano",
  completed: "blue",
};

const statusLabels = {
  all: "Tất cả",
  pending: "Đang chờ",
  confirmed: "Đã xác nhận",
  requestCancel: "Yêu cầu hủy",
  cancelled: "Đã hủy",
  completed: "Đã hoàn thành",
};

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchText, setSearchText] = useState(""); // State cho chức năng tìm kiếm
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // Hàm gọi API tải danh sách booking
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await getAllBookings();
      setBookings(res.data);
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Lỗi khi tải danh sách booking."
      );
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Xử lý Xác nhận Booking (chuyển sang 'confirmed')
  const handleConfirm = async (id) => {
    try {
      await confirmBooking(id);
      messageApi.success("Đã xác nhận booking thành công!");
      fetchBookings();
    } catch (error) {
      messageApi.error(
        error.response?.data?.message || "Lỗi khi xác nhận booking."
      );
    }
  };

  // Xử lý Admin Đồng ý Hủy Booking (chuyển sang 'cancelled')
  const handleApproveCancel = async (id) => {
    try {
      const res = await cancelBooking(id);
      messageApi.info(res.data.message || "Đã hủy booking thành công!");
      fetchBookings();
    } catch (error) {
      messageApi.error(error.response?.data?.message || "Lỗi khi hủy booking.");
    }
  };

  const handleRejectCancel = (record) => {
    setCurrentBooking(record);
    form.resetFields();
    form.setFieldsValue({
      message: `Yêu cầu hủy đặt sân của bạn tại ${
        record.field.name
      } vào ${dayjs(record.date).format("DD/MM/YYYY")} (${
        record.timeSlot
      }) không được chấp nhận. Sân vẫn được giữ cho bạn. Vui lòng liên hệ quản lý để biết thêm chi tiết. (SDT: ${
        JSON.parse(localStorage.getItem("user")).phone
      })`,
    });
    setIsModalVisible(true);
  };

  const handleSendRejection = async (values) => {
    try {
      const { message: rejectMessage } = values;

      await updateBookingStatus(currentBooking._id, "confirmed");

      await createNotification({
        targetType: "single",
        userId: currentBooking.user._id,
        title: "Yêu cầu hủy đặt sân bị từ chối",
        message: rejectMessage,
        link: `/booking/${currentBooking._id}`,
      });

      messageApi.success(
        "Đã từ chối yêu cầu hủy và gửi thông báo cho khách hàng!"
      );
      setIsModalVisible(false);
      form.resetFields();
      fetchBookings();
    } catch (error) {
      messageApi.error(
        error.response?.data?.message ||
          "Lỗi khi từ chối yêu cầu hủy và gửi thông báo."
      );
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const statusMatch = filterStatus === "all" || b.status === filterStatus;
    const lowerSearch = searchText.toLowerCase();
    const searchMatch =
      !searchText ||
      b.field?.name.toLowerCase().includes(lowerSearch) ||
      b.user?.username.toLowerCase().includes(lowerSearch) ||
      b.user?.phone.includes(lowerSearch);

    return statusMatch && searchMatch;
  });

  const columns = [
    {
      title: "Sân",
      dataIndex: "field",
      key: "fieldName",
      render: (field) => field?.name,
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
          {r.status === "requestCancel" ? (
            <>
              <Popconfirm
                title="Đồng ý hủy booking này (Cancelled)?"
                onConfirm={() => handleApproveCancel(r._id)}
                okText="Đồng ý hủy"
                cancelText="Không"
              >
                <Button
                  size="small"
                  type="primary"
                  icon={<CloseOutlined />}
                  danger
                >
                  Xác nhận Hủy
                </Button>
              </Popconfirm>
              <Button
                size="small"
                icon={<MessageOutlined />}
                onClick={() => handleRejectCancel(r)}
              >
                Từ chối (Gửi TB)
              </Button>
            </>
          ) : r.status === "pending" ? (
            <Popconfirm
              title="Xác nhận booking này?"
              onConfirm={() => handleConfirm(r._id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button size="small" type="primary" icon={<CheckOutlined />}>
                Xác nhận
              </Button>
            </Popconfirm>
          ) : (
            r.status !== "cancelled" &&
            r.status !== "completed" && (
              <Popconfirm
                title="Hủy booking này (Cancelled)?"
                onConfirm={() => handleApproveCancel(r._id)}
                okText="Hủy"
                cancelText="Không"
              >
                <Button size="small" danger icon={<CloseOutlined />}>
                  Hủy
                </Button>
              </Popconfirm>
            )
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
        <h2 style={{ margin: 0 }}>Quản lý booking</h2>
        <Space>
          {/* Input Search */}
          <Search
            placeholder="Tìm kiếm: Sân, Khách hàng, SĐT..."
            allowClear
            onSearch={setSearchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />

          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 150 }}
          >
            {Object.keys(statusLabels).map((key) => (
              <Option key={key} value={key}>
                {statusLabels[key]}
              </Option>
            ))}
          </Select>

          <Button
            icon={<ReloadOutlined />}
            onClick={fetchBookings}
            loading={loading}
          >
            Làm mới
          </Button>
        </Space>
      </div>
      <Table
        dataSource={filteredBookings}
        columns={columns}
        rowKey="_id"
        loading={loading}
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={`Từ chối yêu cầu hủy (${
          currentBooking?.user?.username || "Khách hàng"
        })`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setCurrentBooking(null);
        }}
        onOk={() => form.submit()}
        okText="Gửi thông báo & Giữ Booking"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleSendRejection}>
          <Form.Item
            label="Nội dung thông báo gửi đến khách hàng"
            name="message"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập nội dung thông báo từ chối",
              },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <p style={{ color: "red", marginTop: 10 }}>
            Hành động này sẽ **từ chối** yêu cầu hủy và chuyển trạng thái
            booking trở lại thành **Đã xác nhận (Confirmed)**.
          </p>
        </Form>
      </Modal>
    </>
  );
};

export default BookingManagement;
