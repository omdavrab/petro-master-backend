const Order = require("../../models/Order");
const Restaurant = require("../../models/restaurant");
const jwtToken = require("jsonwebtoken");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

const createRestaurant = async (req, res) => {
  try {
    const { name, address, phoneNo, openTime, closeTime, city, postalcode } =
      req.body;
    // If there was no file uploaded, return an error response
    if (!req.file) {
      return res.status(400).send({ message: "No file was uploaded!" });
    }
    const data = {
      name,
      address,
      phoneNo,
      openTime,
      closeTime,
      city,
      postalcode,
      logo: req.file.filename,
      userId: req.user.id,
    };

    const restaurant = await Restaurant.findOne({ userId: data.userId });
    if (restaurant) {
      return res.status(400).send({ message: "Restaurant already exist" });
    }
    const restaurantCreate = await new Restaurant(data);
    restaurantCreate
      .save()
      .then((result) => {
        const token = jwtToken.sign(
          {
            email: req.user.email,
            id: req.user.id,
            restaurantID: result._id,
            role: req.user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_LIFTIME,
          }
        );
        res
          .status(200)
          .send({ result, token, message: "Restaurant created successfully!" });
      })
      .catch((err) => {
        return res.status(400).send({ message: err.message });
      });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

// get all Restaurant
const getRestaurant = async (req, res) => {
  try {
    const query = {
      userId: req.user.id,
    };
    Restaurant.findOne(query)
      .then((result) => {
        return res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

// Edit Restaurant
const EditRestaurant = async (req, res) => {
  try {
    const data = req.body;
    data.logo = req.file?.filename;
    await Restaurant.findByIdAndUpdate({ _id: req.user.restaurantID }, data, {
      new: true,
    })
      .then((result) => {
        return res
          .status(200)
          .send({ message: "Restaurant edit successfully" });
      })
      .catch((err) => {
        res.status(400).send({ message: err.message });
      });
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};

// const getCustomersData = async (req,res) => {
//   try {
//     const restaurantId = req.user.restaurantID;
//     const customers = await Order.find({restaurantId})
//     console.log("🚀 ~ file: index.js:101 ~ getCustomersData ~ customers:", customers)

//     if(!restaurantId){
//       return res.json({message : "No restaurantId found"})
//     }

//     if(!customers){
//       return res.json({message : "No customers data found with this restaurant"})
//     }

//     const customersWithData = [];

//     // Loop through each customer
//     for (const customer of customers) {
//       const userId = customer.userId;

//       // Find the user data using the userId in the User collection
//       const userData = await User.findOne({ _id: userId }).select("-password");

//       // Add the user data to the customer object
//       customer.userData = userData;

//       // Add the modified customer to the customersWithData array
//       customersWithData.push(customer);
//     }
//     console.log(customersWithData,"datdatd");
//    return res.status(200).json({customersWithData})
//   } catch (error) {
//     console.log(error);
//   }
// }

// v2
const getCustomersData = async (req, res) => {
  try {
    const restaurantId = req.user.restaurantID;

    if (!restaurantId) {
      return res.json({ message: "No restaurantId found" });
    }

    const customers = await Order.find({ restaurantId });

    if (!customers || customers.length === 0) {
      return res.json({
        message: "No customers data found with this restaurant",
      });
    }

    const customersWithData = {};

    // Loop through each customer
    for (const customer of customers) {
      const userId = customer.userId;

      // Find the user data using the userId in the User collection
      const userData = await User.findOne({ _id: userId }).select("-password");

      if (!customersWithData[userId]) {
        customersWithData[userId] = [];
      }

      customersWithData[userId].push({
        userData: userData,
        order: customer,
      });
    }

    const customersWithLastOrder = [];

    for (const userId in customersWithData) {
      const userOrders = customersWithData[userId];
      const userData = customersWithData[userId];
      const lastUserData = userData[userOrders.length - 1].userData;
      const lastOrder = userOrders[userOrders.length - 1].order;
      lastOrder.userData = lastUserData;
      customersWithLastOrder.push(lastOrder);
    }

    return res.status(200).json({ customersWithLastOrder });
  } catch (error) {
    console.log(error);
  }
};

//Count total Order, user and amount
const getTotalByRestaurant = async (req, res) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      23,
      59,
      59
    );

    const todayQuery = {
      restaurantId: req.user.restaurantID,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    };

    const allQuery = {
      restaurantId: req.user.restaurantID,
    };

    const todayResult = await Order.find(todayQuery)
      .populate("menuList.menuId")
      .populate("userId")
      .sort({ _id: -1 })
      .exec();

    const allResult = await Order.find(allQuery)
      .populate("menuList.menuId")
      .populate("userId")
      .sort({ _id: -1 })
      .exec();

    const uniqueUserIdsToday = new Set();
    const uniqueUserIdsAll = new Set();
    let totalSpentToday = 0;
    let totalSpentAll = 0;
    let statusCountsToday = {
      cancel: 0,
      pending: 0,
      complete: 0,
    };
    let statusCountsAll = {
      cancel: 0,
      pending: 0,
      complete: 0,
    };

    for (const order of todayResult) {
      const userId = order.userId._id.toString();
      uniqueUserIdsToday.add(userId);
      totalSpentToday += order.totalPrice;

      const orderStatus = order.status;
      if (orderStatus === "Cancel") {
        statusCountsToday.cancel++;
      } else if (orderStatus === "Pending") {
        statusCountsToday.pending++;
      } else if (orderStatus === "Complete") {
        statusCountsToday.complete++;
      }
    }

    for (const order of allResult) {
      const userId = order.userId?._id.toString();
      uniqueUserIdsAll.add(userId);
      totalSpentAll += order.totalPrice;

      const orderStatus = order.status;
      if (orderStatus === "Cancel") {
        statusCountsAll.cancel++;
      } else if (orderStatus === "Pending") {
        statusCountsAll.pending++;
      } else if (orderStatus === "Complete") {
        statusCountsAll.complete++;
      }
    }

    const totalResultsToday = todayResult.length;
    const totalUniqueUsersToday = uniqueUserIdsToday.size;

    const totalResultsAll = allResult.length;
    const totalUniqueUsersAll = uniqueUserIdsAll.size;

    const TodayData = {
      TodayTotalOrder: totalResultsToday,
      TodayTotalUser: totalUniqueUsersToday,
      TodayTotalRevenue: totalSpentToday,
      TodayTotalStatusCounts: statusCountsToday,
    };
    const AllData = {
      TotalOrder: totalResultsAll,
      TotalUser: totalUniqueUsersAll,
      TotalRevenue: totalSpentAll,
      TotalStatusCounts: statusCountsAll,
    };
    res.status(200).send({ TodayData, AllData });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};


// Trending Items
const getTrendingItems = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let id;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { restaurantID } = decoded;
      id = restaurantID;
    } else {
      const { id: queryId } = req.query;
      id = queryId;
    }
    const allQuery = {
      restaurantId: id,
    };
    const todayResult = await Order.find(allQuery)
      .populate("menuList.menuId")
      .sort({ _id: -1 })
      .exec();

    // Count the total quantity of each menu item
    const trendingItems = {};
    todayResult.forEach((order) => {
      order.menuList.forEach((item) => {
        const menuId = item.menuId._id.toString();
        const quantity = item.QTY;
        if (trendingItems.hasOwnProperty(menuId)) {
          trendingItems[menuId].quantity += quantity;
        } else {
          trendingItems[menuId] = {
            quantity: quantity,
            menuItem: item.menuId,
          };
        }
      });
    });

    // Calculate the percentage of each menu item and sort by quantity
    const sortedTrendingItems = Object.values(trendingItems)
      .map((item) => {
        const percentage = (item.quantity / todayResult.length) * 100;
        return {
          ...item,
          percentage: parseFloat(percentage.toFixed(2)),
        };
      })
      .sort((a, b) => b.quantity - a.quantity);

    // Determine the sale level of each menu item
    const topTrendingItems = sortedTrendingItems.slice(0, 10).map((item) => {
      let saleLevel = "";
      if (item.percentage >= 50) {
        saleLevel = "high";
      } else if (item.percentage >= 20) {
        saleLevel = "medium";
      } else {
        saleLevel = "low";
      }
      return {
        ...item,
        saleLevel: saleLevel,
      };
    });

    res.send(topTrendingItems);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRestaurant,
  getRestaurant,
  EditRestaurant,
  getCustomersData,
  getTotalByRestaurant,
  getTrendingItems,
};
