const { CustomAPIError } = require("../../../errors");
const DailyReport = require("../../models/dailyReport");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");
const Machine = require("../../models/machine");
const { default: mongoose } = require("mongoose");

const createCollection = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO does not exist with Id: ${req.user.id}`)
      );
    }
    req.body.userId = req.user.id;
    const employee = await DailyReport.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Report created successfully",
      employee,
    });
  } catch (error) {
    return next(error);
  }
};

const GetCollection = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO does not exist with Id: ${req.user.id}`)
      );
    }
    const machineIds = req.body.id;
    // Initialize an array to store the results
    const resultArray = [];
    // Iterate through each machine ID
    for (const machineId of machineIds) {
      const result = await DailyReport.findOne({
        userId: req.user.id,
        "machine.machineId": machineId,
      })
        .sort({ createdAt: -1 })
        .lean();

      // If a result is found, add it to the resultArray
      if (result) {
        resultArray.push(result);
      }
    }
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Successfully",
      data: resultArray,
    });
  } catch (error) {
    return next(error);
  }
};

const GetReport = async (req, res, next) => {
  try {
    let date = req.query.date;
    if (!req.user) {
      return next(
        new CustomAPIError(`RO does not exist with Id: ${req.user.id}`)
      );
    }
    const result = await DailyReport.find({
      userId: req.user.id,
      date: date,
    }).populate({
      path: "employeeId",
      select: "name",
    });

    const transformedData = result.reduce((acc, entry) => {
      const shiftName = entry.shiftName;
      if (!acc[shiftName]) {
        acc[shiftName] = [];
      }

      const transformedMachine = entry.machine.reduce(
        (machineObj, machineEntry, index) => {
          
          const nozzleKey = `nozzle${index + 1}`;
          machineObj.totalAmount =
            (machineObj.totalAmount || 0) + machineEntry.amount;
          machineObj[nozzleKey] = {
            machineId: machineEntry.machineId,
            nozzle: machineEntry.nozzle,
            nozzleId: machineEntry.nozzleId,
            opening: machineEntry.opening,
            closing: machineEntry.closing,
            testing: machineEntry.testing || 0,
            totalSale: machineEntry.totalSale,
            rate: machineEntry.rate,
            amount: machineEntry.amount,
          };

          return machineObj;
        },
        {}
      );

      const entryWithTransformedMachine = {
        userId: entry.userId,
        shiftId: entry.shiftId,
        shiftName: entry.shiftName,
        employee: entry.employeeId,
        date: entry.date,
        totalCollection: entry.totalCollection,
        totalcash: entry.totalcash,
        totalCreditSale: entry.totalCreditSale,
        totalOnlinePayment: entry.totalOnlinePayment,
        totalProductSale: entry.totalProductSale,
        totalDifferent: entry.totalDifferent,
        ...transformedMachine,
      };

      acc[shiftName].push(entryWithTransformedMachine);
      return acc;
    }, {});

    res.status(StatusCodes.CREATED).json(transformedData);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createCollection,
  GetCollection,
  GetReport,
};
