const { app } = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const mongoUrl = process.env.MONGO_URL;

const connectToDB = () => {
  mongoose
    .connect(mongoUrl)
    .then((con) => {
      console.log(`connect to ${mongoUrl}`);
    })
    .catch((error) => {
      console.error("error to connect to database");
      console.error(error);
    });
};
connectToDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`the server is running on port ${PORT}`);
});
