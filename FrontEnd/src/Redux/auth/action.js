import * as types from "./types";
import axios from "axios";

//login user
export const patientLogin = (data) => async (dispatch) => {
  try {
    console.log("this is data given by redux", data);
    dispatch({ type: types.LOGIN_PATIENT_REQUEST });
    const res = await axios.post(
      "https://aastu-shms.onrender.com/patients/login",
      data,
    );
    dispatch({
      type: types.LOGIN_PATIENT_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: res.data.token,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_PATIENT_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

export const CheckPatientExists = (data) => async (dispatch) => {
  try {
    const res = await axios.post(
      "https://aastu-shms.onrender.com/patients/check",
      data,
    );
    dispatch({
      type: types.LOGIN_PATIENT_SUCCESS,
      payload: {
        message: res.data.message,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_PATIENT_ERROR,
      payload: {
        message: error,
      },
    });
  }
};
export const PatientSignup = (data) => async (dispatch) => {
  try {
    console.log("data given by redux", data);
    const res = await axios.post(
      "https://aastu-shms.onrender.com/patients/signup",
      data,
    );
    dispatch({
      type: types.LOGIN_PATIENT_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: res.data.token,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_PATIENT_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

//login user
export const DoctorLogin = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_DOCTOR_REQUEST });
    const res = await axios.post(
      "https://aastu-shms.onrender.com/doctors/login",
      data,
    );
    console.log("doctor", res.data);
    dispatch({
      type: types.LOGIN_DOCTOR_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: res.data.token,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_DOCTOR_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

//login user
export const AdminLogin = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.LOGIN_ADMIN_REQUEST });
    const res = await axios.post(
      "http://localhost:3007/auth/login",
      { id: data.ID, password: data.password },
    );
    console.log("here", res.data.user);
    dispatch({
      type: types.LOGIN_ADMIN_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: res.data.token,
      },
    });
    return res.data;
  } catch (error) {
    dispatch({
      type: types.LOGIN_ADMIN_ERROR,
      payload: {
        message: error.response ? error.response.data.message : error.message,
      },
    });
    return error.response ? error.response.data : { message: "Error" };
  }
};

// REGISTER DOCTOR
export const DoctorRegister = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.REGISTER_DOCTOR_REQUEST });
    console.log("here", data);
    const res = await axios.post(
      "https://aastu-shms.onrender.com/doctors/register",
      data,
    );
    return res.data;
  } catch (error) {
    dispatch({
      type: types.REGISTER_DOCTOR_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

// REGISTER ADMIN
export const AdminRegister = (data) => async (dispatch) => {
  try {
    console.log(data);
    dispatch({ type: types.REGISTER_ADMIN_REQUEST });
    const res = await axios.post(
      "http://localhost:3007/admin/register",
      data,
    );
    return res.data;
  } catch (error) {
    dispatch({
      type: types.REGISTER_ADMIN_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

// --- NEW UNIFIED STAFF ACTIONS ---

// REGISTER STAFF (Unified)
export const RegisterStaff = (data) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      "http://localhost:3007/admin/staff",
      data,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Staff Registration Error:", error);
    return error.response ? error.response.data : { message: "Error" };
  }
};

// GET ALL STAFF
export const GetAllStaff = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      "http://localhost:3007/admin/staff",
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Fetch Staff Error:", error);
    return [];
  }
};

// UPDATE STAFF STATUS (Activate/Deactivate)
export const UpdateStaffStatus = (id, data) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.put(
      `http://localhost:3007/admin/staff/${id}`,
      data,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Update Staff Error:", error);
    return { message: "Error" };
  }
};

// RESET STAFF PASSWORD
export const ResetStaffPassword = (id, password) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `http://localhost:3007/admin/staff/${id}/reset-password`,
      { password },
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { message: "Error" };
  }
};

// GET STAFF WORKLOAD
export const GetStaffWorkload = (id) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `http://localhost:3007/admin/staff/${id}/workload`,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Fetch Workload Error:", error);
    return null;
  }
};

// GET SYSTEM CONFIG
export const GetSystemConfig = (key) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `http://localhost:3007/admin/config/${key}`,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Fetch Config Error:", error);
    return null;
  }
};

