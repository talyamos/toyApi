const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoute");
const toyRoutes = require("./routes/toyRoute");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/toys", toyRoutes);

app.get("/test", (req, res) => {
  res.send("talya");
});

app.use((error, req, res, next) => {
  console.log(error);
  return res.status(400).send(error.message);
});

module.exports.app = app;
