const mongoose = require("mongoose");
const user = "user";
const password = "mogopass";
const url = `mongodb+srv://${user}:${password}@moviescluster.jng0psx.mongodb.net/movies_db?retryWrites=true&w=majority`;
const autoIncrement = require("mongoose-ai");
mongoose.set("strictQuery", false);
var connection = mongoose.createConnection(url);
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
