const config = {
  user: process.env.PG_USER, // PostgreSQL username
  host: process.env.PG_HOST || "localhost", // PostgreSQL host
  database: process.env.PG_DATABASE, // PostgreSQL database name
  password: process.env.PG_PASSWORD, // PostgreSQL password
  port: process.env.PG_PORT || 5432, // PostgreSQL port
  ssl: {
    rejectUnauthorized: false,
  },
};

if (process.env.PG_SSL === "true") {
  config.ssl = {
    rejectUnauthorized: false, // required for Neon or other cloud DBs
  };
}

module.exports = config;
