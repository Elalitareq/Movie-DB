const express = require("express");
const userRouter = express.Router();
const User = require("./../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
userRouter.use((_req, _res, next) => {
  console.log("Using userRoute");
  next();
});
// Register
userRouter.post("/create", async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    } else if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }else{

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);}
  } catch (err) {
    console.log(err);
  }
});

// Login
userRouter.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database

    else if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});
module.exports = userRouter;
