const jwtToken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Otp = require("../../models/otp");
const Restaurant = require("../../models/restaurant");
const { CustomAPIError } = require("../../../errors");

// Create ADMIN
const register = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      return res.status(400).send({ message: "Email already exists" });
    }

    // Send OTP via Nodemailer
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });
    let mailOptions = {
      from: "Email Id",
      to: email,
      subject: "OTP Verification",
      text: "Your OTP is: " + otp,
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(400).send({ error, message: "Failed to send OTP" });
      }

      // Save user and OTP details to the database
      const user = await User.create(req.body);
      const token = jwtToken.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFTIME,
        }
      );

      const loginUser = await User.findOne({ email }).select("-password");
      const alreadyExist = await Otp.findOneAndUpdate(
        email,
        { otp: otp },
        { new: true }
      );
      if (!alreadyExist) {
        const otpCreate = await Otp.create({
          otp,
          userId: loginUser._id,
          email,
        });
      }

      // Send the final response
      return res
        .status(200)
        .send({ user: user, token: token, message: "Otp Sent successfully" });
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};

// Admin Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const query = {
      $and: [{ email: email }, { isverify: true }],
    };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).send({ message: "Invalid credential" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Invalid credential" });
    }
    const restaurant = await Restaurant.findOne({ userId: user._id });

    if (restaurant) {
      const token = jwtToken.sign(
        {
          email: email,
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFTIME,
        }
      );
      user._doc["restaurantCreate"] = true;
      return res
        .status(200)
        .send({ user: user, token, message: "Login succefully" });
    } else {
      const token = jwtToken.sign(
        { email: email, id: user._id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_LIFTIME,
        }
      );
      user._doc["restaurantCreate"] = false;
      return res
        .status(200)
        .send({ user: user, token, message: "Login succefully" });
    }
  } catch (error) {
    console.log(error);
  }
};
// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Email" });
    }
    const loginUser = await Otp.findOne({ email });
    if (loginUser) {
      if (otp === loginUser.otp) {
        // OTP is correct
        // await User.findOneAndUpdate(
        //   { email: email },
        //   { isverify: true },
        //   { new: true, runValidators: true }
        // );
        user.isverify = true;
        await user.save();
        const token = jwtToken.sign(
          { email: user.email, id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_LIFTIME,
          }
        );
        res.status(200).send({
          message: "OTP verify successfully!",
          user: user,
          success: true,
          token,
        });
        const deleteOtp = await Otp.deleteOne({ email });
      } else {
        // OTP is incorrect
        return res.status(400).send({ message: "OTP is incorrect" });
      }
    } else {
      return res
        .status(400)
        .send({ message: "OTP has been not sended please try again!" });
    }
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new CustomAPIError(`User not found please enter valid email id`)
      );
    }
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
      },
    });
    let mailOptions = {
      from: "Email Id",
      to: email,
      subject: "OTP Verification",
      text: "Your OTP is: " + otp,
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        return res.status(500).send({ error, message: "Failed to send OTP" });
      }
    });
    const alreadyExist = await Otp.findOneAndUpdate(
      email,
      { otp: otp },
      { new: true }
    );
    if (!alreadyExist) {
      const otpCreate = await Otp.create({
        otp,
        userId: user._id,
        email,
      });
    }
    return res.status(200).send({ message: "Otp Send succefully" });
  } catch (error) {
    console.log(error);
  }
};

const verifyForgotPasswordOtp = async (req, res) => {
  try {
    // const salt = await bcrypt.genSalt(10);
    const { email, otp } = req.body;
    // const newPassword = await bcrypt.hash(password,salt)

    const otpUser = await Otp.findOne({ email });
    if (!otpUser) {
      return res.status(400).send({ message: "Something went wrong" });
    }
    if (otp === otpUser.otp) {
      // OTP is correct
      return res.status(200).send({ message: "OTP verify successfully!" });
    } else {
      // OTP is incorrect
      return res.status(400).send({ message: "OTP is incorrect" });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateForgotPassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const { email, password } = req.body;
    const newPassword = await bcrypt.hash(password, salt);

    const updatePassword = await User.findOneAndUpdate(
      { email: email },
      { password: newPassword },
      { new: true }
    );

    return res.status(200).send({ message: "Password has been updated!" });
  } catch (error) {
    return next(error);
  }
};

//Update user
const updateUser = async (req, res, next) => {
  try {
    const { name, lastname, image, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(password, salt);

    const data = {
      name,
      lastname,
      image,
      password: newPassword,
    };
    const updatePassword = await User.findOneAndUpdate(
      { _id: req.user.id },
      { data },
      { new: true }
    );
    res.status(200).send(updatePassword);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  verifyOtp,
  forgotPassword,
  verifyForgotPasswordOtp,
  updateForgotPassword,
  updateUser,
};
