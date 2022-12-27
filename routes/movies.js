const express = require("express");
const mongoose = require("mongoose");
const user = "user";
const password = "mogopass";
const url = `mongodb+srv://${user}:${password}@moviescluster.jng0psx.mongodb.net/movies_db?retryWrites=true&w=majority`;
var movieList = require("./../models/movieList");
const addedMovies = [];
const movieRouter = express.Router();
movieRouter.use((_req, _res, next) => {
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
movieRouter.get("/:par3?/:par4?", async (req, res) => {
  let par3 = req.params.par3;
  let par4 = req.params.par4;
  if (par3 === undefined || par3 === "") {
    try {
      const moviesFromDB = await movieList.find({});
      res.send({ status: 200, message: "Movies", data: moviesFromDB });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, error: true, message: error.message });
    }
  } else if (par3.split("-")[0] == "by") {
    let sortby = par3.split("-")[1];
    if (sortby == "year") {
      try {
        const byYear = await movieList.find({}).sort({ year: 1 });
        res.send({
          status: 200,
          message: "Movies sorted by year",
          data: byYear,
        });
      } catch (error) {
        res
          .status(500)
          .send({ status: 500, error: true, message: error.message });
      }
    } else if (sortby == "title") {
      try {
        const byTitle = await movieList.find({}).sort({ title: 1 });
        res.send({
          status: 200,
          message: "Movies sorted by title",
          data: byTitle,
        });
      } catch (error) {
        res
          .status(500)
          .send({ status: 500, error: true, message: error.message });
      }
    } else if (sortby == "rating") {
      try {
        const byRating = await movieList.find({}).sort({ rating: 1 });
        res.send({
          status: 200,
          message: "Movies sorted by rating",
          data: byRating,
        });
      } catch (error) {
        res
          .status(500)
          .send({ status: 500, error: true, message: error.message });
      }
    }
  } else if (par3 == "ID") {
    try {
      movieList.countDocuments({ _id: par4 }, async (err, count) => {
        if (count > 0) {
          const movieFromDB = await movieList.find({ _id: req.params.par4 });
          res.send({ statys: 200, message: `ID:${par4}`, data: movieFromDB });
        }else{
          res.send({ statys: 200, message: `ID:${par4} does not exist` })
        }
      });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, error: true, message: error.message });
    }
  } else{
    res.status(404).send({status:404,error:true,message:`${par3} directory not found`})
  }
});
movieRouter.post("/", async (req, res) => {
  var title = req.query.title;
  var year = req.query.year;
  var rating = req.query.rating;
  var movie;
  try {
    let newMovie = {};
    newMovie.title = title;
    newMovie.year = year;
    rating !== undefined ? (newMovie.rating = rating) : newMovie;
    movie = new movieList(newMovie);
    const addedMovie = await movie.save();
    res.send({ status: 200, message: "movie added", data: { addedMovie } });
  } catch (error) {
    res.status(403).send({ status: 403, error: true, message: error.message });
  }
});
movieRouter.delete("/:par3?", async (req, res) => {
  let par3 = req.params.par3;
  if (par3 === undefined || par3 == "" || par3 < 0) {
    res.status(404).send({
      status: 404,
      error: true,
      message: `the movie ${par3} does not exist`,
    });
  } else {
    try {
      movieList.deleteOne({ _id: par3 }).then(() => {
        console.log("Data deleted");
      });
      res.send({ status: 200, message: `movie with id:${par3} deleted` });
    } catch (err) {
      res.status(404).send(err);
    }
  }
});

movieRouter.put("/:par3?", async (req, res) => {
  let par3 = req.params.par3;
  if (isNaN(par3)) {
    res.status(404).send({
      status: 404,
      error: true,
      message: `please select an ID number`,
    });
  } else {
    var title = req.query.title;
    var year = req.query.year;
    var rating = req.query.rating;
    const filter = { _id: par3 };
    var update = {};

    title !== undefined ? (update.title = title) : update;
    year !== undefined && year.toString().length == 4 && !isNaN(year)
      ? (update.year = parseInt(year))
      : update;

    rating !== undefined && rating !== NaN && rating >= 0 && rating <= 10
      ? (update.rating = parseFloat(rating))
      : update;
    console.log(update);
    try {
      await movieList.countDocuments(filter); // 0

      let movie = await movieList.findOneAndUpdate(filter, update, {
        new: true,
      });

      movie !== null
        ? res.send({ status: 200, data: movie })
        : res.send(`No movie with ID: ${par3} `);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});
module.exports = movieRouter;
