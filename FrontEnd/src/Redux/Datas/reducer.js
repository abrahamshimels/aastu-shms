import * as types from "./types";

const initialState = {
  loading: false,
  error: false,
  reports: { reports: [] },
  doctors: { doctors: [] },
  patients: { patients: [] },
  medicines: { medicines: [] },
  admins: { admins: [] },
  dashboard: [],
  appointments: { appointments: [] },
  labRequests: [],
  labHistory: [],
};

export default function dataReducer(state = initialState, { type, payload }) {
  switch (type) {
    case types.GET_PATIENT_REQUEST:
    case types.GET_DOCTOR_REQUEST:
    case types.GET_ADMIN_REQUEST:
    case types.GET_APPOINTMENT_DETAILS_REQUEST:
    case types.GET_REPORTS_REQUEST:
    case types.GET_ALLDATA_REQUEST:
    case types.GET_PENDING_REQUESTS_REQUEST:
    case types.GET_LAB_HISTORY_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.GET_PATIENT_SUCCESS:
      return {
        ...state,
        loading: false,
        patients: payload,
      };
    case types.GET_DOCTOR_SUCCESS:
      return {
        ...state,
        loading: false,
        doctors: payload,
      };

    case types.GET_ADMIN_SUCCESS:
      return {
        ...state,
        loading: false,
        admins: payload,
      };

    case types.GET_MEDICINE_SUCCESS:
      return {
        ...state,
        loading: false,
        medicines: payload,
      };

    case types.GET_ALLDATA_SUCCESS:
      return {
        ...state,
        loading: false,
        dashboard: payload,
      };
    case types.DELETE_APPOINTMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: state.appointments.filter((ele) => ele._id !== payload),
      };
    case types.GET_APPOINTMENT_DETAILS_SUCCESS:
      return {
        ...state,
        loading: false,
        appointments: payload,
      };
    case types.GET_REPORTS_SUCCESS:
      return {
        ...state,
        loading: false,
        reports: payload,
      };

    // Laboratory cases
    case types.GET_PENDING_REQUESTS_SUCCESS:
      return {
        ...state,
        loading: false,
        labRequests: payload,
      };
    case types.GET_LAB_HISTORY_SUCCESS:
      return {
        ...state,
        loading: false,
        labHistory: payload,
      };

    case types.GET_PATIENT_ERROR:
    case types.GET_DOCTOR_ERROR:
    case types.GET_ADMIN_ERROR:
    case types.GET_APPOINTMENT_DETAILS_ERROR:
    case types.GET_REPORTS_ERROR:
    case types.GET_MEDICINE_ERROR:
    case types.GET_PENDING_REQUESTS_ERROR:
    case types.GET_LAB_HISTORY_ERROR:
    case types.SUBMIT_LAB_RECORD_ERROR:
      return {
        ...state,
        loading: false,
        error: true,
      };

    default:
      return state;
  }
}
