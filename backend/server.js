const express = require('express')
require('dotenv').config()

const port = process.env.PORT || 5000

// Prepare app of express
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Set All Avaliable Routes
app.use('/api/users', require('./routes/userRouter'))

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
});
