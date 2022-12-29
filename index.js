const express = require("express");
const app = express();
const movieRouter = require("./routes/movies");
const userRouter = require("./routes/user");
const port = 9797;
const auth = require("./middleware/auth");
require("dotenv").config();
require("./config/database").connect();

app.use(express.json());

app.get("/", (_req, res) => res.send("ok"));
app.get("/test", (_req, res) => res.send({ status: 200, message: "ok" }));
app.get("/time", (_req, res) => {
  let date = new Date();
  let time = `${date.getHours()}:${date.getMinutes()}}`;
  res.send({ status: 200, message: time });
});
app.get("/hello/:par2?", (req, res) => {
  let par2 = req.params.par2;
  res.send({ status: 200, message: par2 ? `hello, ${par2}` : "hello" });
});
app.get("/search", (req, res) => {
  if (req.query.s) {
    res.send({ status: 200, message: `OK`, data: req.query.s });
  } else {
    res
      .status(500)
      .send({ status: 500, message: `You have to provide a search` });
  }
});

app.use("/movies", movieRouter);
app.use("/user", userRouter);

app.get("/welcome", auth, (_req, res) => res.status(200).send("Welcome 🙌 "));
app.listen(port, () => console.log(`listening at http://localhost:${port}`));
