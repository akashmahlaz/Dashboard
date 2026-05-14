import express from "express"
const app = express();
const port = 5000

app.get('/', (req, res) => {
  res.send('Server running | 200 OK !')
})

app.listen(port, () => {
  console.log(`app server listening on port ${port}`)
})