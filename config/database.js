const mongoose = require("mongoose");
const user = "user";
const password = "mogopass";
const db="movies_db"
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