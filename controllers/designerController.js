const connection = require("../config/db");
const bcrypt = require("bcrypt");

class DesignerController {

  showRegisterForm = (req, res) => {
    res.render("formRegister");
  }

  register = (req, res) => {
    const {name, last_name, city, phone_number, email, description, password, repPassword} = req.body;

    if(!name || !last_name || !email || !password || !repPassword){
      res.render("formRegister", {message: "campo obligatorio incompleto"})
    }
    else{
      if(password != repPassword){
        res.render("formRegister", {message:"Las contraseñas no coinciden"})
      }
      else{
        bcrypt.hash(password, 10, (err, hash) => {

          if(err){
            throw err;
          }

          else{
            let sql = "insert into designer (name, last_name, email, password, city, phone_number, description) values (?,?,?,?,?,?,?)";
            let values = [name, last_name, email, hash, city, phone_number, description];

            if(req.file){
              sql = "insert into designer (name, last_name, email, password, city, phone_number, description, designer_img) values (?,?,?,?,?,?,?,?)";
              values = [name, last_name, email, hash, city, phone_number, description, req.file.filename];
            }

            connection.query(sql, values, (errSql, result) => {
              if(errSql){
                if(errSql.errno == 1062){
                  res.render("formRegister", {message: "este email está en uso, intentelo con otro"})
                }
                else{
                  throw errSql
                }
              }
              else{                
                res.redirect("/");
              }
            })
          }
        })
      }
    }
  }

  profile = (req, res) => {
    const {id} = req.params;
    
    let sql = `select designer.*, design.design_id, design.design_name, design.orientation, design.clothing_fabric, design.type_of_clothing, design.color, design.design_description, design.design_img
    from designer left join design
    on designer.designer_id = design.designer_id
    and design.design_is_deleted = 0
    where designer.designer_is_deleted = 0
    and designer.designer_id = ?`;


    connection.query(sql, [id], (err, result) => {
      if(err){
        throw err
      }
      else{
        let finalResult = {};
        let designs = [];
        let design = {};
        
        result.forEach((elem) => {
          if(elem.design_id){
            design = {
              design_id: elem.design_id,
              design_name: elem.design_name,
              orientation: elem.orientation,
              clothing_fabric: elem.clothing_fabric,
              type_of_clothing: elem.type_of_clothing,
              color: elem.color,
              design_description: elem.design_description,
              design_img: elem.design_img,
            }
            designs.push(design);
          }
        })

        finalResult = {
          designer_id: result[0].designer_id,
          name: result[0].name,
          last_name: result[0].last_name,
          description: result[0].description,
          city: result[0].city,
          phone_number: result[0].phone_number,
          email: result[0].email,
          designer_img: result[0].designer_img,
          designs
        }

        res.render("designerProfile", {finalResult});
      }
    })
  }

  formLogin = (req, res) => {
    res.render("formLogin", {message:""});
  }

  login = (req, res) => {
    const {email, password} = req.body;
    
    if(!email || !password){
      res.render("formLogin", {message: "Debes cumplimentar todos los datos"})
    }

    else{
      let sql = "select * from designer where email =? and designer_is_deleted = 0";
      connection.query(sql, [email], (err, result) => {
        if(err){
          throw err
        }
        else{
          if(result.length == 0){
            console.log("*****", result)
            res.render("formLogin", {message: "el email no existe"})
          }
          else{
            let hash = result[0].password;
            bcrypt.compare(password, hash, (errHash, resultCompare) => {
              if(errHash){
                throw err
              }
              else{
                if(!resultCompare){
                  res.render("formLogin", {message:"la contraseña no existe"});
                }
                else{
                  res.redirect(`/designer/profile/${result[0].designer_id}`);
                }
              }
            })
          }
        }
      })
    }
  }
}

module.exports = new DesignerController();