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
    } else {
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
      res.status(201).json(user);
    }
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
//delete
userRouter.delete("/delete", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).send("Email is required");
    } else {
      const user = await User.findOneAndDelete({ email });
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send("User deleted");
      }
    }
  } catch (err) {
    console.log(err);
  }
});
//update
userRouter.patch("/update", async (req, res) => {
  try {
    const { email } = req.body;
    const updates = req.body;
    const allowedUpdates = ["first_name", "last_name", "email", "password"];
    const isValidUpdate = Object.keys(updates).every((update) =>
      allowedUpdates.includes(update)
    );

    if (!email) {
      res.status(400).send("Email is required");
    } else if (!isValidUpdate) {
      res.status(400).send("Invalid update");
    } else {
      const user = await User.findOneAndUpdate({ email }, updates, {
        new: true,
      });
      if (!user) {
        res.status(404).send("User not found");
      } else {
        res.status(200).send({status:200,user:user});
      }
    }
  } catch (err) {
    res.status(500).send({status:500,error:true,message:err.message});
  }
});
userRouter.get("/", async (_req, res) => {
  try {
    const users = await User.find();
    res.status(200).send({status:200,users:users});
  } catch (err) {
    res.status(500).send({status:500,error:true,message:err.message});
  }
});
//i didnt add authentication for the user creation and delete so that you can add your own user and test the project
//and yeah i searched how to add user authentication to express js project and copied the creating and loging in functions
//but i edited them to work with my project and also i added the delete update and get routes 
//also i created the auth middleware on my own