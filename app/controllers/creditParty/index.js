const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../../../errors");
const CreditParty = require("../../models/creditParty");

const createCreditParty = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    req.body.userId = req.user.id;
    await CreditParty.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Created successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const updateCreditParty = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    let tank = await CreditParty.findById(req.params.id);
    if (!tank) {
      return next(new CustomAPIError("CreditParty not found", 404));
    }
    req.body.userId = req.user.id;
    tank = await CreditParty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      data: tank,
      message: "CreditParty Update successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const deleteCreditParty = async (req, res, next) => {
  try {
    const tank = await CreditParty.findById(req.params.id);
    if (!tank) {
      return next(
        new CustomAPIError(`CreditParty dose not exist with Id:${req.params.id}`)
      );
    }
    await CreditParty.findByIdAndDelete({ _id: tank._id });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "CreditParty Deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const getAllCreditParty = async (req, res, next) => {
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
    const result = await CreditParty.find(query).sort("-_id");

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
  createCreditParty,
  updateCreditParty,
  deleteCreditParty,
  getAllCreditParty,
};
