const dbhelper = require("../configs/dbhelper");
const {
    createCredTable,
    findCredQuery,
    addQuery,
    findIfExistsQuery,
    getCredsWithEmailQuery,
    countLabTechQuery,
    updatePassQuery,
    getAllQuery,
} = require("../configs/queries/labTechnologist");

const getAllLabTechs = () => {
    return dbhelper.query(getAllQuery).then((result) => {
        return result;
    });
};

const createTables = () => {
    return dbhelper.query(createCredTable, []).then((result) => {
        console.log(result, "in db helper: Lab Tech Table Created");
        return result;
    });
};

const findCred = (ID) => {
    console.log("id received:", ID);
    return dbhelper.query(findCredQuery, [ID]).then((result) => {
        return result;
    });
};

const updatePass = (password, id) => {
    return dbhelper.query(updatePassQuery, [password, id]).then((result) => {
        return result;
    });
};

const getLabTechCredsFromEmail = (email) => {
    console.log("email received:", email);
    return dbhelper.query(getCredsWithEmailQuery, [email]).then((result) => {
        return result;
    });
};

const countLabTech = () => {
    return dbhelper.query(countLabTechQuery, []).then((result) => {
        return result[0];
    });
};

const findIfExists = (email) => {
    console.log("email received to db:", email);
    return dbhelper.query(findIfExistsQuery, [email]).then((result) => {
        return result;
    });
};

const addLabTech = (labTech) => {
    console.log("lab tech received:", labTech);
    const array = Object.values(labTech);
    return dbhelper.query(addQuery, array).then((result) => {
        console.log("lab tech added successfully");
        return result;
    });
};

module.exports = {
    findIfExists,
    createTables,
    findCred,
    addLabTech,
    getLabTechCredsFromEmail,
    countLabTech,
    updatePass,
    getAllLabTechs,
};
