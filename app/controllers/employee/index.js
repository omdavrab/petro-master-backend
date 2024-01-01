const { CustomAPIError } = require("../../../errors");
const Employee = require("../../models/employee");
const { StatusCodes } = require("http-status-codes");
const fs = require("fs/promises");

const createEmployee = async (req, res, next) => {
  try {
    if (!req.files.front && !req.files.back) {
      return next(new CustomAPIError("No file provided"));
    }
    if (!req.user) {
      return next(
        new CustomAPIError(`RO does not exist with Id: ${req.user.id}`)
      );
    }
    req.body.image = {
      front: req.files.front[0].filename,
      back: req.files.back[0].filename,
    };
    req.body.userId = req.user.id;
    const employee = await Employee.create(req.body);
    res.status(StatusCodes.CREATED).json({
      status: StatusCodes.CREATED,
      success: true,
      message: "Employee created successfully",
      employee,
    });
  } catch (error) {
    return next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO does not exist with Id: ${req.user.id}`)
      );
    }
    let existingEmployee = await Employee.findById(req.params.id);
    if (!existingEmployee) {
      return next(new CustomAPIError("Employee not found", 404));
    }
    if (req.files.front || req.files.back) {
      if (existingEmployee.image.front && existingEmployee.image.back) {
        console.log(
          "Deleting existing file:",
          existingEmployee.image.back,
          existingEmployee.image.front
        );
        await fs.unlink(existingEmployee.image.front);
        await fs.unlink(existingEmployee.image.back);
      } else {
        console.log("No existing file to delete");
      }
      console.log("New file uploaded:", req.file);
      req.body.image = {
        front: req.files.front[0].filename,
        back: req.files.back[0].filename,
      };
    }
    req.body.userId = req.user.id;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEmployee) {
      return next(
        new CustomAPIError(`Employee with ID ${req.params.id} not found`)
      );
    }
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    return next(new CustomAPIError("Error updating employee"));
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(
        new CustomAPIError(`RO does not exist with Id: ${req.user.userId}`)
      );
    }
    const existingEmployee = await Employee.findById(req.params.id);
    if (!existingEmployee) {
      return next(new CustomAPIError("Employee not found", 404));
    }
    if (existingEmployee.image && existingEmployee.image.public_id) {
      console.log("Deleting local file:", existingEmployee.image.public_id);
      await fs.unlink(existingEmployee.image.public_id);
    } else {
      console.log("No local file to delete");
    }
    await existingEmployee.deleteOne();
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Employee deleted successfully",
      employee: existingEmployee,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return next(new CustomAPIError("Error deleting employee"));
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return next(new CustomAPIError("Employee not found", 404));
    }

    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "Employee details retrieved successfully",
      employee,
    });
  } catch (error) {
    return next(new CustomAPIError("Error retrieving employee details"));
  }
};

const getAllEmployeesByUserId = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page ? req.query.page : 1);
    const pageLimit = parseInt(req.query.pageLimit ? req.query.pageLimit : 10);
    // const limit = 10;
    const startIndex = (page - 1) * pageLimit;
    const endIndex = page * pageLimit;

    if (!req.user) {
      return next(
        new CustomAPIError(`User does not exist with Id: ${req.user.userId}`)
      );
    }
    const query = {
      userId: req.user.id,
    };
    const result = await Employee.find(query).sort("-_id");

    res.status(StatusCodes.OK).send({
        data: result.slice(startIndex, endIndex),
        current: page,
        total: Math.ceil(result.length / pageLimit),
        results: result.length,
        startIndex: startIndex,
        endIndex: endIndex,
      });
      
  } catch (error) {
    return next(new CustomAPIError("Error retrieving employees for the user"));
  }
};

module.exports = {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
  getAllEmployeesByUserId,
};
