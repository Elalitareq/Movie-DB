const express = require("express");
const app = express();
const router = require('./movies')
const port = 9797;


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
app.get("/hello/:par2?", (req, res) => {
  let par2 = req.params.par2;
  par2 == undefined
    ? res.send({ status: 200, message: "hello" })
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
app.use('/movies',router)
app.use('/movies/:par3?/:par4',router)

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});