const Menu = require("../../models/menu");
const Restaurant = require("../../models/restaurant");

// create menu api
const createMenu = async (req, res) => {
  try {
    const {
      name,
      price,
      vegetarian,
      category,
      description,
      customizeable,
      customizeItem,
      categoryId,
    } = req.body;
    if (!req.file) {
      return res.status(400).send({ message: "No file was uploaded!" });
    }
    const restaurant = await Restaurant.findOne({ userId: req.user.id });
    if (!restaurant) {
      return res
        .status(404)
        .send({ message: "You need to register your restaurant." });
    }
    const data = {
      name,
      price,
      vegetarian,
      category,
      description,
      customizeable,
      customizeItem: JSON.parse(customizeItem),
      image: req.file.filename,
      userId: req.user.id,
      restaurantId: req.user.restaurantID,
      categoryId,
    };
    console.log("🚀 ~ file: index.js:28 ~ createMenu ~ data:", data);

    const menuCreate = await new Menu(data);
    menuCreate
      .save()
      .then((result) => {
        return res
          .status(200)
          .send({ result, message: "Menu created successfully!" });
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// get all menus
const getMenus = async (req, res) => {
  try {
    const page = parseInt(req.query.page ? req.query.page : 1);
    const pageLimit = parseInt(req.query.pageLimit ? req.query.pageLimit : 10);
    // const limit = 10;
    const startIndex = (page - 1) * pageLimit;
    const endIndex = page * pageLimit;

    const query = {
      $and: [{ userId: req.user.id }, { restaurantId: req.user.restaurantID }],
    };
    Menu.find(query)
      .populate("userId", "-password")
      .populate("restaurantId", "-userId")
      .then((result) => {
        // res.status(200).send({ result });
        res.status(200).send({
          data: result.slice(startIndex, endIndex),
          current: page,
          total: Math.ceil(result.length / pageLimit),
          results: result.length,
          startIndex: startIndex,
          endIndex: endIndex,
        });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    res.status(400).send({ messsage: err });
  }
};

// get menu by id
const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).send({ message: "Id not found" });
    } else {
      Menu.findById(id)
        .then((result) => {
          return res.status(200).send({ result });
        })
        .catch((err) => {
          return res.status(400).send({ message: err.message });
        });
    }
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

// edit menu api
const editMenu = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.file) {
      return res.status(400).send({ message: "No file was uploaded!" });
    }
    const {
      name,
      price,
      vegetarian,
      category,
      description,
      customizeable,
      customizeItem,
    } = req.body;
    const data = {
      name,
      price,
      vegetarian,
      category,
      description,
      customizeable,
      customizeItem,
      image: req.file.filename,
    };
    console.log("🚀 ~ file: index.js:124 ~ editMenu ~ data:", data, id);
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).send({ message: "Menu not found" });
    }
    await Menu.findByIdAndUpdate(id, data, {
      new: true,
    })
      .then((result) => {
        res.status(200).send({ result, message: "Menu edited successfully!" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

// delete menu api
const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ message: "Id is required" });
    }
    const menu = await Menu.findById(id);
    if (!menu) {
      return res.status(404).send({ message: "Id not found" });
    }
    await Menu.findByIdAndDelete({ _id: id })
      .then((result) => {
        return res.status(200).send({ message: "Menu deleted successfully" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};

module.exports = {
  createMenu,
  deleteMenu,
  editMenu,
  getMenus,
  getMenuById,
};
