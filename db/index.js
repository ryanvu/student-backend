const dbConfig = require("./dbConfig");
const postgres = require("postgres");

const sql = postgres(dbConfig);

module.exports = sql;
