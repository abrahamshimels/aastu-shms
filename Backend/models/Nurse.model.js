const dbhelper = require("../configs/dbhelper");
const {
  createCredTable,
  findCredQuery,
  addQuery,
  findIfExistsQuery,
  getCredsWithEmailQuery,
  getAllQuery,
  countNurseQuery,
  updatePassQuery,
} = require("../configs/queries/nurse");

const createTables = () => {
  return dbhelper.query(createCredTable, []).then((result) => {
    return result;
  });
};

const findCred = (id) => {
  return dbhelper.query(findCredQuery, [id]).then((result) => {
    return result;
  });
};

const addNurse = (nurse) => {
  const array = [
    nurse.name,
    nurse.phoneNum,
    nurse.email,
    nurse.age,
    nurse.gender,
    nurse.address,
    nurse.qualification
  ];
  return dbhelper.query(addQuery, array).then((result) => {
    return result;
  });
};

const findIfExists = (email) => {
  return dbhelper.query(findIfExistsQuery, [email]).then((result) => {
    return result;
  });
}

const getNurseCredsFromEmail = (email) => {
  return dbhelper.query(getCredsWithEmailQuery, [email]).then((result) => {
    return result;
  });
};

const getAllNurses = () => {
  return dbhelper.query(getAllQuery).then((result) => {
    return result;
  });
}

const updatePass = (password, id) => {
  return dbhelper.query(updatePassQuery, [password, id]).then((result) => {
    return result;
  });
}

module.exports = {
  createTables,
  findCred,
  addNurse,
  findIfExists,
  getNurseCredsFromEmail,
  getAllNurses,
  updatePass
};
