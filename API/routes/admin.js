const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const validation = require("../middleware/validation");
const loginSchema = require("../validation/loginValidation");
const paginatedResults = require('../middleware/paginationAdmin');
const Meeting = require("../models/Meeting");
const { searchResults } = require("../middleware/search");
const users = require("../models/users");
const { authRoute } = require("../middleware/authRoute");

router.post("/login", validation(loginSchema), adminController.login);
router.get("/AllUsers",authRoute,searchResults(users), adminController.AllUsers);
router.post("/AddMeeting",authRoute, adminController.AddMeeting);
router.get("/GetAllMeeting",authRoute, paginatedResults.paginatedResults(Meeting), adminController.GetAllMeeting);
router.get("/DetailMeeting/:id",authRoute, adminController.DetailMeeting);
router.post("/EditMeeting/:id",authRoute, adminController.EditMeeting);
router.post("/CancelMeeting/:id",authRoute, adminController.CancelMeeting);

module.exports = router;
