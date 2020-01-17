var express = require("express");
var productsRouts = require("./routes/productsRouts");
var bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require("./config/index");
const ordersRoute=require('./routes/ordersRoutes');
const userRoutes=require('./routes/userRouts');
const dotenv= require('dotenv');

const envConfig=dotenv.config();
var app = express();
const port = process.env.PORT || 3000;

mongoose.connect(
  config.mongoDbConnectionString,
  { useUnifiedTopology: true, useNewUrlParser: true },
  err => {
    if (err) throw err;
    console.log("connected to database : " + config.dbName);
  }
);

app.use(bodyParser.json());
app.use(morgan("dev"));
app.use("/api/users",userRoutes);
app.use("/api/orders",ordersRoute);
app.use("/api/products", productsRouts);
// app.use("/", function(req, res, next) {
//     console.log(
//       "Request URL: " + req.url + " , with http " + req.method + " " + new Date()
//     );
//     next();
//   });
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  console.log(error);
  res.status(error.status || 500).json({
    error: {
      message: error.message,
      path: req.originalUrl,
      method: req.method
    }
  });
});
app.listen(port, () => console.log("Server started on port " + port));
