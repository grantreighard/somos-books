import express from 'express'

const app = express()

const port = process.env.PORT ?? 4000 // add PORT from process.env for use on Heroku for instance

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})
