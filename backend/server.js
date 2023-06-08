const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const cors = require('cors')

const port = process.env.PORT || 5000

// Prepare app of express
const app = express();

app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Set All Avaliable Routes
app.use('/api/users', require('./routes/userRouter'))
app.use('/api/twits', require('./routes/twitRouter'))

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
