const { CustomAPIError } = require("../../../errors");
const DailyReport = require("../../models/dailyReport");
const { StatusCodes } = require("http-status-codes");

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

    const resultArray = await DailyReport.find({
      userId: req.user.id,
      "machine.machineId": { $in: machineIds },
    })
      .sort({ createdAt: -1 })
      .limit(1)
      .lean();

    const result = resultArray[0]; // Extract the first element from the array

    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Collection created successfully",
      result,
    });
  } catch (error) {
    return next(error);
  }
};


module.exports = {
  createCollection,
  GetCollection,
};
