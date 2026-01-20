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
  const { patients: patientsObj, doctors: doctorsObj, appointments: appointmentsObj, loading } = useSelector((store) => store.data);
  const patients = patientsObj?.patients || [];
  const doctors = doctorsObj?.doctors || [];
  const appointments = appointmentsObj?.appointments || [];
  console.log(appointments);
  const patient =
    data.user.userType === "patient"
      ? patients.find((p) => p.id === appointments[0]?.patientid)
      : appointments.map((appointment) => {
        return patients.find(
          (p) => p.id === appointment.patientid
        ) || { name: "Unknown Patient", phonenum: "N/A" };
      });

  const doctorData =
    data.user.userType === "patient"
      ? appointments.map((appointment) => {
        return doctors.find((d) => d.id === appointment.doctorid) || { name: "Unknown Doctor", phonenum: "N/A", department: "N/A", fees: "N/A" };
      })
      : doctors.find((d) => d.id === data.user.id) || { department: "N/A", fees: "N/A" };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const createData = (
    id,
    name,
    date,
    time,
    phonenum,
    department,
    fees,
    problem,
    buttonText
  ) => {
    return {
      id,
      name,
      date,
      time,
      buttonText,
      details: [{ phonenum, department, problem, fees }],
    };
  };

  const columns = [
    {
      userType: data.user.userType,
      label: "Name",
      align: "left",
    },
    { label: "Date", align: "right" },
    { label: "Time", align: "right" },
    {
      label:
        data.user.userType === "patient"
          ? "Cancel Appointment"
          : "Generate Report",
      align: "right",
    },
  ];

  const datas = appointments.map((appointment, index) => {
    return data.user.userType === "patient"
      ? createData(
        appointment.id,
        doctorData[index]?.name,
        appointment.date,
        appointment.time,
        doctorData[index]?.phonenum,
        doctorData[index]?.department,
        doctorData[index]?.fees,
        appointment.problem,
        "Cancel"
      )
      : createData(
        appointment.id,
        patient[index]?.name,
        appointment.date,
        appointment.time,
        patient[index]?.phonenum,
        doctorData?.department,
        doctorData?.fees,
        appointment.problem,
        "Generate Report"
      );
  });
  const clicked = (index) => {
    let appointment;
    data.user.userType === "patient"
      ? dispatch(DeleteAppointment(index)).then((res) => {
        console.log(res);
        if (res.message === "successful") {
          notify("Appointment Cancelled");
        }
      })
      : (appointment = appointments.find(
        (appointment) => appointment.id === index
      ));
    console.log(appointment);
    if (appointment !== undefined) {
      return navigate("/createreport", { state: appointment });
    }
  };
  useEffect(() => {
    dispatch(GetAppointments(data.user.userType, data.user.id));
    if (patients.length === 0) dispatch(GetPatients());
    if (doctors.length === 0) dispatch(GetDoctorDetails());
  }, []);

  if (loading) {
    return (
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <h1>Loading Appointments...</h1>
        </div>
      </div>
    );
  }

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
              {appointments.length > 0 ? (
                <CollapsibleTable
                  data={datas}
                  columns={columns}
                  onDelete={clicked}
                />
              ) : (
                <div style={{ padding: "2rem", textAlign: "center" }}>
                  <h3>No Appointments Found</h3>
                  <p>You need an active appointment to generate a lab request.</p>
                  <p>Please run <code>node seed_full_workflow.js</code> in the Backend folder to set up test data.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Check_Appointment;
