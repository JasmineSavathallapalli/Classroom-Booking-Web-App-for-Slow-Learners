const express = require("express");
const Classroom = require("../models/classroom.model");

const {
  fetchAll,
  deleteClass,
  fetchAvailable,
} = require("../controllers/classroom.controller");

const router = express.Router();

// Fetch all classrooms from the database
router.get("/list", fetchAll);
router.get("/available", fetchAvailable);

// TODO: Authorize before creation

const { body, validationResult, check } = require("express-validator");

router.post(
  "/add",
  [
    body("name").isString().withMessage("Name must be a string"),
    body("capacity")
      .isInt({ min: 1 })
      .withMessage("Capacity must be a positive integer"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, capacity } = req.body;
      const newClass = new Classroom({
        name,
        capacity,
      });
      await newClass.save();
      res.status(200).json({ message: "Classroom added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  }
);

router.delete(
  "/delete",
  [check("id").isMongoId().withMessage("Invalid id")],
  deleteClass
);

module.exports = router;
