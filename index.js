const express = require("express");
const router = require("./routes/router");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
dotenv.config();


const  userRoutes = require('./routes/userRoutes');
const  postRoutes = require('./routes/postRoutes');

const PORT = 8000;

const app = express();
app.use(express.json()); // Đảm bảo rằng middleware này nằm trước các route
app.use('/api',  userRoutes);
app.use('/api', postRoutes);
app.listen(PORT, async () => {
  console.log(`server up on port ${PORT}`);
});
//middleware
app.use(router); 


mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

