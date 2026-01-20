module.exports = {
  user: process.env.PG_USER, // PostgreSQL username
  host: process.env.PG_HOST || "localhost", // PostgreSQL host
  database: process.env.PG_DATABASE, // PostgreSQL database name
  password: process.env.PG_PASSWORD, // PostgreSQL password
  port: process.env.PG_PORT || 5432, // PostgreSQL port
  ssl: process.env.PG_HOST === "localhost" || !process.env.PG_HOST ? false : {
    rejectUnauthorized: false, // required for Neon or other cloud DBs
  },
};
