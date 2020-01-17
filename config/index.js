const config = require("./config");
module.exports = {
  dbName: config.dbName,
  mongoDbConnectionString: "mongodb://localhost:27017/" +config.dbName
};
