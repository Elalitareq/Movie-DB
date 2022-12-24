const express = require("express");
const app = express();
const port = 9797;
const movies = [
  { title: "Jaws", year: 1975, rating: 8 },
  { title: "Avatar", year: 2009, rating: 7.8 },
  { title: "Brazil", year: 1985, rating: 8 },
  { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
];
app.get("/", (req, res) => {
  res.send("ok");
});
app.get("/test", (req, res) => {
  const response = {
    status: 200,
    message: "ok",
  };
  res.send(response);
});
app.get("/time", (req, res) => {
  let date = new Date();
  let time = `${date.getHours()}:${date.getMinutes()}}`;
  let response = { status: 200, message: time };
  res.send(response);
});
app.get("/hello/:par2", (req, res) => {
  let par2 = req.params.par2;
  par2 == undefined
    ? res.send({ status: 200, message: par1 })
    : res.send({ status: 200, message: `hello, ${par2}` });
});
app.get("/search", (req, res) => {
  if (req.query.s == "" || req.query.s == undefined) {
    let search = { status: 500, message: `You have to provide a search` };
    res.status(500).send(search);
  } else {
    let search = { status: 200, message: `OK`, data: req.query.s };
    res.send(search);
  }
});
app.get("/movies/create", (req, res) => {
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
        req.query.rating == "" ||
        typeof req.query.rating === "undefined" ||
        req.query.rating > 10
      ) {
        movie = { title: req.query.title, year: req.query.year, rating: 4 };
      } else {
        movie = {
          title: req.query.title,
          year: req.query.year,
          rating: req.query.rating,
        };
      }
    }
    movies.push(movie);
    res.status(200).send(movies);
  });
app.get("/movies/delete/:par3",(req,res)=>{
    let par3=req.params.par3
    if (
        par3 === undefined ||
        par3 == "" ||
        par3 > movies.length ||
        par3 < 0
      ) {
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
})
app.get("/movies/read/:par3/:par4", (req, res) => {
  let par3 = req.params.par3;
  let par4 = req.params.par4;
  if (par3 === undefined) {
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
app.get("/movies/update/:par3", (req, res) => {
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
        ? year
        : movies[par3 - 1].year;
    movies[par3 - 1].rating =
      rating !== undefined && rating !== NaN && rating >= 0 && rating <= 10
        ? rating
        : movies[par3 - 1].rating;
    res.send(movies[par3 - 1]);
  }
});
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
