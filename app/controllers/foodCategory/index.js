const FoodCategory = require("../../models/foodCategory");
const Menu = require("../../models/menu");
const Restaurant = require("../../models/restaurant");

// create food category api
const createFoodCategory = async (req, res, next) => {
  try {
    if (!req.user.restaurantID) {
      return res
        .status(404)
        .send({ message: "You need to register your restaurant." });
    }
    if (!req.file) {
      return res.status(400).send({ message: "No file was uploaded!" });
    }
    const data = {
      name: req.body.name,
      image: req.file.filename,
      userId: req.user.id,
      restaurantId: req.user.restaurantID,
    };

    const foodCategoryCreate = await new FoodCategory(data);
    foodCategoryCreate
      .save()
      .then((result) => {
        res
          .status(200)
          .send({ result, message: "Food Category added successfully!" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (err) {
    next(err);
  }
};

// get all categories
const getFoodCategories = async (req, res, next) => {
  try {
    const query = {
      $and: [{ userId: req.user.id }, { restaurantId: req.user.restaurantID }],
    };

    FoodCategory.find(query)
      .populate("userId", "-password")
      .populate("restaurantId", "-userId")
      .then((result) => {
        return res.status(200).send({ result });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    next(err);
    // return res.status(400).send({ message: err });
  }
};

const getMenuByCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categoryData = await FoodCategory.findById(id);
    const menu = await Menu.find({ categoryId: id });
    const modifiedMenu = menu?.map(item => ({
      ...item._doc,
      QTY: 1,
      newPrice: item.price
    }));
    // res.status(200).send({ Menus: menu, categoryData: categoryData });
    res.status(200).send(modifiedMenu);
  } catch (err) {
    next(err);
    // return res.status(400).send({ message: err });
  }
};

// get category by id
const getFoodCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await FoodCategory.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Id not found" });
    } else {
      FoodCategory.findById(id)
        .then((result) => {
          return res.status(200).send({ result });
        })
        .catch((err) => {
          return res.status(400).send({ message: err.message });
        });
    }
  } catch (err) {
    next(err);
    // return res.status(400).send({ message: err });
  }
};

// get category by Restaurant id
const getFoodCategoryByRestaurant = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ message: "Id not found" });
    } else {
      const category = await FoodCategory.find({ restaurantId: id })
        .populate("restaurantId", "-userId")
        .then((result) => {
          return res.status(200).send(result);
        })
        .catch((err) => {
          return res.status(400).send({ message: err.message });
        });
    }
  } catch (err) {
    next(err);
    // return res.status(400).send({ message: err });
  }
};

// edit food category api
const editFoodCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!req.file) {
      return res.status(400).send({ message: "No file was uploaded!" });
    }
    const data = {
      name,
      image: req.file.filename,
    };

    const category = await FoodCategory.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Category not found" });
    }
    await FoodCategory.findByIdAndUpdate(id, data, {
      new: true,
    })
      .then((result) => {
        res
          .status(200)
          .send({ result, message: "Food category edited successfully!" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (err) {
    next(err);
    // res.status(500).send({ message: err });
  }
};

//delete category api
const deleteFoodCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ message: "Id is required" });
    }
    const category = await FoodCategory.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Id not found" });
    }
    await FoodCategory.findByIdAndDelete({ _id: id })
      .then((result) => {
        return res
          .status(200)
          .send({ message: "Food category deleted successfully" });
      })
      .catch((err) => {
        return res.status(500).send({ message: err.message });
      });
  } catch (err) {
    next(err);
    // res.status(400).send({ message: err });
  }
};

module.exports = {
  createFoodCategory,
  editFoodCategory,
  deleteFoodCategory,
  getFoodCategories,
  getFoodCategory,
  getMenuByCategory,
  getFoodCategoryByRestaurant,
};
