const dbhelper = require("../configs/dbhelper");
const {
    createLabTestRequestTable,
    createLabRecordTable,
    addRequestQuery,
    getPendingRequestsQuery,
    getRequestByIdQuery,
    updateRequestStatusQuery,
    addLabRecordQuery,
    getRecordsByPatientQuery,
    getRecordByIdQuery,
    lockRecordQuery,
    reviewRecordQuery
} = require("../configs/queries/lab");

const createTables = async () => {
    await dbhelper.query(createLabTestRequestTable);
    await dbhelper.query(createLabRecordTable);
    console.log("Lab tables initialized");
};

const createRequest = (patientId, doctorId, testType, priority, notes) => {
    return dbhelper.query(addRequestQuery, [patientId, doctorId, testType, priority, notes]);
};

const getPendingRequests = () => {
    return dbhelper.query(getPendingRequestsQuery);
};

const getRequestById = (id) => {
    return dbhelper.query(getRequestByIdQuery, [id]);
};

const updateRequestStatus = (status, id) => {
    return dbhelper.query(updateRequestStatusQuery, [status, id]);
};

const submitLabRecord = async (requestId, technologistId, resultValue, criticalFlag) => {
    // First, verify if the request is still pending
    const request = await dbhelper.query(getRequestByIdQuery, [requestId]);
    if (!request || request.length === 0 || request[0].status !== 'Pending') {
        throw new Error("Invalid or already processed request");
    }

    // Add record
    const result = await dbhelper.query(addLabRecordQuery, [requestId, technologistId, resultValue, criticalFlag]);

    // Update request status to Completed
    await dbhelper.query(updateRequestStatusQuery, ['Completed', requestId]);

    return result;
};

const getPatientLabHistory = (patientId) => {
    return dbhelper.query(getRecordsByPatientQuery, [patientId]);
};

const getRecordById = (id) => {
    return dbhelper.query(getRecordByIdQuery, [id]);
};

const reviewRecord = (id) => {
    return dbhelper.query(reviewRecordQuery, [id]);
};

module.exports = {
    createTables,
    createRequest,
    getPendingRequests,
    getRequestById,
    updateRequestStatus,
    submitLabRecord,
    getPatientLabHistory,
    getRecordById,
    reviewRecord
};
