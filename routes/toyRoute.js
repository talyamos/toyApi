const express = require("express");
const {
  getToys,
  addToy,
  deleteToy,
  searchToy,
  searchByCategory,
  updateToy,
  searchById,
  getByPrices,
} = require("../controllers/toyController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getToys);
router.get("/search", searchToy);
router.get("/single/:id", searchById);
router.get("/prices", getByPrices);
router.get("/category/:cat", searchByCategory);
router.post("/", auth(), addToy);
router.patch("/:editId", auth(), updateToy);
router.delete("/:delId", auth(), deleteToy);

module.exports = router;
