const bcrypt = require("bcryptjs");
const Joi = require("joi");
const { User } = require("../models/userModel");
const { generateToken } = require("../utils/jwt");
const { Toy } = require("../models/toyModel");

const userJoiSchema = {
  login: Joi.object().keys({
    password: Joi.string(),
    email: Joi.string()
      .email({ tlds: { allow: ["com"] } })
      .error(() => Error("Email is not valid")),
  }),
  register: Joi.object().keys({
    password: Joi.string().max(20).required(),
    email: Joi.string()
      .email({ tlds: { allow: ["com"] } })
      .error(() => Error("Email is not valid")),
    fullName: Joi.object().keys({
      firstName: Joi.string().required(),
      lastName: Joi.string(),
    }),
    role: Joi.string(),
  }),
};

const checkIfUserExists = async (email) => {
  const user = await User.findOne({ email });
  if (user) return user;
  return false;
};

const isAdmin = async (userId) => {
  const user = await User.findOne({ _id: userId });
  const isManager = user.role == "admin";
  return isManager;
};

exports.getAllUsers = async (req, res, next) => {
  const userId = res.locals.userId;
  try {
    if (!(await isAdmin(userId)))
      throw new Error("You not allowd to get the users list");
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.register = async (req, res, next) => {
  const body = req.body;
  try {
    const validate = userJoiSchema.register.validate(body);
    if (validate.error) throw Error(validate.error);
    if (await checkIfUserExists(body.email)) {
      throw new Error("Already in the system");
    }
    const hash = await bcrypt.hash(body.password, 10);
    body.password = hash;

    const newUser = new User(body);
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const body = req.body;
  try {
    const validate = userJoiSchema.login.validate(body);
    if (validate.error) throw Error(validate.error);
    const user = await checkIfUserExists(body.email);
    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      throw new Error("Password or email not valid");
    }
    const token = generateToken(user);
    return res.send({ user, token });
  } catch (error) {
    next(error);
  }
};

// exports.updateDetails = async (req, res, next) => {
//   const userId = res.locals.userId;
//   try {
//     const user = await User.updateOne({ _id: userId }, req.body);
//     res.json(user);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(400);
//   }
// };

// exports.deleteUser = async (req, res, next) => {
//   const userId = res.locals.userId;
//   try {
//     const user = await User.deleteOne({ _id: userId });
//     console.log(user);
//     res.json(user);
//   } catch (error) {
//     console.log(error);
//     res.sendStatus(400);
//   }
// };
