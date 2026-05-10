import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../GlobalFiles/Sidebar";
import axios from "axios";
import "./CSS/Queue.css";
import { FaUserMd, FaTrash, FaEdit } from "react-icons/fa";

const baseURL = process.env.REACT_APP_BASE_URL;
if (!baseURL) throw new Error("REACT_APP_BASE_URL is not defined in .env");

const Queue = () => {
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDoctors, setSelectedDoctors] = useState({});
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [checkInData, setCheckInData] = useState({
    studentID: "",
    chief_complaint: "",
    priority: "Normal",
  });

  const notify = (text) => toast(text);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchQueue();
    fetchDoctors();
    fetchPatients();
    const interval = setInterval(fetchQueue, 10000); // Auto refresh queue
    return () => clearInterval(interval);
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/nurses/queue`,
      );
      setQueue(res.data);
    } catch (error) {
      console.log("Error fetching queue");
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/nurses/doctors`,
      );
      setDoctors(res.data);
    } catch (error) {
      notify("Error fetching doctors");
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${baseURL}/patients`);
      setPatients(res.data || []);
    } catch (error) {
      console.warn("Error fetching patients", error);
    }
  };

  // filter patients for autocomplete whenever input changes
  useEffect(() => {
    if (editingItem) return;
    const q = (checkInData.studentID || "").trim().toLowerCase();
    if (!q) {
      setFilteredPatients(patients.slice(0, 50));
      setDropdownOpen(false);
      setActiveIndex(-1);
      return;
    }
    const filtered = (patients || []).filter((p) => {
      return (
        (p.studentid || "").toLowerCase().includes(q) ||
        (p.name || "").toLowerCase().includes(q)
      );
    });
    setFilteredPatients(filtered.slice(0, 50));
    setActiveIndex(-1);
    setDropdownOpen(filtered.length > 0);
  }, [checkInData.studentID, patients, editingItem]);

  const selectPatient = (p) => {
    setCheckInData({ ...checkInData, studentID: p.studentid });
    setSelectedPatient(p);
    setDropdownOpen(false);
  };

  const handleInputKeyDown = (e) => {
    if (!dropdownOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredPatients.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && filteredPatients[activeIndex]) {
        selectPatient(filteredPatients[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setDropdownOpen(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingItem) {
        // Update existing queue item
        await axios.patch(
          `${baseURL}/nurses/queue/${editingItem.id}`,
          {
            chief_complaint: checkInData.chief_complaint,
            priority: checkInData.priority,
          },
        );
        notify("Queue updated successfully");
      } else {
        // Create new check-in
        const patientRes = await axios.get(
          `${baseURL}/nurses/patient?studentID=${encodeURIComponent(checkInData.studentID.trim())}`,
        );
        const patient = patientRes.data;

        const res = await axios.post(
          `${baseURL}/nurses/check-in`,
          {
            student_id: patient.id,
            chief_complaint: checkInData.chief_complaint,
            priority: checkInData.priority,
          },
        );

        if (res.data.message === "Checked-in") {
          notify("Patient added to queue");
        }
      }

      fetchQueue();
      setShowCheckIn(false);
      setEditingItem(null);
      setCheckInData({
        studentID: "",
        chief_complaint: "",
        priority: "Normal",
      });
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        (editingItem
          ? "Error updating queue"
          : "Error: Patient not found or system error");
      notify(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setCheckInData({
      studentID: item.studentid,
      chief_complaint: item.chief_complaint,
      priority: item.priority || "Normal",
    });
    setShowCheckIn(true);
  };

  const handleRemove = async (queueId) => {
    if (window.confirm("Remove this patient from the queue completely?")) {
      try {
        await axios.delete(
          `${baseURL}/nurses/queue/${queueId}`,
        );
        notify("Patient removed from queue");
        fetchQueue();
      } catch (error) {
        notify("Error removing patient");
      }
    }
  };

  // Drag and Drop Logic
  const onDragStart = (e, item) => {
    e.dataTransfer.setData("queueId", item.id);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = async (e, doctorId) => {
    e.preventDefault();
    const queueId = e.dataTransfer.getData("queueId");

    // Check if already assigned
    const item = queue.find((q) => q.id.toString() === queueId);
    if (item && item.doctor_id) {
      notify("⚠️ Patient already assigned! Remove manually if needed.");
      return;
    }

    try {
      await axios.patch(
        `${baseURL}/nurses/assign-doctor`,
        {
          queue_id: queueId,
          doctor_id: doctorId,
        },
      );
      notify("Doctor assigned successfully");
      fetchQueue();
    } catch (error) {
      notify("Error assigning doctor");
    }
  };

  const handleAssign = async (queueId, doctorId) => {
    if (!doctorId) return notify("Select a doctor first");
    try {
      await axios.patch(
        `${baseURL}/nurses/assign-doctor`,
        {
          queue_id: queueId,
          doctor_id: doctorId,
        },
      );
      notify("Doctor assigned successfully");
      fetchQueue();
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
          <button className="checkin-btn" onClick={() => setShowCheckIn(true)}>
            + New Check-In
          </button>
        </div>

        <div className="queue-layout">
          {/* Active Queue Section */}
          <div className="queue-section">
            <h3>Active Queue (Drag patient to doctor)</h3>
            <div className="queue-list">
              {queue.filter((q) => q.status === "Checked-In").length === 0 && (
                <p className="empty-msg">No patients waiting</p>
              )}
              {queue
                .filter((q) => q.status === "Checked-In")
                .map((item) => (
                  <div
                    key={item.id}
                    className={`queue-card priority-${item.priority.toLowerCase()}`}
                    draggable
                    onDragStart={(e) => onDragStart(e, item)}
                  >
                    <div className="card-header">
                      <span className="student-name">{item.patient_name}</span>
                      <div className="card-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(item)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="remove-btn"
                          onClick={() => handleRemove(item.id)}
                          title="Remove"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <div className="card-body">
                      <span
                        className={`priority-badge ${item.priority.toLowerCase()}`}
                      >
                        {item.priority}
                      </span>
                      <p style={{ marginTop: "5px" }}>
                        <strong>ID:</strong> {item.studentid}
                      </p>
                      <p>
                        <strong>Complaint:</strong> {item.chief_complaint}
                      </p>
                      <p className="card-meta">
                        {item.patient_dept} | Year {item.patient_year}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
                      <select
                        value={selectedDoctors[item.id] || ""}
                        onChange={(e) => setSelectedDoctors({ ...selectedDoctors, [item.id]: e.target.value })}
                        style={{ padding: "6px 8px" }}
                      >
                        <option value="">Assign doctor...</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>{d.name} — {d.department}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssign(item.id, selectedDoctors[item.id])}
                        style={{ padding: "6px 10px" }}
                      >
                        Assign
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* In-Consultation / Assigned Section */}
            <h3 style={{ marginTop: "30px" }}>In-Consultation</h3>
            <div className="queue-list">
              {queue.filter((q) => q.status === "Assigned").length === 0 && (
                <p className="empty-msg">No patients in consultation</p>
              )}
              {queue
                .filter((q) => q.status === "Assigned")
                .map((item) => (
                  <div key={item.id} className="queue-card assigned">
                    <div className="card-header">
                      <span className="student-name">{item.patient_name}</span>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemove(item.id)}
                        title="Remove"
                      >
                        <FaTrash />
                      </button>
                    </div>
                    <div className="card-body">
                      <p>
                        <strong>Doctor:</strong> {item.doctor_name}
                      </p>
                      <p>
                        <strong>Complaint:</strong> {item.chief_complaint}
                      </p>
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
                  <div className="doc-icon">
                    <FaUserMd size={28} color="#1677ff" />
                  </div>
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
              <h2>{editingItem ? "Edit Queue Item" : "Patient Check-In"}</h2>
              <form onSubmit={handleCheckIn}>
                <div className="input-group" style={{ position: "relative" }}>
                  <label>AASTU Student ID</label>
                  <input
                    placeholder="e.g. ETS0217/15"
                    value={checkInData.studentID}
                    onChange={(e) =>
                      setCheckInData({
                        ...checkInData,
                        studentID: e.target.value,
                      })
                    }
                    onFocus={() => {
                      if (filteredPatients.length > 0) setDropdownOpen(true);
                    }}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                    onKeyDown={handleInputKeyDown}
                    disabled={!!editingItem}
                    required
                    style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
                  />

                  {/* Modern dropdown */}
                  {!editingItem && dropdownOpen && filteredPatients.length > 0 && (
                    <div style={{ position: "absolute", left: 0, right: 0, top: "100%", zIndex: 30, background: "#fff", border: "1px solid #e6e6e6", boxShadow: "0 6px 18px rgba(0,0,0,0.08)", maxHeight: 260, overflow: "auto", borderRadius: 6, marginTop: 6 }}>
                      {filteredPatients.map((p, idx) => (
                        <div
                          key={p.id}
                          onMouseDown={() => selectPatient(p)}
                          onMouseEnter={() => setActiveIndex(idx)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: 10,
                            background: idx === activeIndex ? "#f5f8ff" : "#fff",
                            cursor: "pointer",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600 }}>{p.name}</div>
                            <div style={{ color: "#666", fontSize: 12 }}>{p.studentid} — {p.department}</div>
                          </div>
                          <div style={{ color: "#777", fontSize: 12, alignSelf: "center" }}>{p.year || ""}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="input-group">
                  <label>Chief Complaint</label>
                  <textarea
                    placeholder="Explain the patient's symptoms..."
                    value={checkInData.chief_complaint}
                    onChange={(e) =>
                      setCheckInData({
                        ...checkInData,
                        chief_complaint: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="priority-selection">
                  <label>Priority Level</label>
                  <div className="priority-btns">
                    <button
                      type="button"
                      className={`p-btn normal ${checkInData.priority === "Normal" ? "active" : ""}`}
                      onClick={() =>
                        setCheckInData({ ...checkInData, priority: "Normal" })
                      }
                    >
                      🟢 Normal
                    </button>
                    <button
                      type="button"
                      className={`p-btn urgent ${checkInData.priority === "Urgent" ? "active" : ""}`}
                      onClick={() =>
                        setCheckInData({ ...checkInData, priority: "Urgent" })
                      }
                    >
                      🟡 Urgent
                    </button>
                    <button
                      type="button"
                      className={`p-btn emergency ${checkInData.priority === "Emergency" ? "active" : ""}`}
                      onClick={() =>
                        setCheckInData({
                          ...checkInData,
                          priority: "Emergency",
                        })
                      }
                    >
                      🔴 Emergency
                    </button>
                  </div>
                </div>
                <div className="modal-actions">
                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Processing..."
                      : editingItem
                        ? "Update Item"
                        : "Check-In Patient"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setShowCheckIn(false);
                      setEditingItem(null);
                      setCheckInData({
                        studentID: "",
                        chief_complaint: "",
                        priority: "Normal",
                      });
                    }}
                  >
                    Cancel
                  </button>
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
