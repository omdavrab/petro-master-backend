const Tank = require("../../models/tank");
const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../../../errors");

const createTank = async (req, res, next) => {
  try {
      console.log("🚀 ~ file: index.js:8 ~ createTank ~ req.user:", req.user)
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    req.body.userId = req.user.id;
    await Tank.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Tank created successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const updateTank = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    let tank = await Tank.findById(req.params.id);
    if (!tank) {
      return next(new CustomAPIError("Tank not found", 404));
    }
    req.body.ro_id = req.user.id;
    tank = await Tank.findByIdAndUpdate(req.params.id, req.body, {
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

const deleteTank = async (req, res, next) => {
  try {
    const tank = await Tank.findById(req.params.id);
    if (!tank) {
      return next(
        new CustomAPIError(`Tank dose not exist with Id:${req.params.id}`)
      );
    }
    await Tank.findByIdAndDelete({ _id: tank._id });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Tank Deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const getAllTank = async (req, res, next) => {
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
    const result = await Tank.find(query).sort("-_id");

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
  createTank,
  updateTank,
  deleteTank,
  getAllTank,
};
