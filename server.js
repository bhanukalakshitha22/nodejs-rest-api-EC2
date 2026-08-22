const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db/db");
const errorHandler = require("./middlewares/errorhandler");
const userRoutes = require("./routes/userRoutes");
const logger = require("./config/logger");

const dns = require('dns');
dns.setServers(['8.8.8.8']);

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

//connect to the database
connectDB();

//routes
app.use("/api/user", userRoutes);

app.use("/api/products", (req, res) => {
  return res.status(200).json({
    message: "This is new feature change, a new route for products samin",
  });
});

//error handler
app.use(errorHandler);

//listen to the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  logger.info(`Server is running on port: ${port}`);
});
