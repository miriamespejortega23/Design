var express = require('express');
const designerController = require('../controllers/designerController');
const uploadFile = require('../middleware/uploadFile');
var router = express.Router();

//http://localhost:4000/designer/registerForm
router.get("/registerForm", designerController.showRegisterForm)

//http://localhost:4000/designer/register
router.post("/register", uploadFile("designers"), designerController.register)

//http://localhost:4000/designer/profile/1
router.get("/profile/:id", designerController.profile);

//http://localhost:4000/designer/loginForm
router.get("/formLogin", designerController.formLogin);

//http://localhost:4000/designer/login
router.post("/login", designerController.login);


module.exports = router;
