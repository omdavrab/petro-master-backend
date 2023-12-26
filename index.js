const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

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
const menuRoute = require("./app/routes/menu");
const authRoute = require("./app/routes/auth");
const orderRoute = require("./app/routes/order");
const restaurantRoute = require("./app/routes/restaurant");
const foodCategoryRoute = require("./app/routes/foodCategory");
const QRCode = require("./app/routes/qrCode");
const Banner = require("./app/routes/banner");
const Tax = require("./app/routes/tax");


const configureSocket = require("./config/socket");

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
app.use("/menu", menuRoute);
app.use("/", authRoute);
app.use("/restaurant", restaurantRoute);
app.use("/food", foodCategoryRoute);
app.use("/qr", QRCode);
app.use("/order", orderRoute);
app.use('/banner', Banner)
app.use('/tax', Tax)

app.use(errorMiddleware)
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    mongoose.set("strictQuery", false);
    await connectDB();
    configureSocket(server);
    server.listen(PORT, console.log(`Server is listening on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
