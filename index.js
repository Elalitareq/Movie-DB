const express = require("express");
const app = express();
const port = 9797;

app.get("/", (req, res) => {
  res.send("OK");
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
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
