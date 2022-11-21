const express = require("express");
const router = express.Router()
const adminController = require('../controllers/adminController');
const validation  = require("../middleware/validation");
const loginSchema = require("../validation/loginValidation");

router.post('/login', validation(loginSchema), adminController.login)
router.post('/AddMeeting', adminController.AddMeeting)
router.post('/GetAllMeeting', adminController.GetAllMeeting)



module.exports = router;
