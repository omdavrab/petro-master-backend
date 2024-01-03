const Rate = require("../../models/rate");
const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../../../errors");
const Bank = require("../../models/bank");

const createBank = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    req.body.userId = req.user.id;
    await Bank.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Bank created successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const updateBank = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    let tank = await Bank.findById(req.params.id);
    if (!tank) {
      return next(new CustomAPIError("Bank not found", 404));
    }
    req.body.userId = req.user.id;
    tank = await Bank.findByIdAndUpdate(req.params.id, req.body, {
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

const deleteBank = async (req, res, next) => {
  try {
    const tank = await Bank.findById(req.params.id);
    if (!tank) {
      return next(
        new CustomAPIError(`Bank dose not exist with Id:${req.params.id}`)
      );
    }
    await Bank.findByIdAndDelete({ _id: tank._id });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Bank Deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const getAllBank = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page ? req.query.page : 1);
    const pageLimit = parseInt(req.query.pageLimit ? req.query.pageLimit : 10);
    // const limit = 10;
    const startIndex = (page - 1) * pageLimit;
    const endIndex = page * pageLimit;

    if (!req.user) {
      return next(
        new CustomAPIError(`User does not exist with Id: ${req.user.id}`)
      );
    }
    const query = {
      userId: req.user.id,
    };
    const result = await Bank.find(query).sort("-_id");

    res.status(StatusCodes.OK).send({
      data: result.slice(startIndex, endIndex),
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
  createBank,
  updateBank,
  deleteBank,
  getAllBank,
};
