const Tax = require("../../models/tax");
const jwt = require("jsonwebtoken");

// create Tax api
const createTax = async (req, res, next) => {
    try {
        const { name, value, status } = req.body;
        const data = {
            name,
            value,
            status,
            userId: req.user.id,
            restaurantId: req.user.restaurantID,
        }
        const newTax = new Tax(data);
        newTax.save()
            .then((result) => {
                res.status(200).send({ text: result, message: "Tax added successfully!" });
            })
            .catch(error => {
                res.status(500).json({ message: 'An error occurred while creating the tax record.' });
            });
    } catch (err) {
        next(err);
    }
};

const getTax = async (req, res, next) => {
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
        const todayResult = await Tax.find(allQuery)
        res.status(200).send(todayResult)
    } catch (err) {
        next(err);
    }
};
//Edit Tax
const EditTax = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            name,
            value,
            status,
        } = req.body;
        const data = {
            name,
            value,
            status,
        };
        const menu = await Tax.findById(id);
        if (!menu) {
            return res.status(404).send({ message: "Tax not found" });
        }
        await Tax.findByIdAndUpdate(id, data, {
            new: true,
        })
            .then((result) => {
                res.status(200).send({ result, message: "Tax edited successfully!" });
            })
            .catch((err) => {
                res.status(500).send({ message: err.message });
            });
    } catch (err) {
        next(err)
    }
}

// delete menu api
const deleteTax = async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(404).send({ message: "Id is required" });
      }
      const menu = await Tax.findById(id);
      if (!menu) {
        return res.status(404).send({ message: "Id not found" });
      }
      await Tax.findByIdAndDelete({ _id: id })
        .then((result) => {
          return res.status(200).send({ message: "Tax deleted successfully" });
        })
        .catch((err) => {
          res.status(500).send({ message: err.message });
        });
    } catch (err) {
      res.status(400).send({ message: err });
    }
  };
module.exports = {
    createTax,
    getTax,
    EditTax,
    deleteTax
};