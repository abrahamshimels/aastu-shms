import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetAdminStats, GetTrendAnalytics, SeedTestingData } from "../../../../../Redux/auth/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { Row, Col, Card, Statistic, Typography, Table, Tag, Button, Space, Divider, message } from "antd";
import { 
  DashboardOutlined, 
  UserOutlined, 
  MedicineBoxOutlined, 
  FieldTimeOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  ArrowUpOutlined,
  LineChartOutlined,
  DatabaseOutlined
} from "@ant-design/icons";
import { Navigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;

const AdminAnalytics = () => {
  const { data } = useSelector((store) => store.auth);
  const [stats, setStats] = useState({ daily: {}, roles: [], workload: [] });
  const [trends, setTrends] = useState({ illness: [], monthly: [] });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const statsData = await GetAdminStats()(null);
    const trendsData = await GetTrendAnalytics()(null);
    setStats(statsData);
    setTrends(trendsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSeedData = async () => {
    message.loading("Seeding clinical test data...");
    const res = await SeedTestingData()(null);
    if (res.message === "Mock clinical data seeded successfully") {
      message.success(res.message);
      fetchData();
    } else {
      const errorMsg = res.error ? `${res.message}: ${res.error}` : "Failed to seed data";
      message.error(errorMsg, 5);
      if (res.detail) {
        console.error("Seeding error details:", res.detail);
      }
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Clinical Activity Report", 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
    
    const tableData = stats.workload.map(item => [item.name, item.role, item.total_reports]);
    autoTable(doc, {
      head: [['Staff Name', 'Role', 'Reports']],
      body: tableData,
      startY: 35
    });

    doc.save("Weekly_Activity_Report.pdf");
    message.success("Weekly Activity Report exported successfully (PDF)");
  };

  const handleExportStaffPDF = () => {
    const doc = new jsPDF();
    doc.text("Staff Performance Report", 14, 15);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);
    
    const tableData = stats.workload.map(item => [item.name, item.role, item.total_reports]);
    autoTable(doc, {
      head: [['Staff Name', 'Role', 'Reports Generated']],
      body: tableData,
      startY: 35
    });

    doc.save("Staff_Performance_Report.pdf");
    message.success("Staff Performance Report exported successfully (PDF)");
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(stats.workload);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Staff Performance");
    
    // Add Illness trends too
    const wsTrends = XLSX.utils.json_to_sheet(trends.illness);
    XLSX.utils.book_append_sheet(wb, wsTrends, "Illness Trends");

    XLSX.writeFile(wb, "Monthly_Health_Trends.xlsx");
    message.success("Monthly Health Trends exported successfully (Excel)");
  };

  if (data?.isAuthenticated === false) return <Navigate to={"/"} />;
  if (data?.user?.userType !== "admin") return <Navigate to={"/dashboard"} />;

  const workloadColumns = [
    { title: 'Staff Name', dataIndex: 'name', key: 'name' },
    { title: 'Role', dataIndex: 'role', key: 'role', render: (role) => <Tag color="blue">{role}</Tag> },
    { title: 'Reports Generated', dataIndex: 'total_reports', key: 'total_reports', sorter: (a, b) => a.total_reports - b.total_reports },
  ];

  return (
    <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Sidebar />
      <div className="AfterSideBar" style={{ flex: 1, padding: "32px", overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <Title level={2} style={{ color: '#1a237e', marginBottom: '4px' }}>
              <DashboardOutlined /> Clinical Analytics & Reports
            </Title>
            <Text type="secondary">Real-time insights into clinic performance and health trends.</Text>
          </div>
          <Space>
            <Button icon={<DatabaseOutlined />} onClick={handleSeedData}>Seed Test Data</Button>
            <Button icon={<FilePdfOutlined />} type="primary" danger onClick={handleExportPDF}>Weekly PDF</Button>
            <Button icon={<FilePdfOutlined />} type="primary" ghost onClick={handleExportStaffPDF}>Staff PDF</Button>
            <Button icon={<FileExcelOutlined />} style={{ backgroundColor: '#2e7d32', color: 'white' }} onClick={handleExportExcel}>Monthly Excel</Button>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Patients Served Today"
                value={stats.daily?.patients_served_today || 0}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#3f51b5' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <ArrowUpOutlined /> 12% from yesterday
              </Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Avg. Wait Time"
                value={stats.daily?.avg_wait_time || 15}
                precision={1}
                suffix="mins"
                prefix={<FieldTimeOutlined />}
                valueStyle={{ color: '#f44336' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Within target range (20m)
              </Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Active Doctors"
                value={stats.daily?.total_doctors || 0}
                prefix={<MedicineBoxOutlined />}
                valueStyle={{ color: '#2e7d32' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>On duty today</Text>
            </Card>
          </Col>
          <Col span={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Common Illness"
                value={trends.illness[0]?.disease || "N/A"}
                prefix={<LineChartOutlined />}
                valueStyle={{ color: '#ffa000', fontSize: '20px' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>Weekly trend leader</Text>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
          <Col span={14}>
            <Card title="Common Illnesses (This Week)" bordered={false} style={{ borderRadius: '12px' }}>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                {trends.illness.length > 0 ? (
                  <div style={{ width: '100%', padding: '20px' }}>
                    {trends.illness.map(item => (
                      <div key={item.disease} style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <Text strong>{item.disease}</Text>
                          <Text type="secondary">{item.count} cases</Text>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px' }}>
                          <div style={{ width: `${(item.count / trends.illness[0].count) * 100}%`, height: '100%', backgroundColor: '#1a237e', borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text type="secondary">No clinical data available for this period.</Text>
                )}
              </div>
            </Card>
          </Col>
          <Col span={10}>
            <Card title="Monthly Patient Trends" bordered={false} style={{ borderRadius: '12px' }}>
              <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                <Space direction="vertical" align="center">
                  <LineChartOutlined style={{ fontSize: '48px', color: '#bdbdbd' }} />
                  <Text type="secondary">Trends visualization loading...</Text>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    {trends.monthly.map(m => (
                      <div key={m.month} style={{ textAlign: 'center' }}>
                        <div style={{ height: `${m.count * 10}px`, width: '20px', backgroundColor: '#3f51b5', borderRadius: '4px 4px 0 0' }}></div>
                        <Text style={{ fontSize: '10px' }}>{m.month.split('-')[1]}</Text>
                      </div>
                    ))}
                  </div>
                </Space>
              </div>
            </Card>
          </Col>
        </Row>

        <Card title="Staff Performance (Reports Generated)" style={{ marginTop: '24px', borderRadius: '12px' }}>
          <Table 
            dataSource={stats.workload} 
            columns={workloadColumns} 
            pagination={{ pageSize: 5 }}
            loading={loading}
            rowKey="id"
          />
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
