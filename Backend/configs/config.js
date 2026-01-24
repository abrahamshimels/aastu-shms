const config = {
  user: process.env.PG_USER, // PostgreSQL username
  host: process.env.PG_HOST || "localhost", // PostgreSQL host
  database: process.env.PG_DATABASE, // PostgreSQL database name
  password: process.env.PG_PASSWORD, // PostgreSQL password
  port: process.env.PG_PORT || 8000, // PostgreSQL port
  ssl: process.env.PG_SSL === "true" ? { rejectUnauthorized: false } : false,
};

module.exports = config;
