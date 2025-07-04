require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;
const appError = require("./utils/appError");
const requestStatus = require("./utils/requestStatus");

app.use(express.json());
app.use(cors());

// Connect to mongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("Successfuly connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};
connectDB();

// Handle wrong routes
app.use(/.*/, (req, res, next) => {
  return next(appError.create(404, requestStatus.FAIL, "Route not found"));
});

// Global error handler
app.use((err, req, res, next) => {
  return res.status(err.codeStatus || 500).json({
    status: err.errorStatus || requestStatus.ERROR,
    code: err.codeStatus || 500,
    message: err.message || "An unexpected error occurred",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
