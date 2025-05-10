const connection = require("../config/db");

class IndexControler {

  showHome = (req, res) => {
    let sql = "select * from designer where designer_is_deleted = 0";
    connection.query(sql, (err, result) => {
      if(err){
        throw err
      }
      else{
        res.render("index", {result});
      }
    })
  }
}

module.exports = new IndexControler();