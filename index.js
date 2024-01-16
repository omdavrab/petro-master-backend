const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

const { mongoose } = require("mongoose");
const connectDB = require("./config/db");
const PORT = process.env.PORT || 8080;
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const errorMiddleware = require("./middleware/errorHandler");
require("express-async-errors");

// Import Router
const authRoute = require("./app/routes/auth");
const employee = require("./app/routes/employee");
const tank = require("./app/routes/tank");
const machine = require("./app/routes/machine");
const rate = require("./app/routes/rate");
const shift = require("./app/routes/shift");
const bank = require("./app/routes/bank");
const report = require("./app/routes/dailyReport");

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static("public"));
app.use("/image", express.static("Images"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to our Restaurant.");
});
// Router
app.use("/", authRoute);
app.use("/employee", employee);
app.use("/tank", tank);
app.use("/machine", machine);
app.use("/rate", rate);
app.use("/shift", shift);
app.use("/bank", bank);
app.use("/report", report)

app.use(errorMiddleware);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connectDB();
    server.listen(PORT, console.log(`Server is listening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
