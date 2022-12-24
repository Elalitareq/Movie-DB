const express = require('express')
const app = express()
const port = 9797

app.get('/', (req, res) => {
  res.send('OK')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})