const Menu = require("../../models/menu");
const Restaurant = require("../../models/restaurant");
const QR = require("../../models/qrcode");
const QRCode = require("qrcode");

// create QR Code
const createQRCode = async (req, res) => {
  try {
    const { numOfTable } = req.body;
    let newArr = [];
    console.log("🚀 ~ file: index.js:13 ~ createQRCode ~ req.user.restaurantID:", req.user.restaurantID)
    const query = {
      $and: [{ userId: req.user.id }, { restaurantId: req.user.restaurantID }],
    };
    const QRDATA = await QR.findOne(query).sort({ _id: -1 }).exec();
    for (let i = 1; i <= numOfTable; i++) {
      const qrText = `http://18.117.144.49:3000/${
        QRDATA?.numOfTable ? QRDATA?.numOfTable + i : 0 + i
      }/${req.user.restaurantID}`;
      const url = await new Promise((resolve, reject) => {
        QRCode.toDataURL(qrText, function (err, url) {
          if (err) reject(err);
          resolve(url);
        });
      });
      const newObj = {
        QrCode: url,
        numOfTable: QRDATA?.numOfTable ? QRDATA?.numOfTable + i : 0 + i,
        userId: req.user.id,
        restaurantId: req.user.restaurantID,
      };
      newArr.push(newObj);
    }
    const menuCreate = await QR.insertMany(newArr);
    return res
      .status(200)
      .send({ result: menuCreate, message: "QR Code created successfully!" });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const getQRCode = async (req, res) => {
  try {
    const query = {
      $and: [{ userId: req.user.id }, { restaurantId: req.user.restaurantID }],
    };
    const menuCreate = await QR.find(query);
    return res.status(200).send(menuCreate);
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

// delete QRCode
const deleteQR = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).send({ message: "Id is required" });
    }
    const menu = await QR.findById(id);
    if (!menu) {
      return res.status(404).send({ message: "Id not found" });
    }
    await QR.findByIdAndDelete({ _id: id })
      .then((result) => {
        return res
          .status(200)
          .send({ message: "QR Code deleted successfully" });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } catch (err) {
    res.status(400).send({ message: err });
  }
};
module.exports = {
  createQRCode,
  getQRCode,
  deleteQR,
};
