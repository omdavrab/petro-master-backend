const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
  machineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machine",
    required: true,
  },
  nozzleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machine",
    required: true,
  },
  nozzle:{
    type: String,
    required: true,
  },
  opening: {
    type: Number,
    required: true,
  },
  closing: {
    type: Number,
    required: true,
  },
  testing: {
    type: Number,
  },
  totalSale: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
const CreditSale = new mongoose.Schema({
  partyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Machine",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  vname: {
    type: String,
    required: true,
  },
  vnumber: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  chno: {
    type: String,
    required: true,
  },
});
const ProductSale = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});
const AttendanceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide user ID,"],
  },
  shiftId: {
    type: mongoose.Types.ObjectId,
    ref: "Shift",
    required: [true, "Please provide Shift,"],
  },
  shiftName: {
    type: String,
    required: [true, "Please provide Shift Name,"],
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: [true, "Please provide Employee,"],
  },
  date: { type: Date },
  machine: [MachineSchema],
  productSale: [ProductSale],
  creditSale: [CreditSale],
  totalCollection: {
    type: Number,
    require: true,
  },
  totalcash: {
    type: Number,
    require: true,
  },
  totalCreditSale: {
    type: Number,
    require: true,
  },
  totalOnlinePayment: {
    type: Number,
    require: true,
  },
  totalProductSale: {
    type: Number,
    require: true,
  },
  totalDifferent: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DailyReport = mongoose.model("DailyReport", AttendanceSchema);

module.exports = DailyReport;
