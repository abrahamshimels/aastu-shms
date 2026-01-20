import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../GlobalFiles/Sidebar";
import axios from "axios";
import "./CSS/Queue.css";

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [draggingItem, setDraggingItem] = useState(null);
  const [checkInData, setCheckInData] = useState({
    studentID: "",
    chief_complaint: "",
    priority: "Normal",
  });

  const notify = (text) => toast(text);

  useEffect(() => {
    fetchQueue();
    fetchDoctors();
    const interval = setInterval(fetchQueue, 10000); // Auto refresh queue
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await axios.get("http://localhost:3007/nurses/queue");
      setQueue(res.data);
    } catch (error) {
      console.log("Error fetching queue");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get("http://localhost:3007/nurses/doctors");
      setDoctors(res.data);
    } catch (error) {
      notify("Error fetching doctors");
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const patientRes = await axios.get(`http://localhost:3007/nurses/patient?studentID=${encodeURIComponent(checkInData.studentID.trim())}`);
      const patient = patientRes.data;

      const res = await axios.post("http://localhost:3007/nurses/check-in", {
        student_id: patient.id,
        chief_complaint: checkInData.chief_complaint,
        priority: checkInData.priority,
      });

      if (res.data.message === "Checked-in") {
        notify("Patient added to queue");
        fetchQueue();
        setShowCheckIn(false);
        setCheckInData({ studentID: "", chief_complaint: "", priority: "Normal" });
      }
    } catch (error) {
      notify("Error: Patient not found or system error");
    } finally {
      setLoading(false);
    }
  };

  // Drag and Drop Logic
  const onDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.setData("queueId", item.id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, doctorId) => {
    e.preventDefault();
    const queueId = e.dataTransfer.getData("queueId");
    try {
      await axios.patch("http://localhost:3007/nurses/assign-doctor", {
        queue_id: queueId,
        doctor_id: doctorId,
      });
      notify("Doctor assigned successfully");
      fetchQueue();
      setDraggingItem(null);
    } catch (error) {
      notify("Error assigning doctor");
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="AfterSideBar">
        <ToastContainer />
        <div className="queue-header-new">
          <h1>Queue Management</h1>
          <button className="checkin-btn" onClick={() => setShowCheckIn(true)}>+ New Check-In</button>
        </div>

        <div className="queue-layout">
          {/* Active Queue Section */}
          <div className="queue-section">
            <h3>Active Queue (Drag patient to doctor)</h3>
            <div className="queue-list">
              {queue.filter(q => q.status === 'Checked-In').length === 0 && <p className="empty-msg">No patients waiting</p>}
              {queue.filter(q => q.status === 'Checked-In').map((item) => (
                <div 
                  key={item.id} 
                  className={`queue-card priority-${item.priority.toLowerCase()}`}
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                >
                  <div className="card-header">
                    <span className="student-name">{item.patient_name}</span>
                    <span className={`priority-badge ${item.priority.toLowerCase()}`}>{item.priority}</span>
                  </div>
                  <div className="card-body">
                    <p><strong>ID:</strong> {item.studentid}</p>
                    <p><strong>Complaint:</strong> {item.chief_complaint}</p>
                    <p className="card-meta">{item.patient_dept} | Year {item.patient_year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* In-Consultation / Assigned Section */}
            <h3 style={{marginTop: '30px'}}>In-Consultation (Re-assign by dragging)</h3>
            <div className="queue-list">
               {queue.filter(q => q.status === 'Assigned').length === 0 && <p className="empty-msg">No patients in consultation</p>}
               {queue.filter(q => q.status === 'Assigned').map((item) => (
                <div 
                  key={item.id} 
                  className="queue-card assigned"
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                >
                  <div className="card-header">
                    <span className="student-name">{item.patient_name}</span>
                    <span className="status-badge assigned">Assigned</span>
                  </div>
                  <div className="card-body">
                    <p><strong>Doctor:</strong> {item.doctor_name}</p>
                    <p><strong>Complaint:</strong> {item.chief_complaint}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor List Targets */}
          <div className="doctor-section">
            <h3>Available Doctors (Drop here)</h3>
            <div className="doctor-grid">
              {doctors.map((doc) => (
                <div 
                  key={doc.id} 
                  className="doctor-target-card"
                  onDragOver={onDragOver}
                  onDrop={(e) => onDrop(e, doc.id)}
                >
                  <div className="doc-icon">👨‍⚕️</div>
                  <div className="doc-info">
                    <h4>{doc.name}</h4>
                    <p>{doc.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {showCheckIn && (
          <div className="modal-overlay">
            <div className="modal-content-new">
              <h2>Patient Check-In</h2>
              <form onSubmit={handleCheckIn}>
                <div className="input-group">
                  <label>AASTU Student ID</label>
                  <input 
                    placeholder="e.g. ETS0217/15" 
                    value={checkInData.studentID}
                    onChange={(e) => setCheckInData({...checkInData, studentID: e.target.value})}
                    required 
                  />
                </div>
                <div className="input-group">
                  <label>Chief Complaint</label>
                  <textarea 
                    placeholder="Explain the patient's symptoms..." 
                    value={checkInData.chief_complaint}
                    onChange={(e) => setCheckInData({...checkInData, chief_complaint: e.target.value})}
                    required 
                  />
                </div>
                <div className="priority-selection">
                  <label>Priority Level</label>
                  <div className="priority-btns">
                    <button 
                      type="button"
                      className={`p-btn normal ${checkInData.priority === 'Normal' ? 'active' : ''}`}
                      onClick={() => setCheckInData({...checkInData, priority: 'Normal'})}
                    >🟢 Normal</button>
                    <button 
                      type="button"
                      className={`p-btn urgent ${checkInData.priority === 'Urgent' ? 'active' : ''}`}
                      onClick={() => setCheckInData({...checkInData, priority: 'Urgent'})}
                    >🟡 Urgent</button>
                    <button 
                      type="button"
                      className={`p-btn emergency ${checkInData.priority === 'Emergency' ? 'active' : ''}`}
                      onClick={() => setCheckInData({...checkInData, priority: 'Emergency'})}
                    >🔴 Emergency</button>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "Checking In..." : "Check-In Patient"}
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowCheckIn(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Queue;
