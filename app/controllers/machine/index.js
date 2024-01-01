const { CustomAPIError } = require("../../../errors");
const Machine = require("../../models/machine");
const { StatusCodes } = require("http-status-codes");
const { ObjectId } = require("mongodb");

const createMachine = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    req.body.userId = req.user.id;
    await Machine.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Machine created successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const updateMachine = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO dose not exist with Id:${req.user.id}`)
      );
    }
    let machine = await Machine.findById(req.params.id);
    if (!machine) {
      return next(new CustomAPIError("Machine not found", 404));
    }
    req.body.ro_id = req.user.id;
    machine = await Machine.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      data: machine,
    });
  } catch (err) {
    return next(err);
  }
};

const deleteMachine = async (req, res, next) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return next(
        new CustomAPIError(`Machine dose not exist with Id:${req.params.id}`)
      );
    }
    await Machine.findByIdAndDelete({ _id: machine._id });
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Machine Deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
};

const getAllMachine = async (req, res, next) => {
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
    const result = await Machine.find(query).sort("-_id");

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

const deleteNozzle = async (req, res, next) => {
  const nozzleIdToDelete = req.body.nozzle;
  const machine = await Machine.findById(req.params.id);
  const findNozzle = machine.nozzles.find((val) => val._id == nozzleIdToDelete);
  if (!machine) {
    return next(
      new CustomAPIError(`Machine dose not exist with Id:${req.params.id}`)
    );
  }
  if (!findNozzle) {
    return next(
      new CustomAPIError(`Nozzle dose not exist with Id:${nozzleIdToDelete}`)
    );
  }
  machine.nozzles = machine.nozzles.filter(
    (nozzle) => nozzle._id.toString() !== nozzleIdToDelete
  );
  await machine.save();
  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    success: true,
    message: "Nozzle Deleted successfully",
  });
};

const createNozzle = async (req, res, next) => {
  const { tank_id, nozzle_name } = req.body;
  const machine = await Machine.findById(req.params.id);
  if (!machine) {
    return next(
      new CustomAPIError(`Machine does not exist with Id: ${req.params.id}`)
    );
  }
  if (!tank_id || !nozzle_name) {
    return next(
      new CustomAPIError(`Tank id and nozzle name both fields are requires`)
    );
  }
  if (machine.type === "DU" && machine.nozzles.length >= 2) {
    return next(
      new CustomAPIError(`In this machine you can't add more than 2 nozzles`)
    );
  }
  if (machine.type === "MDU" && machine.nozzles.length >= 4) {
    return next(
      new CustomAPIError(`In this machine you can't add more than 4 nozzles`)
    );
  }
  const newNozzle = {
    tank_id: tank_id,
    nozzle_name: nozzle_name,
    _id: new ObjectId(),
  };
  machine.nozzles.push(newNozzle);
  await machine.save();
  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    success: true,
    message: "Nozzle created successfully",
    nozzle: newNozzle,
  });
};

module.exports = {
  createMachine,
  updateMachine,
  deleteMachine,
  getAllMachine,
  deleteNozzle,
  createNozzle,
};
