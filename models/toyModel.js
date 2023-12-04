const { Schema, model, default: mongoose } = require("mongoose");

const toySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Construction Toys",
      "Dolls & Dollhouses",
      "Outdoor/Action Toys",
      "Pretend Play/Food Play",
      "Remote Control & Play Vehicles",
    ],
    required: true,
  },
  img_url: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Toy = model("Toy", toySchema);
module.exports.Toy = Toy;
