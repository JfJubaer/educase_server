const express = require("express");
const router = express.Router();
const { addSchool, listSchools } = require("../controllers/schoolController");
const {
  validateSchoolData,
  validateLocationQuery,
} = require("../middleware/validation");

// Route to add a new school
router.post("/addSchool", validateSchoolData, addSchool);

// Route to list schools sorted by proximity
router.get("/listSchools", validateLocationQuery, listSchools);

module.exports = router;
