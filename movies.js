const express = require('express')
const mongoose = require("mongoose");
const user='user'
const password='mogopass'

const url=`mongodb+srv://${user}:${password}@moviescluster.jng0psx.mongodb.net/movies_db?retryWrites=true&w=majority`
var movieSchema = mongoose.Schema({
  title: {
      type: String
  },
  year: {
      type: Number
  },
  rating:{
      type: Number,
      default:4
  }
});
var movieList = mongoose.model('movies', movieSchema);

const router = express.Router()
const movies = [
    { title: "Jaws", year: 1975, rating: 8 },
    { title: "Avatar", year: 2009, rating: 7.8 },
    { title: "Brazil", year: 1985, rating: 8 },
    { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
  ];
router.use((req, res, next) => {
    console.log('Time: ', Date.now())
    next()
  })
  try{
    mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, async()=>{
        console.log("Connected to MongoDB ");
    })
  } catch(error){
    console.log(error.message);
  }
router.get("/:par3?/:par4?", (req, res) => {
    let par3 = req.params.par3;
    let par4 = req.params.par4;
    if (par3 === undefined||par3==="") {
      res.send({ status: 200, data: movies });
    } else {
      if (par3.split("-")[0] == "by") {
        let sortby = par3.split("-")[1];
        var sortedMovies;
        if (sortby == "year") {
          sortedMovies = movies.sort((a, b) => {
            return a.year - b.year;
          });
        } else if (sortby == "title") {
          sortedMovies = movies.sort((a, b) => {
            let fa = a.title.toLowerCase(),
              fb = b.title.toLowerCase();
  
            if (fa < fb) {
              return -1;
            }
            if (fa > fb) {
              return 1;
            }
            return 0;
          });
        } else if (sortby == "rating") {
          sortedMovies = movies.sort((a, b) => {
            return a.rating - b.rating;
          });
          res.send({ status: 200, data: sortedMovies });
        }
      } else if (par3 == "ID") {
        if (par4 == undefined) {
          res.send("please specify an ID");
        } else {
          !parseInt(par4)
            ? res.status(404).send({
                status: 404,
                error: true,
                message: `${par4} is not a number`,
              })
            : par4 > 0 && par4 < movies.length
            ? res.send({ status: 200, data: movies[par4 - 1] })
            : res.send({
                status: 404,
                error: true,
                message: `the movie ${par4} does not exist`,
              });
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
      if(req.query.rating>10||req.query.rating<0||req.query.rating==undefined||isNaN(req.query.rating)){
          rating=4
      }else {
          rating=parseFloat(req.query.rating)
      }
      movie =new movieList({
        title: req.query.title,
        year: parseInt(req.query.year),
        rating: parseFloat(rating),
      });
      const addedMovies=await movie.save()
      res.send({status:200,message:{addedMovies}})
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
  
  router.put("/:par3?", (req, res) => {
    let par3 = req.params.par3;
    if (par3 == NaN || par3 > movies.length || par3 < 1) {
      res
        .status(404)
        .send({ status: 404, error: true, message: `no movie with ID=${par3}` });
    } else {
      var theTitle = req.query.title;
      var year = req.query.year;
      var rating = req.query.rating;
      movies[par3 - 1].title =
        theTitle !== undefined ? theTitle : movies[par3 - 1].title;
      movies[par3 - 1].year =
        year !== undefined && year.toString().length == 4 && year !== NaN
          ? parseInt(year)
          : movies[par3 - 1].year;
      movies[par3 - 1].rating =
        rating !== undefined && rating !== NaN && rating >= 0 && rating <= 10
          ? parseFload(rating)
          : movies[par3 - 1].rating;
      res.send(movies[par3 - 1]);
    }
  });
  module.exports = router