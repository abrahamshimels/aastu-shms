const db = require("./db.js");

exports.query = function (sql, values) {
  // Ensure all values are strings if they are numbers to prevent VARCHAR vs INT mismatches
  const safeValues = values ? values.map(v => (typeof v === 'number' ? String(v) : v)) : values;

  return new Promise((resolve, reject) => {
    db.query(sql, safeValues, function (err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(result.rows);
      }
    });
  });
};
