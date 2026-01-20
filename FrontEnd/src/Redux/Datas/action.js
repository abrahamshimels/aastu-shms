import * as types from "./types";
import axios from "axios";

const baseURL = "http://localhost:3007";

// CreateReport
export const CreateReport = (data) => async (dispatch) => {
  try {
    dispatch({ type: types.CREATE_REPORT_REQUEST });
    const res = await axios.post(`${baseURL}/reports/create`, data);
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
    const res = await axios.get(`${baseURL}/doctors`);
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
    const res = await axios.get(`${baseURL}/admin`);
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
    const res = await axios.post(`${baseURL}/prescriptions/${patientid}`);
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
    const res = await axios.post(`${baseURL}/appointments/create`, data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// GET ALL PATIENT
export const GetPatients = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_PATIENT_REQUEST });
    const res = await axios.get(`${baseURL}/patients`);
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
    const res = await axios.get(`${baseURL}/hospitals`);
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
    const res = await axios.get(`${baseURL}/appointments/${userType}/${id}`);
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
    const res = await axios.delete(`${baseURL}/appointments/${id}`);
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
    const res = await axios.get(`${baseURL}/reports/${userType}/${id}`);
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
