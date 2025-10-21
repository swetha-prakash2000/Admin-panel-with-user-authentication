
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); 
const cookieParser = require("cookie-parser"); 
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use('/', userRoutes);

app.use('/', adminRoutes);



mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
