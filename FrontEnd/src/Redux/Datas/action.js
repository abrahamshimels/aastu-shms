import * as types from "./types";
import axios from "axios";

const baseURL = "http://localhost:3007";

// CreateReport
export const CreateReport = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_REPORT_REQUEST });
    const res = await axios.post("http://localhost:3007/reports", data, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    const res = await axios.post(
      "http://localhost:3007/reports/create",
      data,
    );
    console.log(res);
    return res.data;
  } catch (error) {
    dispatch({
      type: types.CREATE_REPORT_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

// GET DOCTOR DETAILS
export const GetDoctorDetails = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_DOCTOR_REQUEST });
    const res = await axios.get("http://localhost:3007/admin/staff", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    const res = await axios.get("http://localhost:3007/doctors");
    console.log("this", res);
    const doctors = { doctors: res.data };
    dispatch({
      type: types.GET_DOCTOR_SUCCESS,
      payload: doctors,
    });
  } catch (error) {
    dispatch({
      type: types.GET_DOCTOR_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

export const GetAdminDetails = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ADMIN_REQUEST });
    const res = await axios.get("http://localhost:3007/admin/staff", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    const res = await axios.get("http://localhost:3007/admin");
    console.log(res.data);
    const admins = { admins: res.data };
    dispatch({
      type: types.GET_ADMIN_SUCCESS,
      payload: admins,
    });
  } catch (error) {
    dispatch({
      type: types.GET_ADMIN_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

export const GetMedicineDetails = (patientid) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_MEDICINE_REQUEST });
    const res = await axios.post(
      `http://localhost:3007/prescriptions/${patientid}`,
    );
    //axios.post
    console.log(res.data);
    const medicines = { medicines: res.data };
    dispatch({
      type: types.GET_MEDICINE_SUCCESS,
      payload: medicines,
    });
  } catch (error) {
    console.log(error);
  }
};

//CREATE BOOKING
export const CreateBooking = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_BOOKING_REQUEST });
    const res = await axios.post(
      `http://localhost:3007/appointments/create`,
      data,
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// GET ALL PATIENT
export const GetPatients = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_PATIENT_REQUEST });
    const res = await axios.get(`http://localhost:3007/patients`);
    console.log("pats", res);
    const patients = { patients: res.data };
    dispatch({
      type: types.GET_PATIENT_SUCCESS,
      payload: patients,
    });
  } catch (error) {
    dispatch({
      type: types.GET_PATIENT_ERROR,
      payload: {
        message: error,
      },
    });
  }
};

// GET ALL DATA
export const GetAllData = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ALLDATA_REQUEST });
    const res = await axios.get("http://localhost:3007/admin/dashboard", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    console.log("DASHBOARD DATA:", res.data);
    const res = await axios.get(`http://localhost:3007/hospitals`);
    console.log(res.data);
    dispatch({
      type: types.GET_ALLDATA_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
  }
};

// GET ALL APPOINTMENT DETAILS
export const GetAppointments = (userType, id) => async (dispatch) => {
  if (!userType || !id) return;
  try {
    dispatch({ type: types.GET_APPOINTMENT_DETAILS_REQUEST });
    const res = await axios.get(
      `http://localhost:3007/appointments/${userType}/${id}`,
    );
    console.log("res", res.data);
    // return res.data;
    const appointments = { appointments: res.data.data };
    dispatch({
      type: types.GET_APPOINTMENT_DETAILS_SUCCESS,
      payload: appointments,
    });
  } catch (error) {
    console.log(error);
  }
};

// DELETE APPOINTMENTS
export const DeleteAppointment = (id) => async (dispatch) => {
  try {
    dispatch({ type: types.DELETE_APPOINTMENT_REQUEST });
    const res = await axios.delete(
      `http://localhost:3007/appointments/${id}`,
    );
    console.log(res.data);
    // return res.data;
    dispatch({
      type: types.DELETE_APPOINTMENT_SUCCESS,
      payload: id,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetAllReports = (userType, id) => async (dispatch) => {
  if (!userType || !id) return;
  try {
    dispatch({ type: types.GET_REPORTS_REQUEST });
    const res = await axios.get(
      `http://localhost:3007/reports/${userType}/${id}`,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    console.log("res", res.data);
    const reports = { reports: res.data.data };
    dispatch({
      type: types.GET_REPORTS_SUCCESS,
      payload: reports,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const CreateCertificate = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CERTIFICATES_REQUEST });
    const res = await axios.post(
      "http://localhost:3007/certificates/create",
      data
    );
    console.log(res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetAllCertificates = (userType, id) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CERTIFICATES_REQUEST });
    const res = await axios.get(
      `http://localhost:3007/certificates/${userType}/${id}`
    );
    console.log("res", res.data);
    const certificates = { certificates: res.data.data };
    dispatch({
      type: types.GET_CERTIFICATES_SUCCESS,
      payload: certificates,
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// --- Laboratory Actions ---

export const getPendingRequests = (token) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_PENDING_REQUESTS_REQUEST });
    const res = await axios.get(`${baseURL}/lab/requests/pending`, {
      headers: { Authorization: token },
    });
    dispatch({
      type: types.GET_PENDING_REQUESTS_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: types.GET_PENDING_REQUESTS_ERROR });
  }
};

export const submitLabRecord = (data, token) => async (dispatch) => {
  try {
    dispatch({ type: types.SUBMIT_LAB_RECORD_REQUEST });
    const res = await axios.post(`${baseURL}/lab/record`, data, {
      headers: { Authorization: token },
    });
    dispatch({
      type: types.SUBMIT_LAB_RECORD_SUCCESS,
      payload: res.data,
    });
    return res.data;
  } catch (error) {
    dispatch({ type: types.SUBMIT_LAB_RECORD_ERROR });
  }
};

export const getLabHistory = (patientId) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_LAB_HISTORY_REQUEST });
    const res = await axios.get(`${baseURL}/lab/history/${patientId}`);
    dispatch({
      type: types.GET_LAB_HISTORY_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({ type: types.GET_LAB_HISTORY_ERROR });
  }
};

export const createLabRequest = (data, token) => async (dispatch) => {
  try {
    const res = await axios.post(`${baseURL}/lab/request`, data, {
      headers: { Authorization: token },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
