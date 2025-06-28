import React, { useEffect, useState } from "react";
import { Form, Input, Button, message, Switch, Upload, Avatar, DatePicker, AutoComplete } from "antd";
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
    const [bannerImage, setBannerImage] = useState(conference?.bannerImage || "");

    useEffect(() => {
        if (conference) {
            form.setFieldsValue({
                ...conference,
                startDate: conference.startDate ? dayjs(conference.startDate) : null,
                endDate: conference.endDate ? dayjs(conference.endDate) : null,
                status: !!conference.status,
            });
            setBannerImage(conference.bannerImage || "");
        }
    }, [conference, form]);

    const onFinish = async (values) => {
        try {
            await onUpdate({
                ...values,
                bannerImage,
                startDate: values.startDate ? values.startDate.toISOString() : null,
                endDate: values.endDate ? values.endDate.toISOString() : null,
            });
            message.success("Update successful!");
        } catch {
            message.error("Update failed!");
        }
    };

    const handleUpload = (info) => {
        const file = info.file.originFileObj;
        const reader = new FileReader();
        reader.onload = (e) => setBannerImage(e.target.result);
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
                <Form.Item name="startDate" label="Start Date" rules={[{ required: true }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item name="endDate" label="End Date" rules={[{ required: true }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item label="Banner Image">
                    <Upload
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleUpload}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Choose Image</Button>
                    </Upload>
                    {bannerImage && (
                        <div style={{ marginTop: 10 }}>
                            <Avatar shape="square" size={128} src={bannerImage} alt="banner" />
                        </div>
                    )}
                </Form.Item>
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