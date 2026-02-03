const config = {
  user: process.env.PG_USER, // PostgreSQL username
  host: process.env.RESOLVED_PG_HOST || process.env.PG_HOST || "localhost", // Use resolved IP if available
  database: process.env.PG_DATABASE, // PostgreSQL database name
  password: process.env.PG_PASSWORD, // PostgreSQL password
  port: process.env.PG_PORT || 8000, // PostgreSQL port
  ssl: process.env.PG_SSL === "true" ? {
    rejectUnauthorized: false,
    servername: process.env.PG_HOST // Ensure SNI matches the original hostname
  } : false,
};

module.exports = config;
