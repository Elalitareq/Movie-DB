const mongoose = require("mongoose");
require("dotenv").config();

const user = process.env.user;
const password = process.env.password;
const db=process.env.db
const URI = `mongodb+srv://${user}:${password}@moviescluster.jng0psx.mongodb.net/${db}?retryWrites=true&w=majority`;

const autoIncrement = require("mongoose-ai");
mongoose.set("strictQuery", false);
var connection = mongoose.createConnection(URI);
autoIncrement.initialize(connection);
var movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
      min: 1900,
      max: 2100,
    },
    rating: {
      type: Number,
      default: 4,
      min: 0,
      max: 10,
    },
  },
  {
    versionKey: false,
  }
);
movieSchema.plugin(autoIncrement.plugin, "movies");
module.exports = mongoose.model("movies", movieSchema);
