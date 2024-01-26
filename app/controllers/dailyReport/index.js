const { CustomAPIError } = require("../../../errors");
const DailyReport = require("../../models/dailyReport");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");
const Machine = require("../../models/machine");

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
      message: "Collection created successfully",
      data: resultArray,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createCollection,
  GetCollection,
};
