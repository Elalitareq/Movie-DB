const express = require("express");
const mongoose = require("mongoose");
const user = "user";
const password = "mogopass";
const url = `mongodb+srv://${user}:${password}@moviescluster.jng0psx.mongodb.net/movies_db?retryWrites=true&w=majority`;
var movieList = require('./../models/movieList')
const addedMovies = [];
const router = express.Router();
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
          res.send({statys:200,data:moviesFromDB});
        } catch (error) {
          res.status(500).send({status:500,message:error});
        }
      }
    } else{
      res.status(404).send({status:404,message:`${par3}is not a directory`})
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
router.delete("/:par3?", async(req, res) => {
  let par3 = req.params.par3;
  if (par3 === undefined || par3 == "" || par3 < 0) {
    res.status(404).send({
      status: 404,
      error: true,
      message: `the movie ${par3} does not exist`,
    });
  } else {try{
    movieList.deleteOne({ _id: par3 }).then(()=>{
      console.log("Data deleted");})
    res.send({status:200,message:`movie with id:${par3} deleted`})
  }catch(err){res.status(404).send(err)}
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
    year !== undefined && year.toString().length == 4&&!isNaN(year)
      ? (update.year = parseInt(year))
      : update;

    rating !== undefined && rating !== NaN && rating >= 0 && rating <= 10
      ? (update.rating = parseFloat(rating))
      : update;
    console.log(update)
    try{await movieList.countDocuments(filter); // 0

    let movie = await movieList.findOneAndUpdate(filter, update, {
      new: true,
    });
    
    movie!==null?res.send({status:200 ,data:movie}):res.send(`No movie with ID: ${par3} `);
  }catch(err){
      res.status(500).send(err)
    }
  
}
});
module.exports = router;
