import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, message } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { getPendingRequests, submitLabRecord } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import Topbar from "../../GlobalFiles/Topbar";

const Pending_Tests = () => {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [form] = Form.useForm();

    const { data: authData } = useSelector((store) => store.auth);
    const { labRequests, loading } = useSelector((store) => store.data);

    useEffect(() => {
        if (authData?.token) {
            dispatch(getPendingRequests(authData.token));
        }
    }, [dispatch, authData.token]);

    const handleOpenModal = (record) => {
        setSelectedRequest(record);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setSelectedRequest(null);
        form.resetFields();
    };

    const onFinish = (values) => {
        const payload = {
            request_id: selectedRequest.id,
            result_value: values.result_value,
            critical_flag: values.critical_flag || false,
        };

        dispatch(submitLabRecord(payload, authData.token)).then((res) => {
            if (res) {
                message.success("Results submitted successfully!");
                setIsModalOpen(false);
                form.resetFields();
                dispatch(getPendingRequests(authData.token));
            } else {
                message.error("Failed to submit results.");
            }
        });
    };

    if (authData?.isAuthenticated === false) {
        return <Navigate to={"/"} />;
    }

    if (authData?.user.userType !== "lab_technologist") {
        return <Navigate to={"/dashboard"} />;
    }

    const columns = [
        { title: "ID", dataIndex: "id", key: "id" },
        { title: "Patient Name", dataIndex: "patient_name", key: "patient_name" },
        { title: "Doctor Name", dataIndex: "doctor_name", key: "doctor_name" },
        { title: "Test Type", dataIndex: "test_type", key: "test_type" },
        { title: "Priority", dataIndex: "priority", key: "priority" },
        {
            title: "Requested Date",
            dataIndex: "request_date",
            key: "request_date",
            render: (text) => new Date(text).toLocaleString(),
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Button type="primary" onClick={() => handleOpenModal(record)}>
                    Enter Results
                </Button>
            ),
        },
    ];

    return (
        <>
            <div className="container">
                <Sidebar />
                <div className="AfterSideBar">
                    <Topbar />
                    <div className="Payment_Page">
                        <div className="patientBox">
                            <h2 style={{ marginBottom: "1rem" }}>Pending Lab Requests</h2>
                            <Table
                                columns={columns}
                                dataSource={labRequests}
                                loading={loading}
                                rowKey="id"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title={`Submit Results for ${selectedRequest?.test_type}`}
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Result Value"
                        name="result_value"
                        rules={[{ required: true, message: "Please enter the test result" }]}
                    >
                        <Input.TextArea rows={4} placeholder="Enter laboratory findings..." />
                    </Form.Item>

                    <Form.Item name="critical_flag" valuePropName="checked">
                        <Checkbox>Mark as Critical Finding</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Submit & Close Request
                        </Button>
                    </Form.Item>
                    <p style={{ color: "gray", fontSize: "12px", marginTop: "10px" }}>
                        * Note: Once submitted, the results become read-only.
                    </p>
                </Form>
            </Modal>
        </>
    );
};

export default Pending_Tests;
