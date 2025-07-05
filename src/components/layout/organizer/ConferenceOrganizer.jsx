import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    Button,
    message,
    Switch,
    Upload,
    Avatar,
    DatePicker,
    AutoComplete,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const locationOptions = [
    { value: "Ha Noi" },
    { value: "Ho Chi Minh City" },
    { value: "Da Nang" },
    { value: "Hue" },
    { value: "Can Tho" },
    { value: "Hai Phong" },
    { value: "Nha Trang" },
    { value: "Vung Tau" },
    { value: "Bien Hoa" },
    { value: "Bac Ninh" },
    { value: "Thai Nguyen" },
    { value: "Nam Dinh" },
    { value: "Quang Ninh" },
    { value: "Hung Yen" },
    { value: "Phu Tho" },
    { value: "Thanh Hoa" },
];

const ConferenceOrganizer = ({ conference, loading, onUpdate }) => {
    const [form] = Form.useForm();
    const [bannerFile, setBannerFile] = useState(null);
    const [previewImage, setPreviewImage] = useState("");

    const toCamelCase = (obj) => {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const camelKey = key.charAt(0).toLowerCase() + key.slice(1);
        acc[camelKey] = value;
        return acc;
    }, {});
};


    useEffect(() => {
    if (conference) {
                console.log("Form conference data:", conference); // 👈 Xem giá trị truyền xuống

        const data = toCamelCase(conference);
        data.startDate = data.startDate ? dayjs(data.startDate) : null;
        data.endDate = data.endDate ? dayjs(data.endDate) : null;
        data.status = !!data.status;
        form.setFieldsValue(data);

        setPreviewImage(conference.BannerUrl || "");
    }
}, [conference, form]);



    const onFinish = async (values) => {
    try {
        await onUpdate({
            ...values,
            bannerImage: bannerFile || null,
        });
        message.success("Update successful!");
    } catch (err) {
        console.error(err);
        message.error("Update failed!");
    }
};


    const handleUpload = (info) => {
    console.log("Upload info:", info);

    const file = info.file?.originFileObj;

    if (!file) {
        message.error("Không tìm thấy file hợp lệ.");
        return;
    }

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
        message.error("Chỉ chấp nhận file ảnh (jpg, png, jpeg...)");
        return;
    }

    form.setFieldsValue({ bannerImage: file });
    setBannerFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
        setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
};




    if (loading) return <div>Loading...</div>;

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 24 }}>
            <h2>Edit Conference</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item name="title" label="Conference Title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Description">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="location" label="Location">
                    <AutoComplete
                        options={locationOptions}
                        placeholder="Enter location"
                        filterOption={(inputValue, option) =>
                            option.value.toLowerCase().includes(inputValue.toLowerCase())
                        }
                    />
                </Form.Item>
                <Form.Item name="callForPaper" label="Call For Paper">
                <Input.TextArea placeholder="Enter call for paper content..." />
                </Form.Item>
                <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item label="Banner Image">
  <Upload
    name="bannerImage"
    accept="image/*"
    showUploadList={false}
    beforeUpload={(file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("Chỉ chấp nhận file ảnh (jpg, png, jpeg...)");
        return false;
      }

      form.setFieldsValue({ bannerImage: file });
      setBannerFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);

      return false; // Ngăn không upload tự động
    }}
  >
    <Button icon={<UploadOutlined />}>Choose Image</Button>
  </Upload>
</Form.Item>


                {previewImage && (
                    <div style={{ marginTop: 10 }}>
                        <Avatar shape="square" size={128} src={previewImage} alt="banner" />
                    </div>
                )}

                <Form.Item name="status" label="Status" valuePropName="checked">
                    <Switch checkedChildren="Open" unCheckedChildren="Closed" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ConferenceOrganizer;
