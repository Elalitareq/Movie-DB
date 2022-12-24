const express = require("express");
const app = express();
const port = 9797;
const movies = [
  { title: "Jaws", year: 1975, rating: 8 },
  { title: "Avatar", year: 2009, rating: 7.8 },
  { title: "Brazil", year: 1985, rating: 8 },
  { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
];

app.get("/:par1?/:par2?/:par3?", (req, res) => {
  let par1 = req.params.par1;
  let par2 = req.params.par2;
  let par3 = req.params.par3;
  if (par1 == undefined) {
    res.send("ok");
  } else if (par1 == "test") {
    const response = {
      status: 200,
      message: "ok",
    };
    res.send(response);
  } else if (par1 == "time") {
    let date = new Date();
    let time = `${date.getHours()}:${date.getMinutes()}}`;
    let response = { status: 200, message: time };
    res.send(response);
  } else if (par1 == "hello") {
    par2 == undefined
      ? res.send({ status: 200, message: par1 })
      : res.send({ status: 200, message: `${par1}, ${par2}` });
  } else if (par1 == "search") {
    if (req.query.s == "" || req.query.s == undefined) {
      let search = { status: 500, message: `You have to provide a search` };
      res.send(search);
      res.status(500).send();
    } else {
      let search = { status: 200, message: `OK`, data: req.query.s };
      res.send(search);
    }
  } else if (par1 == "movies") {
    switch (par2) {
      case "create":
        res.send("create");
        break;
      case "read":
        if (par3 === undefined) {
          res.send({ status: 200, data: movies });
        } else {
          let sortby = par3.split("-")[1];
          var sortedMovies
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
          } else if(sortby=='rating'){
            sortedMovies = movies.sort((a, b) => {
                return a.rating - b.rating;
              });
          }
          res.send({status:200,data:sortedMovies})
        }
        break;
      case "update":
        res.send("update");
        break;
      case "delete":
        res.send("delete");
        break;
      default:
        res.send("choose a directory");
    }
  } else {
    res.send(`${par1} is not a directory`);
  }
});
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
