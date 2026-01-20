import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  DeleteAppointment,
  CreateReport,
  createLabRequest,
} from "../../../../../Redux/Datas/action";
import { Modal, Form, Select, Input, Button } from "antd";
import Sidebar from "../../GlobalFiles/Sidebar";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import "../Admin/CSS/Add_Doctor.css";
const notify = (text) => toast(text);

const Create_Report = () => {
  const navigate = useNavigate();
  const { data } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const creds = location.state;
  const dispatch = useDispatch();

  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [labForm] = Form.useForm();
  const initmed = {
    name: "",
    dosage: "",
    frequency: "",
    duration: "",
  };
  const [med, setMed] = useState(initmed);

  const [medicines, setMedicines] = useState([]);

  const HandleMedChange = (e) => {
    setMed({ ...med, [e.target.name]: e.target.value });
  };
  const InitData = {
    patientid: creds?.patientid,
    doctorid: creds?.doctorid,
    date: "",
    time: "",
    disease: "",
    temperature: "",
    weight: "",
    BP: "",
    glucose: "",
    info: "",
    medicines: [],
  };

  const [reportValue, setReportValue] = useState(InitData);
  console.log(reportValue);
  const HandleReportChange = (e) => {
    setReportValue({ ...reportValue, [e.target.name]: e.target.value });
  };

  const HandleMedAdd = (e) => {
    e.preventDefault();
    setMedicines([...medicines, med]);
    setMed(initmed);
  };

  console.log(medicines);

  const HandleReportSubmit = (e) => {
    e.preventDefault();
    let data = {
      ...reportValue,
      medicines,
      appointmentid: creds?.id,
    };
    console.log(data);
    try {
      console.log("reports", data);
      setLoading(true);
      dispatch(CreateReport(data)).then((res) => {
        if (res.message === "successful") {
          dispatch(DeleteAppointment(creds?.id)).then((res) => {
            if (res.message === "successful") {
              notify("Report Created Sucessfully");
              setTimeout(() => {
                return navigate("/checkappointment");
              }, 2000);
            }
          });
          setLoading(false);
          setReportValue(InitData);
        } else {
          setLoading(false);
          notify("Something went Wrong");
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleLabRequestSubmit = (values) => {
    const payload = {
      patient_id: creds?.patientid,
      test_type: values.test_type,
      priority: values.priority,
      notes: values.notes,
    };
    dispatch(createLabRequest(payload, data.token)).then((res) => {
      if (res) {
        notify("Lab Request Sent Successfully");
        setIsLabModalOpen(false);
        labForm.resetFields();
      } else {
        notify("Failed to send Lab Request");
      }
    });
  };

  if (data?.isAuthenticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "doctor") {
    return <Navigate to={"/dashboard"} />;
  }
  return (
    <>
      <ToastContainer />
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="Main_Add_Doctor_div">
            <h1>Create Report</h1>
            <form>
              <div>
                <label>Date</label>
                <div className="inputdiv">
                  <input
                    type="date"
                    placeholder="dd-mm-yyyy"
                    name="date"
                    value={reportValue.date}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                <label>Time</label>
                <div className="inputdiv">
                  <input
                    type="time"
                    name="time"
                    value={reportValue.time}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>

              <div>
                <label>Patient Disease</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Disease"
                    name="disease"
                    value={reportValue.disease}
                    onChange={HandleReportChange}
                    required
                  />
                </div>
              </div>
              <div>
                <label>Patient Temperature</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="99^F"
                    name="temperature"
                    value={reportValue.temperature}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>

              <div>
                <label>Patient Weight</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="75 KG"
                    name="weight"
                    value={reportValue.weight}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                <label>Patient BP</label>
                <div className="inputdiv adressdiv">
                  <input
                    type="text"
                    placeholder="140/90 mmHg"
                    name="BP"
                    value={reportValue.BP}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                <label>Patient Glucose</label>
                <div className="inputdiv">
                  <input
                    type="number"
                    placeholder="99 mg/dL"
                    name="glucose"
                    value={reportValue.glucose}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              <div>
                <label>Extra Info</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="Info"
                    name="info"
                    value={reportValue.info}
                    onChange={HandleReportChange}
                  />
                </div>
              </div>
              {/* ******************************************** */}
              <div>
                <label>Medicines</label>
                <div className="inputdiv">
                  <input
                    type="text"
                    placeholder="PCM"
                    name="name"
                    value={med.name}
                    onChange={HandleMedChange}
                  />
                  <input
                    type="text"
                    placeholder="frequency"
                    name="frequency"
                    value={med.frequency}
                    onChange={HandleMedChange}
                  />
                  {/* <select name="duration" onChange={HandleMedChange}> */}
                  {/* <option value="Dosage">Duration</option>
                    <option value="After Meal">After Meal</option>
                    <option value="Before Meal">Before Meal</option>
                  </select> */}
                  <input
                    type="number"
                    placeholder="Duration(Days)"
                    name="duration"
                    value={med.duration}
                    onChange={HandleMedChange}
                  />
                  <select name="dosage" onChange={HandleMedChange}>
                    <option value="Dosage">Dosage</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </select>
                  {/* <input type="submit" value={"Add"} onClick={HandleMedAdd} /> */}
                  <button className="addbutton" onClick={HandleMedAdd}>
                    {"Add"}
                  </button>
                </div>
              </div>
              {/* *********************************** */}

              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "2rem" }}>
                <button
                  className="formsubmitbutton"
                  style={{ width: "200px", margin: "0" }}
                  onClick={HandleReportSubmit}
                >
                  {loading ? "Loading..." : "Generate Report"}
                </button>

                <button
                  type="button"
                  className="formsubmitbutton"
                  style={{ width: "240px", margin: "0", backgroundColor: "#52c41a" }}
                  onClick={() => setIsLabModalOpen(true)}
                >
                  Request Laboratory Test
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        title="Send Laboratory Request"
        open={isLabModalOpen}
        onCancel={() => setIsLabModalOpen(false)}
        footer={null}
      >
        <Form form={labForm} layout="vertical" onFinish={handleLabRequestSubmit}>
          <Form.Item
            label="Test Type"
            name="test_type"
            rules={[{ required: true, message: "Please select test type" }]}
          >
            <Select placeholder="Select Test">
              <Select.Option value="Blood Test">Blood Test</Select.Option>
              <Select.Option value="Urine Test">Urine Test</Select.Option>
              <Select.Option value="X-Ray">X-Ray</Select.Option>
              <Select.Option value="ECG">ECG</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Priority" name="priority" initialValue="Normal">
            <Select>
              <Select.Option value="Normal">Normal</Select.Option>
              <Select.Option value="Urgent">Urgent</Select.Option>
              <Select.Option value="Emergency">Emergency</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Doctor Notes" name="notes">
            <Input.TextArea rows={3} placeholder="Specific instructions for the lab..." />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Send Request to Lab
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Create_Report;
