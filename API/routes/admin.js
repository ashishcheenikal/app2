const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const validation = require("../middleware/validation");
const loginSchema = require("../validation/loginValidation");
const paginatedResults = require('../middleware/paginationAdmin');
const Meeting = require("../models/Meeting");
const { searchResults } = require("../middleware/search");
const users = require("../models/users");

router.post("/login", validation(loginSchema), adminController.login);
router.get("/AllUsers",searchResults(users), adminController.AllUsers);
router.post("/AddMeeting", adminController.AddMeeting);
router.get("/GetAllMeeting", paginatedResults.paginatedResults(Meeting), adminController.GetAllMeeting);
router.get("/DetailMeeting/:id", adminController.DetailMeeting);
router.post("/EditMeeting/:id", adminController.EditMeeting);
router.post("/CancelMeeting/:id", adminController.CancelMeeting);

module.exports = router;
