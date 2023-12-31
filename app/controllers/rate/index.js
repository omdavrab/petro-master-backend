const Rate = require("../../models/rate");
const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../../../errors");

const createRate = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    req.body.userId = req.user.id;
    await Rate.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Rate created successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const updateRate = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    let tank = await Rate.findById(req.params.id);
    if (!tank) {
      return next(new CustomAPIError("Rate not found", 404));
    }
    req.body.userId = req.user.id;
    tank = await Rate.findByIdAndUpdate(req.params.id, req.body, {
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

const deleteRate = async (req, res, next) => {
  try {
    const tank = await Rate.findById(req.params.id);
    if (!tank) {
      return next(
        new CustomAPIError(`Rate dose not exist with Id:${req.params.id}`)
      );
    }
    await Rate.findByIdAndDelete({ _id: tank._id });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Rate Deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const getAllRate = async (req, res, next) => {
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
    const result = await Rate.find(query).sort("-_id");

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
  createRate,
  updateRate,
  deleteRate,
  getAllRate,
};