// UPDATE SYSTEM CONFIG
export const UpdateSystemConfig = (data) => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `http://localhost:3007/admin/config`,
      data,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Update Config Error:", error);
    return { message: "Error" };
  }
};

// TRIGGER BACKUP
export const TriggerBackup = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `http://localhost:3007/admin/backup`,
      {},
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Backup Trigger Error:", error);
    return { message: "Error" };
  }
};

// GET AUDIT LOGS
export const GetAuditLogs = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `http://localhost:3007/admin/logs`,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Fetch Logs Error:", error);
    return [];
  }
};

// GET ADMIN STATS
export const GetAdminStats = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `http://localhost:3007/admin/stats`,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Fetch Stats Error:", error);
    return { daily: {}, roles: [], workload: [] };
  }
};

// GET TREND ANALYTICS
export const GetTrendAnalytics = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.get(
      `http://localhost:3007/admin/analytics/trends`,
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Fetch Trends Error:", error);
    return { illness: [], monthly: [] };
  }
};

// REGISTER AMBULANCE
export const AmbulanceRegister = (data) => async (dispatch) => {
  try {
    console.log("Data", data);
    dispatch({ type: types.REGISTER_AMBULANCE_REQUEST });
    const res = await axios.post(
      "https://aastu-shms.onrender.com/ambulances/add",
      data,
    );
    console.log(res);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.REGISTER_AMBULANCE_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

export const availabilityRegister = (data) => async (dispatch) => {
  try {
    console.log("ava data", data);
    dispatch({ type: types.ADD_AVAILABLETIMES_REQUEST });
    const res = await axios.post(
      "https://aastu-shms.onrender.com/doctors/availability",
      data,
    );
    console.log(data);
    console.log(res);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.ADD_AVAILABLETIMES_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

// SEED TESTING DATA
export const SeedTestingData = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `http://localhost:3007/admin/seed-testing-data`,
      {},
      { headers: { Authorization: token } }
    );
    return res.data;
  } catch (error) {
    console.error("Seeding Error:", error);
    return { message: "Failed to seed data" };
  }
};

// logout user
export const authLogout = () => async (dispatch) => {
  try {
    dispatch({
      type: types.AUTH_LOGOUT,
    });
  } catch (error) {
    console.log(error);
  }
};

//update patient
export const updatePatient = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.patch(
      `https://aastu-shms.onrender.com/patients/${id}`,
      data,
    );
    res.status === 200
      ? dispatch({ type: types.EDIT_PATIENT_REQUEST, payload: { token } })
      : console.log("passing");
    console.log(res.data);
    dispatch({
      type: types.EDIT_PATIENT_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: token,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//update doctor
export const UpdateDoctor = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.patch(
      `https://aastu-shms.onrender.com/doctors/${id}`,
      data,
    );
    res.status === 200
      ? dispatch({ type: types.EDIT_DOCTOR_REQUEST, payload: { token } })
      : console.log("passing");
    console.log(res.data);
    dispatch({
      type: types.EDIT_DOCTOR_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: token,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const UpdateAdmin = (id, data, token) => async (dispatch) => {
  try {
    const res = await axios.patch(
      `https://aastu-shms.onrender.com/admin/${id}`,
      data,
    );
    res.status === 200
      ? dispatch({ type: types.EDIT_ADMIN_REQUEST, payload: { token } })
      : console.log("passing");
    console.log(res.data);
    dispatch({
      type: types.EDIT_ADMIN_SUCCESS,
      payload: {
        message: res.data.message,
        user: res.data.user,
        token: token,
      },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//update doctor
export const sendVerification = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.EDIT_DOCTOR_REQUEST });
    const res = await axios.post(
      `https://aastu-shms.onrender.com/admin/verification`,
      data,
    );
    // console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const mailCreds = (data) => async (dispatch) => {
  try {
    //dispatch({ type: types.EDIT_DOCTOR_REQUEST });
    const res = await axios.post(
      `https://aastu-shms.onrender.com/admin/mailCreds`,
      data,
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
//update doctor
export const forgetPassword = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.FORGET_PASSWORD_REQUEST });
    const res = await axios.post(
      `https://zany-gray-clam-gear.cyclic.app/admin/forgot`,
      data,
    );
    // console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
