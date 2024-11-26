const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require('body-parser');
const createaAdmin  =  require('./scripts/createAdmin');
dotenv.config();


const  userRoutes = require('./routes/userRoutes');
const  postRoutes = require('./routes/postRoutes');
const  authRoutes = require('./routes/authRoutes');
const  PORT = process.env.PORT;

const app = express();
app.use(express.json()); // Đảm bảo rằng middleware này nằm trước các route
app.use('/api',  userRoutes);
app.use('/api', postRoutes);
app.use('/api', authRoutes );
app.listen(PORT, async () => {
  console.log(`server up on port ${PORT}`);
});
//middleware



mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    createaAdmin();
  })
  .catch((err) => {
    console.log(err);
  });

