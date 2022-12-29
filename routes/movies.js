const express = require("express");
var movieList = require("../models/movieList.js");
const auth = require("./../middleware/auth");
const movieRouter = express.Router();
movieRouter.use((_req, _res, next) => {
  console.log("Using movieRoute");
  next();
});
async function sortMovies(sortBy) {
  let movies;
  try {
    movies = await movieList.find({}).sort({ [sortBy]: 1 });
  } catch (error) {
    throw new Error(error.message);
  }
  return movies;
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
    let movies;
    try {
      movies = await sortMovies(sortby);
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, error: true, message: error.message });
    }
    res.send({
      status: 200,
      message: `Movies sorted by ${sortby}`,
      data: movies,
    });
  } else if (par3 == "ID") {
    try {
      movieList.countDocuments({ _id: par4 }, async (err, count) => {
        if (count > 0) {
          const movieFromDB = await movieList.find({ _id: req.params.par4 });
          res.send({ statys: 200, message: `ID:${par4}`, data: movieFromDB });
        } else {
          res.send({ statys: 404, message: `ID:${par4} does not exist` });
        }
      });
    } catch (error) {
      res
        .status(500)
        .send({ status: 500, error: true, message: error.message });
    }
  } else {
    res.status(404).send({
      status: 404,
      error: true,
      message: `${par3} directory not found`,
    });
  }
});

movieRouter.post("/", auth,async (req, res) => {
  try {
    const { title, year, rating } = req.query;
    const newMovie = { title, year, rating };
    const movie = new movieList(newMovie);
    const addedMovie = await movie.save();
    res.send({ status: 200, message: "movie added", data: { addedMovie } });
  } catch (error) {
    res.status(403).send({ status: 403, error: true, message: error.message });
  }
});

movieRouter.delete("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    const data = await movieList.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).send({
        status: 404,
        error: true,
        message: `the movie ${id} does not exist`,
      });
    }
    res.send({ status: 200, message: `movie with ID:${id} deleted`, data });
  } catch (error) {
    res.status(500).send({ status: 500, error: true, message: error.message });
  }
});

movieRouter.patch("/:par3?",auth, async (req, res) => {
  let par3 = req.params.par3;
  if (isNaN(par3)) {
    return res.status(400).send({
      status: 400,
      error: true,
      message: `please select a valid ID number`,
    });
  }

  const filter = { _id: par3 };
  let update = {};
  const { title, year, rating } = req.query;

  if (title) update.title = title;
  if (year && year.toString().length === 4 && !isNaN(year)) update.year = parseInt(year);
  if (rating && !isNaN(rating) && rating >= 0 && rating <= 10) update.rating = parseFloat(rating);

  try {
    let movie = await movieList.findOneAndUpdate(filter, update, {
      new: true,
    });

    if (!movie) {
      return res.status(404).send({
        status: 404,
        error: true,
        message: `ID:${par3} not found `,
      });
    }

    res.send({ status: 200, data: movie });
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = movieRouter;
