const express = require("express");
const router = express.Router()
const userController = require('../controllers/userController');
const validation  = require("../middleware/validation");
const registerSchema = require("../validation/registrationValidation");
const loginSchema = require("../validation/loginValidation");


router.post('/register', validation(registerSchema),userController.register)
router.post('/login', validation(loginSchema), userController.login)



module.exports = router;