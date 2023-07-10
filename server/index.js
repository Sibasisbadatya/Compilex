const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
// const messageRoutes = require("./routes/messages");
const app = express();
// const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb+srv://sibasis12112002:bO5FQn9R5YPxbJbC@cluster0.ll9n6sw.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);

const server = app.listen(8000, () =>
  console.log(`Server started on ${8000}`)
);
