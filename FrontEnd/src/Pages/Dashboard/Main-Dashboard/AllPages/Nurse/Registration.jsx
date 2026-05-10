import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../GlobalFiles/Sidebar";
import axios from "axios";
import "./CSS/Registration.css";

const baseURL = process.env.REACT_APP_BASE_URL;
if (!baseURL) throw new Error("REACT_APP_BASE_URL is not defined in .env");

const Registration = () => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.data.patients || {});

  const [searchID, setSearchID] = useState("");
  const [patient, setPatient] = useState(null);
  const [isNew, setIsNew] = useState(true);
  const [formData, setFormData] = useState({
    studentID: "",
    name: "",
    department: "",
    year: "",
    phoneNum: "",
    emergencyContact: "",
    bloodGroup: "",
    allergies: "",
    age: "",
    gender: "",
    email: "",
    address: "",
  });

  const notify = (text) => toast(text);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/nurses/patient?studentID=${encodeURIComponent(searchID.trim())}`,
      );
      setPatient(res.data);
      setIsNew(false);
      notify("Patient found");
    } catch (error) {
      notify("Patient not found");
      setPatient(null);
    }
  };

  useEffect(() => {
    // Fetch all patients to show list for selection when listing is needed
    if (!patients || patients.length === 0) {
      try {
        // import action dynamically to avoid circular imports at top-level
        const { GetPatients } = require("../../../../../Redux/Datas/action");
        dispatch(GetPatients());
      } catch (err) {
        console.warn("Failed to dispatch GetPatients:", err);
      }
    }
  }, [dispatch, patients]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${baseURL}/nurses/register-patient`,
        formData,
        {
          headers: { Authorization: token },
        },
      );
      if (res.data.message === "Registered") {
        notify("Patient registered successfully");
        setFormData({
          studentID: "",
          name: "",
          department: "",
          year: "",
          phoneNum: "",
          emergencyContact: "",
          bloodGroup: "",
          allergies: "",
          age: "",
          gender: "",
          email: "",
          address: "",
        });
        setIsNew(false);
      } else {
        notify(res.data.message);
      }
    } catch (error) {
      notify("Error registering patient");
    }
  };

  const handleUpdatePhone = async () => {
    try {
      await axios.patch(
        `${baseURL}/nurses/patient/phone`,
        {
          studentID: patient.studentid,
          phoneNum: patient.phonenum,
        },
      );
      notify("Phone number updated");
    } catch (error) {
      notify("Error updating phone number");
    }
  };

  return (
    <div className="container">
      <Sidebar />
      <div className="AfterSideBar">
        <ToastContainer />
        <h1>Patient Registration</h1>

        <div className="registration-actions">
          <button
            onClick={() => {
              setIsNew(true);
              setPatient(null);
            }}
          >
            New Patient
          </button>
          <button
            onClick={() => {
              setIsNew(false);
              setPatient(null);
            }}
          >
            Existing Patient
          </button>
        </div>

        {isNew ? (
          <form className="registration-form" onSubmit={handleRegister}>
            <h3>New Patient Registration</h3>
            <div className="form-grid">
              <input
                name="studentID"
                placeholder="AASTU Student ID"
                onChange={handleInputChange}
                required
              />
              <input
                name="name"
                placeholder="Full Name"
                onChange={handleInputChange}
                required
              />
              <input
                name="department"
                placeholder="Department"
                onChange={handleInputChange}
                required
              />
              <input
                name="year"
                type="number"
                placeholder="Year"
                onChange={handleInputChange}
                required
              />
              <input
                name="phoneNum"
                placeholder="Phone Number"
                onChange={handleInputChange}
                required
              />
              <input
                name="emergencyContact"
                placeholder="Emergency Contact"
                onChange={handleInputChange}
                required
              />
              <input
                name="bloodGroup"
                placeholder="Blood Group"
                onChange={handleInputChange}
              />
              <input
                name="allergies"
                placeholder="Allergies"
                onChange={handleInputChange}
              />
              <input
                name="age"
                type="number"
                placeholder="Age"
                onChange={handleInputChange}
                required
              />
              <input
                name="gender"
                placeholder="Gender (M/F)"
                onChange={handleInputChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleInputChange}
                required
              />
              <input
                name="address"
                placeholder="Address"
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit">Register Patient</button>
          </form>
        ) : (
          <div className="search-section">
            <h3>Search Patient</h3>
            <div className="search-bar">
              <input
                placeholder="Enter Student ID"
                value={searchID}
                onChange={(e) => setSearchID(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: 8 }}>Patient List</h4>
                {patients && patients.length > 0 ? (
                  <div style={{ maxHeight: 320, overflow: "auto", border: "1px solid #eee", borderRadius: 6, padding: 8 }}>
                    {patients.map((p) => (
                      <div
                        key={p.id}
                        style={{ display: "flex", justifyContent: "space-between", padding: 8, borderBottom: "1px solid #f3f3f3" }}
                      >
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ color: "#666", fontSize: 12 }}>{p.studentid}</div>
                        </div>
                        <div>
                          <button
                            onClick={() => {
                              setPatient(p);
                              setSearchID(p.studentid || "");
                            }}
                          >
                            Select
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: "#777" }}>No patients to list.</div>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ marginBottom: 8 }}>Patient Details</h4>
                {patient ? (
                  <div className="student-details-card">
                    <h3>Patient: {patient.name}</h3>
                    <p>
                      <strong>Student ID:</strong> {patient.studentid}
                    </p>
                    <p>
                      <strong>Department:</strong> {patient.department}
                    </p>
                    <p>
                      <strong>Year:</strong> {patient.year}
                    </p>
                    <div className="update-phone">
                      <label>Update Phone:</label>
                      <input
                        value={patient.phonenum}
                        onChange={(e) =>
                          setPatient({ ...patient, phonenum: e.target.value })
                        }
                      />
                      <button onClick={handleUpdatePhone}>Update</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "#777" }}>Select a patient from the list or use search.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
