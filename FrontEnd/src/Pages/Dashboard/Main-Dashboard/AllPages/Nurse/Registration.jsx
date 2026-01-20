import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../../GlobalFiles/Sidebar";
import axios from "axios";
import "./CSS/Registration.css";

const Registration = () => {
  const [searchID, setSearchID] = useState("");
  const [student, setStudent] = useState(null);
  const [isNew, setIsNew] = useState(false);
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
      const res = await axios.get(`http://localhost:3007/nurses/student?studentID=${encodeURIComponent(searchID.trim())}`);
      setStudent(res.data);
      setIsNew(false);
      notify("Student found");
    } catch (error) {
      notify("Student not found");
      setStudent(null);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3007/nurses/register-student", formData);
      if (res.data.message === "Registered") {
        notify("Student registered successfully");
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
      notify("Error registering student");
    }
  };

  const handleUpdatePhone = async () => {
    try {
      await axios.patch(`http://localhost:3007/nurses/student/phone`, {
        studentID: student.studentid,
        phoneNum: student.phonenum,
      });
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
        <h1>Student Registration</h1>
        
        <div className="registration-actions">
          <button onClick={() => { setIsNew(true); setStudent(null); }}>New Student</button>
          <button onClick={() => { setIsNew(false); setStudent(null); }}>Existing Student</button>
        </div>

        {isNew ? (
          <form className="registration-form" onSubmit={handleRegister}>
            <h3>New Student Registration</h3>
            <div className="form-grid">
              <input name="studentID" placeholder="AASTU Student ID" onChange={handleInputChange} required />
              <input name="name" placeholder="Full Name" onChange={handleInputChange} required />
              <input name="department" placeholder="Department" onChange={handleInputChange} required />
              <input name="year" type="number" placeholder="Year" onChange={handleInputChange} required />
              <input name="phoneNum" placeholder="Phone Number" onChange={handleInputChange} required />
              <input name="emergencyContact" placeholder="Emergency Contact" onChange={handleInputChange} required />
              <input name="bloodGroup" placeholder="Blood Group" onChange={handleInputChange} />
              <input name="allergies" placeholder="Allergies" onChange={handleInputChange} />
              <input name="age" type="number" placeholder="Age" onChange={handleInputChange} required />
              <input name="gender" placeholder="Gender (M/F)" onChange={handleInputChange} required />
              <input name="email" type="email" placeholder="Email" onChange={handleInputChange} required />
              <input name="address" placeholder="Address" onChange={handleInputChange} required />
            </div>
            <button type="submit">Register Student</button>
          </form>
        ) : (
          <div className="search-section">
            <h3>Search Student</h3>
            <div className="search-bar">
              <input 
                placeholder="Enter Student ID" 
                value={searchID} 
                onChange={(e) => setSearchID(e.target.value)} 
              />
              <button onClick={handleSearch}>Search</button>
            </div>

            {student && (
              <div className="student-details-card">
                <h3>Student Found: {student.name}</h3>
                <p><strong>Department:</strong> {student.department}</p>
                <p><strong>Year:</strong> {student.year}</p>
                <div className="update-phone">
                  <label>Update Phone:</label>
                  <input 
                    value={student.phonenum} 
                    onChange={(e) => setStudent({...student, phonenum: e.target.value})} 
                  />
                  <button onClick={handleUpdatePhone}>Update</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Registration;
