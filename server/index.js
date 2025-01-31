const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fileRoute = require('./route/fileRouter');

dotenv.config();
const URL = config.MONGODB_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Removed useCreateIndex
    });
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

// Call the database connection function
connectToDatabase();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static('uploads'));
app.use('/api/upload', fileRoute);

app.listen(4000, function () {
  console.log("Server is running on port http://localhost:4000");
});
