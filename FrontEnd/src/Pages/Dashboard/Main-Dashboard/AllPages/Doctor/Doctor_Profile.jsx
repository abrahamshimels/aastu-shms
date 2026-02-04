import React, { useEffect, useState } from "react";
import "../Doctor/CSS/Doctor_Profile.css";
import { BiMoney, BiTime } from "react-icons/bi";
import { GiMeditation } from "react-icons/gi";
import { AiFillCalendar, AiFillClockCircle } from "react-icons/ai";
import { MdBloodtype, MdCastForEducation, MdEmail } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { BsHouseFill, BsGenderAmbiguous } from "react-icons/bs";
import { MdOutlineCastForEducation } from "react-icons/md";
import { FaRegHospital, FaMapMarkedAlt, FaBirthdayCake } from "react-icons/fa";
import Sidebar from "../../GlobalFiles/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { message, Modal, Form, Input, Select } from "antd";
import { UpdateDoctor } from "../../../../../Redux/auth/action";
import { GetDoctorDetails } from "../../../../../Redux/Datas/action";
import { Navigate } from "react-router-dom";
import "./CSS/Doctor_Profile.css";
import { availabilityRegister } from "../../../../../Redux/auth/action";

// *********************************************************
const Doctor_Profile = () => {
  const { data } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  console.log("user state", data);

  console.log("DATA JANAB ", data);
  const { doctors: doctorsObj, loading } = useSelector((store) => store.data);
  const doctors = doctorsObj?.doctors || [];

  const doctor = doctors.find((doctor) => data.user.email === doctor.email);
  const profileDoctor = doctor || data?.user;
  console.log(doctor);
  useEffect(() => {
    dispatch(GetDoctorDetails());
  }, []);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileForm] = Form.useForm();

  const showModal = () => {
    setFormData({
      oldPass: "",
      newPass: "",
      confirmNewPass: "",
    });
    setDetailsOpen(true);
  };

  const showAvailabilityModal = () => {
    setAvailabilityModalOpen(true);
  };

  const showProfileModal = () => {
    if (profileDoctor) {
      profileForm.setFieldsValue({
        name: profileDoctor.name,
        phonenum: profileDoctor.phonenum,
        email: profileDoctor.email,
        age: profileDoctor.age,
        gender: profileDoctor.gender,
        bloodgroup: profileDoctor.bloodgroup,
        dob: profileDoctor.dob,
        address: profileDoctor.address,
        education: profileDoctor.education,
        department: profileDoctor.department,
        fees: profileDoctor.fees,
      });
    }
    setProfileModalOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setDetailsOpen(false);
      setAvailabilityModalOpen(false);
      setProfileModalOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const success = (text) => {
    messageApi.success(text);
  };
  const error = (text) => {
    messageApi.error(text);
  };

  const handleCancel = () => {
    setDetailsOpen(false);
    setAvailabilityModalOpen(false);
    setProfileModalOpen(false);
  };

  const [formData, setFormData] = useState({
    newPass: "",
  });

  const [formAvailability, setFormAvailability] = useState({
    id: data.user.id,
    MAS: "",
    MAE: "",
    EAS: "",
    EAE: "",
  });

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setFormAvailability({
      ...formAvailability,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = () => {
    data.user.password === formData.oldPass
      ? data.user.password !== formData.newPass
        ? formData.confirmNewPass === formData.newPass
          ? (() => {
              dispatch(
                UpdateDoctor(
                  data.user.id,
                  { password: formData.newPass },
                  data.token,
                ),
              ).then((res) => {
                if (res.message === "password updated") {
                  success("User updated");
                  handleOk();
                } else {
                  error("Something went wrong.");
                }
              });
            })()
          : error("Passwords do not match")
        : error("New password same as old")
      : error("Incorrect Old Password");
  };

  const handleAvailabilityFormSubmit = (e) => {
    e.preventDefault();
    const toMinutes = (time) => {
      if (!time) return null;
      const [h, m] = time.split(":").map(Number);
      if (Number.isNaN(h) || Number.isNaN(m)) return null;
      return h * 60 + m;
    };

    const morningStart = formAvailability.MAS?.trim();
    const morningEnd = formAvailability.MAE?.trim();
    const eveningStart = formAvailability.EAS?.trim();
    const eveningEnd = formAvailability.EAE?.trim();

    const hasMorning = morningStart || morningEnd;
    const hasEvening = eveningStart || eveningEnd;

    if (!hasMorning && !hasEvening) {
      error("Please provide at least one availability range.");
      return;
    }

    if ((morningStart && !morningEnd) || (!morningStart && morningEnd)) {
      error("Please provide both morning start and end time.");
      return;
    }

    if ((eveningStart && !eveningEnd) || (!eveningStart && eveningEnd)) {
      error("Please provide both evening start and end time.");
      return;
    }

    const morningStartMin = toMinutes(morningStart);
    const morningEndMin = toMinutes(morningEnd);
    const eveningStartMin = toMinutes(eveningStart);
    const eveningEndMin = toMinutes(eveningEnd);

    if (morningStart && (morningStartMin === null || morningEndMin === null)) {
      error("Invalid morning time format.");
      return;
    }

    if (eveningStart && (eveningStartMin === null || eveningEndMin === null)) {
      error("Invalid evening time format.");
      return;
    }

    if (morningStart && morningStartMin > morningEndMin) {
      error("Morning end time must be after start time.");
      return;
    }

    if (eveningStart && eveningStartMin > eveningEndMin) {
      error("Evening end time must be after start time.");
      return;
    }

    setConfirmLoading(true);
    dispatch(availabilityRegister(formAvailability)).then((res) => {
      console.log("availbility res", res);
      if (res.message === "Successful") {
        success("Availability updated");
        handleOk();
      } else {
        error("something went wrong");
      }
    });
  };

  console.log("newPass", formData.newPass);

  const dobString = profileDoctor?.dob;
  const dobDate = new Date(dobString);

  const formattedDob = dobString
    ? dobDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : "N/A";

  function filterAvailability(availability) {
    const result = [];
    // Display the first entry
    result.push(availability[0]);

    for (let i = 0; i < availability.length - 1; i++) {
      const time1 = new Date(`1970-01-01T${availability[i]}`);
      const time2 = new Date(`1970-01-01T${availability[i + 1]}`);
      const timeDifference = (time2 - time1) / (1000 * 60); // Difference in minutes

      if (timeDifference > 15) {
        result.push(availability[i], availability[i + 1]);
      }
    }

    // Display the last entry
    result.push(availability[availability.length - 1]);

    return result;
  }

  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "doctor") {
    return <Navigate to={"/dashboard"} />;
  }

  if (loading) {
    return (
      <div className="container">
        <Sidebar />
        <div
          className="AfterSideBar"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!profileDoctor) {
    return (
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar" style={{ padding: "2rem" }}>
          <h1>Doctor Profile Not Found</h1>
          <p>
            This might be because the database is empty or registration is
            incomplete.
          </p>
          <p>
            Please run <code>node seed_doctor.js</code> in the Backend folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="maindoctorProfile">
            <div className="firstBox">
              <div>
                <img src={data?.user?.image} alt="docimg" />
              </div>
              <hr />
              <div className="singleitemdiv">
                <GiMeditation className="singledivicons" />
                {/* <p>Name :</p> */}
                <p>{profileDoctor.name}</p>
              </div>
              <div className="singleitemdiv">
                <BsFillTelephoneFill className="singledivicons" />
                <p>{profileDoctor.phonenum}</p>
              </div>
              <div className="singleitemdiv">
                <MdEmail className="singledivicons" />
                <p>{profileDoctor.email}</p>
              </div>
              <div className="singleitemdiv">
                <FaBirthdayCake className="singledivicons" />
                <p>{formattedDob}</p>
              </div>
              <div className="singleitemdiv">
                <button onClick={showModal}> Change Password</button>
                <button onClick={showAvailabilityModal}>
                  {""}
                  Set Availabilitys
                </button>
                <button onClick={showProfileModal}>Edit Profile</button>
              </div>

              <Modal
                title="CHANGE PASSWORD"
                open={detailsOpen}
                onOk={handleFormSubmit}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                <form className="inputForm">
                  <input
                    name="oldPass"
                    value={formData.oldPass}
                    onChange={handleFormChange}
                    type="password"
                    placeholder="Old Password"
                  />
                  <input
                    name="newPass"
                    type="password"
                    value={formData.newPass}
                    onChange={handleFormChange}
                    placeholder="New Password"
                  />
                  <input
                    name="confirmNewPass"
                    type="password"
                    value={formData.confirmNewPass}
                    onChange={handleFormChange}
                    placeholder="Confirm New Password"
                  />
                </form>
              </Modal>
              <Modal
                title="Set Availabilitys"
                open={availabilityModalOpen}
                onOk={handleAvailabilityFormSubmit}
                onCancel={handleCancel}
              >
                <form className="inputForm">
                  <p>Morning Availabilitys</p>
                  <input
                    name="MAS"
                    value={formAvailability.MAS}
                    onChange={handleFormChange}
                    type="time"
                    placeholder="8:00 am -- 2:00 pm:"
                  />
                  <input
                    name="MAE"
                    value={formAvailability.MAE}
                    onChange={handleFormChange}
                    type="time"
                    placeholder="8:00 am -- 2:00 pm:"
                  />
                  <p>Evening Availabilitys</p>
                  <input
                    name="EAS"
                    value={formAvailability.EAS}
                    onChange={handleFormChange}
                    type="time"
                    placeholder="8:00 am -- 2:00 pm:"
                  />
                  <input
                    name="EAE"
                    value={formAvailability.EAE}
                    onChange={handleFormChange}
                    type="time"
                    inputMode="numeric"
                    placeholder="8:00 am -- 2:00 pm:"
                  />
                </form>
              </Modal>
              <Modal
                title="Edit Profile"
                open={profileModalOpen}
                onOk={() => {
                  profileForm.validateFields().then((values) => {
                    setConfirmLoading(true);
                    dispatch(
                      UpdateDoctor(data.user.id, values, data.token),
                    ).then((res) => {
                      if (res?.message === "profile updated") {
                        success("Profile updated");
                        handleOk();
                      } else {
                        error("Something went wrong.");
                        setConfirmLoading(false);
                      }
                    });
                  });
                }}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
              >
                <Form layout="vertical" form={profileForm}>
                  <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: "Name is required" }]}
                  >
                    <Input placeholder="Full Name" />
                  </Form.Item>
                  <Form.Item name="email" label="Email">
                    <Input disabled />
                  </Form.Item>
                  <Form.Item
                    name="phonenum"
                    label="Phone Number"
                    rules={[{ required: true, message: "Phone is required" }]}
                  >
                    <Input placeholder="Phone Number" />
                  </Form.Item>
                  <Form.Item
                    name="age"
                    label="Age"
                    rules={[{ required: true, message: "Age is required" }]}
                  >
                    <Input type="number" placeholder="Age" />
                  </Form.Item>
                  <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: "Gender is required" }]}
                  >
                    <Select placeholder="Select gender">
                      <Select.Option value="M">Male</Select.Option>
                      <Select.Option value="F">Female</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="bloodgroup"
                    label="Blood Group"
                    rules={[
                      { required: true, message: "Blood group is required" },
                    ]}
                  >
                    <Select placeholder="Select blood group">
                      <Select.Option value="A+">A+</Select.Option>
                      <Select.Option value="A-">A-</Select.Option>
                      <Select.Option value="B+">B+</Select.Option>
                      <Select.Option value="B-">B-</Select.Option>
                      <Select.Option value="AB+">AB+</Select.Option>
                      <Select.Option value="AB-">AB-</Select.Option>
                      <Select.Option value="O+">O+</Select.Option>
                      <Select.Option value="O-">O-</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="dob"
                    label="Date of Birth"
                    rules={[
                      { required: true, message: "Date of birth is required" },
                    ]}
                  >
                    <Input type="date" />
                  </Form.Item>
                  <Form.Item
                    name="address"
                    label="Address"
                    rules={[{ required: true, message: "Address is required" }]}
                  >
                    <Input placeholder="Address" />
                  </Form.Item>
                  <Form.Item
                    name="education"
                    label="Education"
                    rules={[
                      { required: true, message: "Education is required" },
                    ]}
                  >
                    <Input placeholder="Education" />
                  </Form.Item>
                  <Form.Item
                    name="department"
                    label="Department"
                    rules={[
                      { required: true, message: "Department is required" },
                    ]}
                  >
                    <Input placeholder="Department" />
                  </Form.Item>
                  <Form.Item
                    name="fees"
                    label="Fees"
                    rules={[{ required: true, message: "Fees is required" }]}
                  >
                    <Input type="number" placeholder="Fees" />
                  </Form.Item>
                </Form>
              </Modal>
            </div>
            {/* ***********  Second Div ******************** */}
            <div className="SecondBox">
              <div className="subfirstbox">
                <h2 style={{ textAlign: "center", marginTop: "10px" }}>
                  Other Info
                </h2>
                <div className="singleitemdiv">
                  <AiFillClockCircle className="singledivicons" />
                  {/* <p>{`${doctor.availability[0]} - ${
                    doctor.availability[doctor.availability.length - 1]
                  }`}</p> */}
                  <div>
                    <p>
                      {profileDoctor?.availability?.length
                        ? filterAvailability(profileDoctor.availability).join(
                            " - ",
                          )
                        : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="singleitemdiv">
                  <MdCastForEducation className="singledivicons" />
                  <p>{profileDoctor.department}</p>
                </div>
                {/* <div className="singleitemdiv">
                  <BsHouseFill className="singledivicons" />
                  <p>{doctor.address}</p>
                </div> */}
                <div className="singleitemdiv">
                  <BsHouseFill
                    className="singledivicons"
                    style={{ marginBottom: "30px", color: "orange" }}
                  />
                  <p
                    style={{
                      marginLeft: "10px",
                      fontSize: "1.2rem",
                      color: "#555",
                      marginBottom: "30px",
                    }}
                  >
                    {profileDoctor.address}
                  </p>
                </div>
              </div>
              {/* ***********  Third Div ******************** */}
              <div className="subSecondBox">
                <h2 style={{ textAlign: "center", marginTop: "10px" }}>
                  Hospital Details
                </h2>
                <div className="singleitemdiv">
                  <BiTime className="singledivicons" />
                  <p>09:00 AM - 20:00 PM (TIMING)</p>
                </div>
                <div className="singleitemdiv">
                  <FaRegHospital className="singledivicons" />
                  <p>AZIZ FATIMA HOSPITAL</p>
                </div>
                <div className="singleitemdiv">
                  <FaMapMarkedAlt className="singledivicons" />
                  <p>
                    Faisalabad - Sheikhupura Road, Gulistan Colony Faisalabad,
                    Punjab
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Doctor_Profile;
