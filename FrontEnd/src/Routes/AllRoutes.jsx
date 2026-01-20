import React from "react";
import { Route, Routes } from "react-router-dom";
import DLogin from "../Pages/Dashboard/Dashboard-Login/DLogin";
import DSignup from "../Pages/Dashboard/Dashboard-Login/Signup/DSignup";
import AddStaff from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/AddStaff";
import ManageStaff from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/ManageStaff";
import AllReport from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/AllReport";
import Check_Appointment from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/Check_Appointment";
import Create_Report from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/Create_Report";
import Doctor_Profile from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/Doctor_Profile";
import Patient_Details from "../Pages/Dashboard/Main-Dashboard/AllPages/Doctor/Patient_Details";
import Book_Appointment from "../Pages/Dashboard/Main-Dashboard/AllPages/Patient/Book_Appointment";
import Patient_Profile from "../Pages/Dashboard/Main-Dashboard/AllPages/Patient/Patient_Profile";
import FrontPage from "../Pages/Dashboard/Main-Dashboard/GlobalFiles/FrontPage";
import Admin_Profile from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/Admin_Profile";
import SystemConfig from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/SystemConfig";
import AuditLogs from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/AuditLogs";
import AdminAnalytics from "../Pages/Dashboard/Main-Dashboard/AllPages/Admin/AdminAnalytics";
import SignupDetails from "../Pages/Dashboard/Dashboard-Login/Signup/SignupDetails";
import MainPortal from "../Pages/MainPortal/MainPortal";
import QueueScreen from "../Pages/MainPortal/QueueScreen";
import Registration from "../Pages/Dashboard/Main-Dashboard/AllPages/Nurse/Registration";
import Queue from "../Pages/Dashboard/Main-Dashboard/AllPages/Nurse/Queue";
import CertificatesPage from "../Pages/Dashboard/Main-Dashboard/AllPages/Nurse/CertificatesPage";

import Pending_Tests from "../Pages/Dashboard/Main-Dashboard/AllPages/Laboratory/Pending_Tests";
import Lab_History from "../Pages/Dashboard/Main-Dashboard/AllPages/Laboratory/Lab_History";
const AllRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainPortal />} />
        <Route path="/login" element={<DLogin />} />
        <Route path="/queue" element={<QueueScreen />} />
        <Route path="/signup" element={<DSignup />} />
        <Route path="/adddetails" element={<SignupDetails />} />
        <Route path="/dashboard" element={<FrontPage />} />
        <Route path="/addstaff" element={<AddStaff />} />
        <Route path="/managestaff" element={<ManageStaff />} />
        <Route path="/adminprofile" element={<Admin_Profile />} />
        <Route path="/systemsetup" element={<SystemConfig />} />
        <Route path="/auditlogs" element={<AuditLogs />} />
        <Route path="/analytics" element={<AdminAnalytics />} />
        {/* ******************** Doctor Part ************************* */}
        <Route path="/reports" element={<AllReport />} />
        <Route path="/checkappointment" element={<Check_Appointment />} />
        <Route path="/createreport" element={<Create_Report />} />
        <Route path="/patientdetails" element={<Patient_Details />} />
        <Route path="/doctorprofile" element={<Doctor_Profile />} />
        {/* ******************** Patient Part ************************* */}
        <Route path="/bookappointment" element={<Book_Appointment />} />
        <Route path="/patientprofile" element={<Patient_Profile />} />
        {/* ******************** Nurse Part ************************* */}
        <Route path="/registration" element={<Registration />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        ******************** Laboratory Part *************************
        <Route path="/lab/pending" element={<Pending_Tests />} />
        <Route path="/lab/history" element={<Lab_History />} />
      </Routes>
    </>
  );
};

export default AllRoutes;
