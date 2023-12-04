const Joi = require("joi");
const { Toy } = require("../models/toyModel");
const { User } = require("../models/userModel");

const toyJoiSchema = {
  addToy: Joi.object().keys({
    name: Joi.string().required(),
    info: Joi.string().required(),
    category: Joi.string().required(),
    img_url: Joi.string().max(200),
    price: Joi.number().min(1).max(1500),
  }),
};

const isAdmin = async (userId) => {
  const user = await User.findOne({ _id: userId });
  const isManager = user.role == "admin";
  return isManager;
};

const isOwner = async (toyId, userId) => {
  const toy = await Toy.findOne({ _id: toyId });
  if (toy.user_id == userId) return true;
  return false;
};

exports.getToys = async (req, res, next) => {
  try {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;
    const toys = await Toy.find({})
      .limit(perPage)
      .skip((page - 1) * perPage);
    res.send(toys);
  } catch (error) {
    next(error);
  }
};

exports.addToy = async (req, res, next) => {
  const body = req.body;
  const userId = res.locals.userId;
  try {
    const validate = toyJoiSchema.addToy.validate(body);
    if (validate.error) throw Error(validate.error);
    const newToy = new Toy(body);
    newToy.user_id = userId;
    await newToy.save();
    res.status(201).send(newToy);
  } catch (error) {
    next(error);
  }
};

exports.searchToy = async (req, res) => {
  try {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;
    const queryS = req.query.s;
    const searchReg = new RegExp(queryS, "i");
    const data = await Toy.find({
      $or: [{ name: searchReg }, { info: searchReg }],
    })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ price: 1 });
    res.send(data);
  } catch (err) {
    console.log(err);
    next(error);
  }
};

exports.searchByCategory = async (req, res) => {
  try {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;
    const category = req.params.cat;
    const searchReg = new RegExp(category, "i");
    const data = await Toy.find({ category: searchReg })
      .limit(perPage)
      .skip((page - 1) * perPage);
    res.send(data);
  } catch (err) {
    console.log(err);
    next(error);
  }
};

exports.getByPrices = async (req, res) => {
  try {
    const perPage = req.query.perPage || 10;
    const page = req.query.page || 1;
    const min = req.query.min;
    const max = req.query.max;
    console.log(min, max);
    const data = await Toy.find({
      $and: [{ price: { $gt: min } }, { price: { $lt: max } }],
    })
      .limit(perPage)
      .skip((page - 1) * perPage);
    res.send(data);
  } catch (err) {
    console.log(err);
    next(error);
  }
};

exports.searchById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Toy.find({ _id: id });
    res.send(data);
  } catch (err) {
    console.log(err);
    next(error);
  }
};

exports.deleteToy = async (req, res, next) => {
  const delId = req.params.delId;
  const userId = res.locals.userId;
  try {
    if (!(await isOwner(delId, userId)) && !(await isAdmin(userId)))
      throw new Error("You not allowd to delete this toy");
    const toy = await Toy.deleteOne({ _id: delId });
    res.send(toy);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateToy = async (req, res, next) => {
  const editId = req.params.editId;
  const userId = res.locals.userId;
  try {
    if (!(await isOwner(editId, userId)) && !(await isAdmin(userId)))
      throw new Error("You not allowd to edit this toy");
    const toy = await Toy.updateOne({ _id: editId }, req.body);
    res.send(toy);
  } catch (error) {
    next(error);
  }
};
