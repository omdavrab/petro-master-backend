const Banner = require("../../models/banner");
const jwt = require("jsonwebtoken");

// create Create Banner api
const createBanner = async (req, res, next) => {
  try {
    const imageData = req.files;
    if (!req.user.restaurantID) {
      return res
        .status(404)
        .send({ message: "You need to register your restaurant." });
    }
    if (!req.files) {
      return res.status(400).send({ message: "No file was uploaded!" });
    }
    const datas = imageData.map((item) => {
      return {
        image: item.filename,
        userId: req.user.id,
        restaurantId: req.user.restaurantID,
      };
    });
    const banner = await Banner.insertMany(datas);
    res
      .status(200)
      .send({ banner: banner, message: "Banner added successfully!" });
  } catch (err) {
    next(err);
  }
};
// Get Banner
const getBanner = async (req, res, next) => {
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
    const todayResult = await Banner.find(allQuery);
    res.status(200).send(todayResult);
  } catch (err) {
    next(err);
  }
};
// Delete Banner
const deleteBanners = async (req, res, next) => {
  try {
    const bannerIds = req.body;

    if (!bannerIds || !Array.isArray(bannerIds) || bannerIds.length === 0) {
      return res
        .status(400)
        .send({ message: "Invalid or empty bannerIds parameter!" });
    }

    const deletedBanners = await Banner.deleteMany({ _id: { $in: bannerIds } });

    if (deletedBanners.deletedCount === 0) {
      return res
        .status(404)
        .send({ message: "No banners found with the provided bannerIds!" });
    }

    res.status(200).send({ message: "Banners deleted successfully!" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBanner,
  getBanner,
  deleteBanners
};
