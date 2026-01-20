import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetAuditLogs } from "../../../../../Redux/auth/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { Table, Tag, Input, Space, Typography, Card, Tooltip } from "antd";
import { HistoryOutlined, SearchOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { Navigate } from "react-router-dom";

const { Title, Text } = Typography;

const AuditLogs = () => {
  const { data } = useSelector((store) => store.auth);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchLogs = () => {
    setLoading(true);
    GetAuditLogs()(null).then(res => {
        setLogs(res);
        setLoading(false);
    });
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (data?.isAuthenticated === false) return <Navigate to={"/"} />;
  if (data?.user?.userType !== "admin") return <Navigate to={"/dashboard"} />;

  const columns = [
    {
      title: "Timestamp",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      defaultSortOrder: 'descend',
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      render: (id) => <Tag color="blue">{id}</Tag>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (action) => {
        let color = 'default';
        if (action.includes('CREATE')) color = 'green';
        if (action.includes('UPDATE')) color = 'orange';
        if (action.includes('DELETE')) color = 'red';
        if (action.includes('BACKUP')) color = 'purple';
        if (action.includes('PASSWORD')) color = 'cyan';
        return <Tag color={color}>{action}</Tag>;
      },
      filters: [
        { text: 'CREATE_STAFF', value: 'CREATE_STAFF' },
        { text: 'UPDATE_STAFF', value: 'UPDATE_STAFF' },
        { text: 'TRIGGER_BACKUP', value: 'TRIGGER_BACKUP' },
        { text: 'RESET_PASSWORD', value: 'RESET_PASSWORD' },
        { text: 'UPDATE_CONFIG', value: 'UPDATE_CONFIG' },
      ],
      onFilter: (value, record) => record.action.includes(value),
    },
    {
      title: "Target",
      key: "target",
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: '12px' }}>{record.target_table.toUpperCase()}</Text>
          <Text type="secondary" style={{ fontSize: '11px' }}>ID: {record.target_id}</Text>
        </Space>
      ),
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
      render: (details) => (
        <Tooltip title={JSON.stringify(details, null, 2)}>
          <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', cursor: 'pointer' }}>
            <InfoCircleOutlined style={{ marginRight: '8px' }} />
            {JSON.stringify(details)}
          </div>
        </Tooltip>
      ),
    },
  ];

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(searchText.toLowerCase()) ||
    log.user_id.toLowerCase().includes(searchText.toLowerCase()) ||
    log.target_table.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sidebar />
      <div className="AfterSideBar" style={{ flex: 1, padding: "32px" }}>
        <Title level={2} style={{ color: '#1a237e' }}>
          <HistoryOutlined /> Audit & Compliance Logs
        </Title>
        <Text type="secondary">Monitor all system actions, configuration changes, and security events.</Text>

        <Card style={{ marginTop: '24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
            <Input
              placeholder="Search logs (Action, User, Table)..."
              prefix={<SearchOutlined />}
              style={{ width: '300px' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Table 
            columns={columns} 
            dataSource={filteredLogs} 
            rowKey="id" 
            loading={loading}
            pagination={{ pageSize: 12 }}
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </div>
    </div>
  );
};

export default AuditLogs;
