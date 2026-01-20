import React from "react";
import { Table, Tag, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaClock } from "react-icons/fa";
import "./QueueScreen.css";

const QueueScreen = () => {
  const navigate = useNavigate();
  const [queueData, setQueueData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await fetch("http://localhost:3007/public/queue");
        const data = await response.json();
        setQueueData(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch queue:", err);
        setLoading(false);
      }
    };

    fetchQueue();
    // Refresh every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    {
      title: "Queue #",
      dataIndex: "number",
      key: "number",
      render: (text) => <span className="queue-number">#{text}</span>,
    },
    {
      title: "Patient Name",
      dataIndex: "patientName",
      key: "patientName",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "In Consultation" ? "green" : "blue"} className="status-tag">
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Est. Wait",
      dataIndex: "waitTime",
      key: "waitTime",
      render: (text) => (
        <span className="wait-time">
          <FaClock style={{ marginRight: "5px" }} /> {text}
        </span>
      ),
    },
  ];

  return (
    <div className="queue-container">
      <div className="queue-nav">
        <Button 
          icon={<FaArrowLeft />} 
          onClick={() => navigate("/")}
          className="back-btn"
        >
          Back to Portal
        </Button>
      </div>

      <div className="queue-content">
        <div className="queue-header">
          <h1>Live Patient Queue</h1>
          <p>Real-time status of current consultations</p>
        </div>

        <div className="queue-table-card">
          <Table 
            dataSource={queueData} 
            columns={columns} 
            pagination={false}
            loading={loading}
            rowKey="id"
            className="custom-table"
          />
        </div>

        <div className="queue-info">
          <div className="info-item">
            <span className="dot online"></span> Live Updates Active
          </div>
          <div className="info-item">
            Please wait for your number to be called.
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueScreen;
