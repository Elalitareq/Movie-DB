const express = require("express");
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
    },
    year: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 4,
    },
  },
  {
    versionKey: false,
  }
);
movieSchema.plugin(autoIncrement.plugin, "movies");
var movieList = mongoose.model("movies", movieSchema);
const addedMovies = [];
const router = express.Router();
const movies = [
  { title: "Jaws", year: 1975, rating: 8 },
  { title: "Avatar", year: 2009, rating: 7.8 },
  { title: "Brazil", year: 1985, rating: 8 },
  { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
];
router.use((_req, _res, next) => {
  console.log("Using Route");
  next();
});
try {
  mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async () => {
      console.log("Connected to MongoDB ");
    }
  );
} catch (error) {
  console.log(error.message);
}
router.get("/:par3?/:par4?", async (req, res) => {
  let par3 = req.params.par3;
  let par4 = req.params.par4;
  if (par3 === undefined || par3 === "") {
    const moviesFromDB = await movieList.find({});

    try {
      res.send(moviesFromDB);
    } catch (error) {
      res.status(500).send(error);
    }
  } else {
    if (par3.split("-")[0] == "by") {
      let sortby = par3.split("-")[1];
      if (sortby == "year") {
        const byYear = await movieList.find({}).sort({ year: 1 });

        try {
          res.send(byYear);
        } catch (error) {
          res.status(500).send(error);
        }
      } else if (sortby == "title") {
        const byTitle = await movieList.find({}).sort({ title: 1 });

        try {
          res.send(byTitle);
        } catch (error) {
          res.status(500).send(error);
        }
      } else if (sortby == "rating") {
        const byRating = await movieList.find({}).sort({ rating: 1 });

        try {
          res.send(byRating);
        } catch (error) {
          res.status(500).send(error);
        }
      }
    } else if (par3 == "ID") {
      if (par4 == undefined || isNaN(par4)) {
        res.send("please specify an ID number");
      } else {
        const moviesFromDB = await movieList.find({ _id: req.params.par4 });

        try {
          res.send(moviesFromDB);
        } catch (error) {
          res.status(500).send(error);
        }
      }
    }
  }
});
router.post("/", async (req, res) => {
  var theTitle = req.query.title;
  var year = req.query.year;
  if (
    theTitle == "" ||
    year == "" ||
    year.toString().length !== 4 ||
    isNaN(year)
  ) {
    res
      .status(403)
      .send("you cannot create a movie without providing a title and a year");
  } else {
    var movie;
    if (
      req.query.rating > 10 ||
      req.query.rating < 0 ||
      req.query.rating == undefined ||
      isNaN(req.query.rating)
    ) {
      rating = 4;
    } else {
      rating = parseFloat(req.query.rating);
    }
    movie = new movieList({
      title: req.query.title,
      year: parseInt(req.query.year),
      rating: parseFloat(rating),
    });
    const addedMovie = await movie.save();
    addedMovies.push(addedMovie);
    res.send({ status: 200, message: { addedMovies } });
  }
});
router.delete("/:par3?", (req, res) => {
  let par3 = req.params.par3;
  if (par3 === undefined || par3 == "" || par3 > movies.length || par3 < 0) {
    res.status(404).send({
      status: 404,
      error: true,
      message: `the movie ${par3} does not exist`,
    });
  } else {
    movies.splice(par3 - 1, 1);
    res.send({
      status: 200,
      message: `deleted movie with ID=${par3}`,
      data: movies,
    });
  }
});

router.put("/:par3?", async (req, res) => {
  let par3 = req.params.par3;
  if (isNaN(par3)) {
    res.status(404).send({
      status: 404,
      error: true,
      message: `please select an ID number`,
    });
  } else {
    var theTitle = req.query.title;
    var year = req.query.year;
    var rating = req.query.rating;
    const filter = { _id: par3 };

    var update = {};

    theTitle !== undefined ? (update.title = theTitle) : update;
    console.log(year);
    year !== undefined && year.toString().length == 4&&!isNaN(year)
      ? (update.year = parseInt(year))
      : update;

    rating !== undefined && rating !== NaN && rating >= 0 && rating <= 10
      ? (update.rating = parseFloat(rating))
      : update;
    try{movieList.find({_id:par3})
    try{await movieList.countDocuments(filter); // 0

    let movie = await movieList.findOneAndUpdate(filter, update, {
      new: true,
      upsert: true, // Make this update into an upsert
    });
    res.send({status:200 ,data:movie});}catch(err){
      res.status(500).send(err)
    }
  }catch(err){console.log(err)}}
});
module.exports = router;
