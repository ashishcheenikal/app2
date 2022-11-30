const express = require("express");
const router = express.Router()
const userController = require('../controllers/userController');
const validation  = require("../middleware/validation");
const registerSchema = require("../validation/registrationValidation");
const loginSchema = require("../validation/loginValidation");
const resetSchema = require("../validation/resetPassValidation");
const passSchema = require("../validation/passwordSchema");
const { paginatedResults } = require("../middleware/pagination");
const Meeting = require("../models/Meeting");
const { authRoute } = require("../middleware/authRoute");


router.post('/register', validation(registerSchema),userController.register)

router.post('/login', validation(loginSchema), userController.login)

router.post('/resetPassword',validation(resetSchema), userController.resetPassword)

router.post('/newPassword/:id/:token',validation(passSchema), userController.newPassword)

router.get("/GetAllMeeting",authRoute, paginatedResults(Meeting), userController.GetAllMeeting);

router.get("/meeting/:id",authRoute,userController.joinMeeting)





module.exports = router;