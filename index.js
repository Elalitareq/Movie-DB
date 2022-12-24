const express = require("express");
const app = express();
const port = 9797;
app.get("/:par1?/:par2?", (req, res) => {
  let par1 = req.params.par1;
  let par2 = req.params.par2;

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
    if(req.query.s == "" || req.query.s == undefined)
    {
        let search = { status: 500, message: `You have to provide a search` };
        res.send(search);
        res.status(500).send()
    }
    else{
        let search = { status: 200, message:`OK`, data: req.query.s };
        res.send(search);

    }
  } else{
    res.send(`${par1} is not a directory`)
  }
});
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
