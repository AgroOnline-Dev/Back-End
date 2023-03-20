const db = require("./database");

function getProducts() {
  let sql = "select * from produit";
  db.query(sql, (err, resuts) => {
    if (err) throw err;
    return resuts;
  });
}

function addProduct(title, Description, stock) {
  let sql = "insert into products (title,description,stock) values (?,?,?) ";
  let tableResults = [title, Description, stock];
  db.query(sql, tableResults, (err, resuts) => {
    if (err) throw err;
    console.log(resuts);
  });
}

function getProductById(id) {
  let sql = "select * from products where id =? ";
  let tableResults = [id];
  db.query(sql, tableResults, (err, resuts) => {
    if (err) throw err;
    console.log(resuts);
  });
}

module.exports = {
  getProducts,
  addProduct,
  getProductById,
};
