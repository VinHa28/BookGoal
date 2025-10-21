import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Input,
  Modal,
  Form,
  Upload,
  Select,
  InputNumber,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import {
  getFields,
  addField,
  updateField,
  deleteField,
} from "../../services/api";

const { Option } = Select;
const { TextArea } = Input;
const CLOUDINARY_UPLOAD_PRESET = "bookgoal";
const CLOUDINARY_CLOUD_NAME = "vinhhv28";

const FieldManagement = () => {
  const [fields, setFields] = useState([]);
  const [filteredFields, setFilteredFields] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [form] = Form.useForm();
  const [previewImage, setPreviewImage] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const fetchFields = async () => {
    try {
      const res = await getFields();
      setFields(res.data);
      setFilteredFields(res.data);
    } catch (error) {
      message.error(
        error.response?.data?.message || error.message || "Lỗi khi lấy danh sân"
      );
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    if (!value) return setFilteredFields(fields);
    const lower = value.toLowerCase();
    setFilteredFields(
      fields.filter((f) => f.name.toLowerCase().includes(lower))
    );
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteField(id);
      if (res) message.success("xóa thành công!");
    } catch (error) {
      message.error(
        error.response?.data?.message || error.message || "Lỗi không thể xóa"
      );
    } finally {
      fetchFields();
    }
  };

  const handleView = (record) => {
    setSelectedField(record);
    setIsViewModalOpen(true);
  };

  const handleAddOrEdit = (record = null) => {
    if (record) {
      form.setFieldsValue({
        ...record,
        prices: record.prices || [],
      });
      setPreviewImage(record.image || null);
      setImageUrl(record.image || "");
      setFileList(
        record.image
          ? [
              {
                uid: "-1",
                name: "image.png",
                status: "done",
                url: record.image,
              },
            ]
          : []
      );
    } else {
      form.resetFields();
      setPreviewImage(null);
      setImageUrl("");
      setFileList([]);
    }
    setSelectedField(record);
    setIsModalOpen(true);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "football-fields");

    try {
      setUploading(true);
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Cloudinary error:", data);
        throw new Error(data.error?.message || "Upload failed");
      }

      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      messageApi.error(`Lỗi upload: ${error.message}`);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setUploading(true);

      let finalImageUrl = imageUrl;
      if (fileList.length > 0 && fileList[0].originFileObj) {
        finalImageUrl = await uploadToCloudinary(fileList[0].originFileObj);
      }

      const fieldData = {
        name: values.name,
        location: values.location,
        address: values.address,
        type: values.type,
        prices: values.prices || [],
        description: values.description || "",
        image: finalImageUrl,
      };

      if (selectedField) {
        const res = await updateField(selectedField._id, fieldData);
        messageApi.success(res.data.message || "Cập nhật sân thành công!");
      } else {
        const res = await addField(fieldData);
        messageApi.success(res.data.message || "Thêm sân mới thành công!");
      }

      // Refresh fields list
      await fetchFields();

      setIsModalOpen(false);
      form.resetFields();
      setPreviewImage(null);
      setFileList([]);
      setImageUrl("");
    } catch (error) {
      console.error("Error submitting field:", error);
      if (error.errorFields) {
        messageApi.error("Vui lòng điền đầy đủ thông tin!");
      } else {
        messageApi.error(
          error.response?.data?.message || "Lỗi khi lưu thông tin sân!"
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = ({ fileList: newList }) => {
    setFileList(newList);
    if (newList.length > 0 && newList[0].originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(newList[0].originFileObj);
    } else if (newList.length === 0) {
      setPreviewImage(null);
    }
  };

  const columns = [
    { title: "Tên sân", dataIndex: "name" },
    { title: "Vị trí", dataIndex: "location" },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          Xem trên bản đồ
        </a>
      ),
    },
    {
      title: "Loại sân",
      dataIndex: "type",
      render: (t) => <Tag color="blue">{t}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            Xem
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleAddOrEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sân?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button size="small" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchFields();
  }, []);

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
        <h2>Quản lý sân</h2>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm theo tên sân..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleAddOrEdit()}
          >
            Thêm sân
          </Button>
        </Space>
      </div>

      <Table dataSource={filteredFields} columns={columns} rowKey="_id" />

      {/* Modal add / edit field */}
      <Modal
        title={selectedField ? "Chỉnh sửa sân" : "Thêm sân mới"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setPreviewImage(null);
          setFileList([]);
          setImageUrl("");
        }}
        onOk={handleSubmit}
        okText={uploading ? "Đang upload..." : "Lưu"}
        cancelText="Hủy"
        width={700}
        confirmLoading={uploading}
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            label="Tên sân"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sân" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Vị trí"
            name="location"
            rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Loại sân"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại sân" }]}
          >
            <Select placeholder="Chọn loại sân">
              <Option value="sân 5">Sân 5</Option>
              <Option value="sân 7">Sân 7</Option>
              <Option value="sân 11">Sân 11</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={3} placeholder="Nhập mô tả về sân..." />
          </Form.Item>

          {/* Bảng giá */}
          <Form.List name="prices">
            {(fields, { add, remove }) => (
              <>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <h4>Bảng giá theo khung giờ</h4>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                  >
                    Thêm khung giờ
                  </Button>
                </div>
                {fields.map(({ key, name, ...rest }) => (
                  <Space
                    key={key}
                    align="baseline"
                    style={{ display: "flex", marginBottom: 8 }}
                  >
                    <Form.Item
                      {...rest}
                      name={[name, "timeSlot"]}
                      rules={[{ required: true, message: "Nhập khung giờ" }]}
                    >
                      <Input
                        placeholder="VD: 07:00 - 08:00"
                        style={{ width: 140 }}
                      />
                    </Form.Item>

                    <Form.Item
                      {...rest}
                      name={[name, "price"]}
                      rules={[{ required: true, message: "Nhập giá" }]}
                    >
                      <InputNumber
                        placeholder="Giá (VNĐ)"
                        min={0}
                        step={50000}
                        style={{ width: 160 }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                      />
                    </Form.Item>

                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Space>
                ))}
              </>
            )}
          </Form.List>

          <Form.Item label="Ảnh sân">
            <Upload
              listType="picture"
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleImageChange}
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {previewImage && (
              <img
                src={previewImage}
                alt="preview"
                style={{
                  width: "100%",
                  marginTop: 10,
                  borderRadius: 8,
                  objectFit: "cover",
                  maxHeight: 300,
                }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết sân"
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={null}
        width={600}
      >
        {selectedField && (
          <div>
            {selectedField.image && (
              <img
                src={selectedField.image}
                alt="Sân"
                style={{
                  width: "100%",
                  borderRadius: 8,
                  marginBottom: 16,
                  objectFit: "cover",
                  maxHeight: 300,
                }}
              />
            )}
            <p>
              <b>Tên sân:</b> {selectedField.name}
            </p>
            <p>
              <b>Vị trí:</b> {selectedField.location}
            </p>
            <p>
              <b>Địa chỉ:</b>{" "}
              <a href={selectedField.address} target="_blank">
                Xem trên bản đồ{" "}
              </a>
            </p>
            <p>
              <b>Loại sân:</b> {selectedField.type}
            </p>
            {selectedField.description && (
              <p>
                <b>Mô tả:</b> {selectedField.description}
              </p>
            )}

            <h4>Bảng giá</h4>
            {selectedField.prices && selectedField.prices.length > 0 ? (
              <ul>
                {selectedField.prices.map((p, i) => (
                  <li key={i}>
                    {p.timeSlot}: <b>{p.price.toLocaleString()} ₫</b>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Chưa có thông tin giá</p>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default FieldManagement;
