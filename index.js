const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const authRoutes = require("./routes/auth");

app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRoutes);

app.use((req, res, next) => {
  res.send("<h1 style='text-align: center;'>Welcome to API view for Chat API App");
});

mongoose
  .connect(
    "mongodb+srv://ajayahir:Ajay3398@cluster.vy3znto.mongodb.net/rentApp?retryWrites=true&w=majority"
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((error) => console.log(error));
