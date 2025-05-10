const connection = require("../config/db");

class DesignController {

  formCreateDesign = (req, res) => {
    const {designer_id} = req.params;
    res.render("formCreateDesign", {designer_id});
  }

  createDesign = (req, res) => {
    const {designer_id} = req.params;
    const {design_name, orientation, clothing_fabric, type_of_clothing, color, design_description, design_img} = req.body;

    if(!design_name || !orientation || !clothing_fabric || !type_of_clothing || !color){
      res.render("formCreateDesign", {designer_id, message: "tiene que rellenar los campos obligatorios"})
    }

    else {
      let sql = "insert into design (designer_id, design_name, orientation, clothing_fabric, type_of_clothing, color, design_description) values (?,?,?,?,?,?,?)";
      let values = [designer_id, design_name, orientation, clothing_fabric, type_of_clothing, color, design_description]
  
      if(req.file){
        sql = "insert into design (designer_id, design_name, orientation, clothing_fabric, type_of_clothing, color, design_description, design_img) values (?,?,?,?,?,?,?,?)";
        values = [designer_id, design_name, orientation, clothing_fabric, type_of_clothing, color, design_description, req.file.filename];
      }
  
      connection.query(sql, values, (err, result) => {
        if(err){
          throw err
        }
        else{
          res.redirect(`/designer/profile/${designer_id}`);
        }
      })
    }
  }

  showFormEditDesign = (req, res) => {
    const {id} = req.params;
    let sql = "select * from design where design_id = ? and design_is_deleted = 0";
    connection.query(sql, [id], (err, result) => {
      if(err){
        throw err
      }
      else{
        res.render("formEditDesign", {result:result[0]})
      }
    }) 
  }

  editDesign = (req, res) => {
    const {id, designer_id} = req.params;
    const {design_name, orientation, clothing_fabric, type_of_clothing, color, design_description} = req.body;
    let sql = "update design set design_name =?, orientation =?, clothing_fabric =?, type_of_clothing =?, color =?, design_description =? where design_id =?";
    let values = [design_name, orientation, clothing_fabric, type_of_clothing, color, design_description, id];

    connection.query(sql, values, (err, result) => {
      if(err){
        throw err
      }
      else{      
        res.redirect(`/designer/profile/${designer_id}`);
      }
    })  
  } 

  delTotal = (req, res) => {
    const {designer_id, design_id} = req.params; 
    let sql = "delete from design where design_id = ?";

    connection.query(sql, [design_id], (err, result) => {
      if(err){
        throw err
      }
      else{   
        res.redirect(`/designer/profile/${designer_id}`)
      }
    })
  } 
}

module.exports = new DesignController();