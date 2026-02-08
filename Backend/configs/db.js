require("dotenv").config();
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const { Pool } = require("pg");
const config = require("./config");

module.exports = new Pool(config);
