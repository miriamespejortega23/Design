var express = require('express');
const designController = require('../controllers/designController');
const uploadFile = require('../middleware/uploadFile');
var router = express.Router();


//http://localhost:4000/design/createDesign/1
router.get("/formCreateDesign/:designer_id", designController.formCreateDesign);

//http://localhost:4000/design/createDesign/1
router.post("/createDesign/:designer_id", uploadFile("designs"), designController.createDesign);

//http://localhost:4000/design/formEditDesign/1(diseño)
router.get("/formEditDesign/:id", designController.showFormEditDesign);

//http://localhost:4000/design/editDesign/1(diseño)/1(diseñador)
router.post("/editDesign/:id/:designer_id", designController.editDesign);

router.get("/delTotalDesign/:designer_id/:design_id", designController.delTotal) 



module.exports = router;
