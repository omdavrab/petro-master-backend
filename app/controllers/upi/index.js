const Rate = require("../../models/rate");
const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../../../errors");
const UPI = require("../../models/upi");

const createUpi = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    req.body.userId = req.user.id;
    await UPI.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "UPI created successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const updateUpi = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    let tank = await UPI.findById(req.params.id);
    if (!tank) {
      return next(new CustomAPIError("UPI not found", 404));
    }
    req.body.userId = req.user.id;
    tank = await UPI.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      data: tank,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteUpi = async (req, res, next) => {
  try {
    const tank = await UPI.findById(req.params.id);
    if (!tank) {
      return next(
        new CustomAPIError(`UPI dose not exist with Id:${req.params.id}`)
      );
    }
    await UPI.findByIdAndDelete({ _id: tank._id });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "UPI Deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const getAllUpi = async (req, res, next) => {
  try {
    let page = req.query.page;
    let startIndex = 0;
    let endIndex = 1;
    let pageLimit = 8;
    if (page !== "all") {
      page = parseInt(req.query.page ? req.query.page : 1);
      pageLimit = parseInt(req.query.pageLimit ? req.query.pageLimit : 10);
      startIndex = (page - 1) * pageLimit;
      endIndex = page * pageLimit;
    }
    if (!req.user) {
      return next(
        new CustomAPIError(`User does not exist with Id: ${req.user.id}`)
      );
    }
    const query = {
      userId: req.user.id,
    };
    const result = await UPI.find(query).sort("-_id");

    res.status(StatusCodes.OK).send({
      data: page === "all" ? result : result.slice(startIndex, endIndex),
      current: page,
      total: Math.ceil(result.length / pageLimit),
      results: result.length,
      startIndex: startIndex,
      endIndex: endIndex,
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  createUpi,
  updateUpi,
  deleteUpi,
  getAllUpi,
};
