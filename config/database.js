require("dotenv").config();

const mongoose = require("mongoose");
const user = process.env.user;
const password = process.env.password;
const db=process.env.db
const URI = `mongodb+srv://${user}:${password}@moviescluster.jng0psx.mongodb.net/${db}?retryWrites=true&w=majority`;

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};