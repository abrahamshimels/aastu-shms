import React, { useState } from "react";
import { Modal, Form, Select, Input, Button, InputNumber } from "antd";
import { useDispatch } from "react-redux";
import { CreateCertificate } from "../../../../../Redux/Datas/action";
import { toast } from "react-toastify";

const Certificate_Modal = ({ visible, onClose, patientId, doctorId, token }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [certType, setCertType] = useState("");

    const onFinish = (values) => {
        setLoading(true);
        const payload = {
            student_id: patientId,
            doctor_id: doctorId,
            type: values.type,
            medical_justification: values.justification,
            duration_days: values.duration,
            content: values.content,
            issue_date: new Date().toISOString().split('T')[0],
        };

        dispatch(CreateCertificate(payload, token)).then((res) => {
            setLoading(false);
            if (res && res.message === "Successful") {
                toast.success("Certificate generated successfully!");
                form.resetFields();
                onClose();
            } else {
                toast.error("Failed to generate certificate.");
            }
        });
    };

    return (
        <Modal
            title="Generate Medical Certificate"
            open={visible}
            onCancel={() => {
                form.resetFields();
                onClose();
            }}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ duration: 1 }}
            >
                <Form.Item
                    label="Certificate Type"
                    name="type"
                    rules={[{ required: true, message: "Please select certificate type" }]}
                >
                    <Select placeholder="Select Type" onChange={(val) => setCertType(val)}>
                        <Select.Option value="Sick Leave">Sick Leave</Select.Option>
                        <Select.Option value="Fitness Certificate">Fitness Certificate</Select.Option>
                        <Select.Option value="Referral Letter">Referral Letter</Select.Option>
                    </Select>
                </Form.Item>

                {certType === "Sick Leave" && (
                    <Form.Item
                        label="Duration (Days)"
                        name="duration"
                        rules={[{ required: true, message: "Please specify duration" }]}
                    >
                        <InputNumber min={1} max={7} style={{ width: '100%' }} />
                    </Form.Item>
                )}

                <Form.Item
                    label="Medical Justification"
                    name="justification"
                    rules={[{ required: true, message: "Please provide justification" }]}
                >
                    <Input.TextArea rows={3} placeholder="Provide medical reasoning..." />
                </Form.Item>

                <Form.Item
                    label="Additional Content / Notes"
                    name="content"
                >
                    <Input.TextArea rows={2} placeholder="Any extra details..." />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Generate and Save
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default Certificate_Modal;
