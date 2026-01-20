const dbhelper = require('../configs/dbhelper');
const { createNursesTable, addNurseQuery, updateNurseQuery, findNurseByEmailQuery, getAllNursesQuery } = require('../configs/queries/nurses');

const NursesModel = {
  init: async () => {
    try {
      await dbhelper.query(createNursesTable);
      console.log('Nurses table initialized');
    } catch (err) {
      console.error('Error initializing Nurses table:', err.message);
    }
  },

  addNurse: async (nurse) => {
    const values = [
      nurse.name,
      nurse.phonenum,
      nurse.email,
      nurse.password || 'Nurse@123',
      nurse.age,
      nurse.gender,
      nurse.address,
      nurse.qualification
    ];
    const result = await dbhelper.query(addNurseQuery, values);
    return result[0];
  },

  updateNurse: async (email, nurse) => {
    const values = [
      email,
      nurse.name,
      nurse.phonenum,
      nurse.age,
      nurse.gender,
      nurse.address,
      nurse.qualification
    ];
    const result = await dbhelper.query(updateNurseQuery, values);
    return result[0];
  },

  findByEmail: async (email) => {
    const result = await dbhelper.query(findNurseByEmailQuery, [email]);
    return result[0];
  },

  getAll: async () => {
    return await dbhelper.query(getAllNursesQuery);
  }
};

module.exports = NursesModel;
