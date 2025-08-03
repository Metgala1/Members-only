const {Pool} = require("pg");
const path = require("path")
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env"),
});
module.exports = new Pool({
    connectionString: process.env.DATABASE_PUBLIC_URL
})