import { useEffect } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import CollapsibleTable from "../../../../../Components/Table/CollapsibleTable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DeleteAppointment,
  GetAppointments,
  GetPatients,
  GetDoctorDetails,
} from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";

const notify = (text) => toast(text);

const Check_Appointment = () => {
  const { data } = useSelector((store) => store.auth);
  const { patients } = useSelector((store) => store.data.patients);
  const { doctors } = useSelector((store) => store.data.doctors);
  const { appointments } = useSelector((store) => store.data.appointments);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data.user?.userType) {
      dispatch(GetAppointments(data.user.userType, data.user.id));
      dispatch(GetPatients());
      dispatch(GetDoctorDetails());
    }
  }, [data.user]);

  const createData = (
    id,
    patient_name,
    doctor_name,
    date,
    time,
    phonenum,
    department,
    problem,
    buttonText
  ) => {
    return {
      id,
      patient_name,
      doctor_name,
      date,
      time,
      buttonText,
      details: [{ phonenum, department, problem }],
    };
  };

  const columns = [
    {
      userType: data.user?.userType,
      label: data.user?.userType === "patient" ? "Doctor Name" : "Patient Name",
      key: data.user?.userType === "patient" ? "doctor_name" : "patient_name",
      align: "left",
    },
    { label: "Date", key: "date", align: "right" },
    { label: "Time", key: "time", align: "right" },
    {
      label:
        data.user?.userType === "patient"
          ? "Cancel Appointment"
          : data.user?.userType === "nurse"
          ? "Status"
          : "Generate Report",
      align: "right",
    },
  ];

  if (data.user?.userType === "nurse") {
    columns.splice(1, 0, { label: "Doctor Name", key: "doctor_name", align: "left" });
  }

  const datas = (appointments || []).map((appointment) => {
    const pName = appointment.patient_name || "Unknown";
    const dName = appointment.doctor_name || "Unknown";
    
    // For details section
    const activeDoctor = (doctors || []).find((d) => d.id === appointment.doctorid);
    const dDept = activeDoctor?.department || "N/A";
    const pPhone = data.user?.userType === "patient" ? activeDoctor?.phonenum : (patients?.find(p => p.id === appointment.patientid)?.phonenum || "N/A");

    return createData(
      appointment.id,
      data.user?.userType === "patient" ? "" : pName,
      data.user?.userType === "doctor" ? "" : dName,
      appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A",
      appointment.time,
      pPhone,
      dDept,
      appointment.problem,
      data.user?.userType === "patient" ? "Cancel" : data.user?.userType === "nurse" ? "Confirmed" : "Generate Report"
    );
  });

  const clicked = (index) => {
    if (data.user?.userType === "nurse") return; // Nurses cannot take actions
    if (data.user?.userType === "patient") {
      dispatch(DeleteAppointment(index)).then((res) => {
        if (res?.message === "successful") {
          notify("Appointment Cancelled");
        }
      });
    } else if (data.user?.userType === "doctor") {
      const appointment = (appointments || []).find((a) => a.id === index);
      if (appointment) {
        navigate("/createreport", { state: appointment });
      }
    }
  };

  if (data?.isAuthenticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType === "admin") {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Payment_Page">
            <h1 style={{ marginBottom: "2rem" }}>Appointment Details</h1>
            <div className="patientBox">
              <CollapsibleTable
                data={datas}
                columns={columns}
                onDelete={clicked}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Check_Appointment;
