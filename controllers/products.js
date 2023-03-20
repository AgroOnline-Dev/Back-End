const {
  getProducts,
  addProduct,
  getProductById,
} = require("../models/product");
const db = require("../models/database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const getProductscontroller = (req, res) => {
  let sql = "select * from products";
  db.query(sql, (err, resuts) => {
    if (err) throw err;
    res.status(200).send(resuts);
  });
};

const getProductByIdController = (req, res) => {
  const id = req.params.id;
  db.query("select * from products WHERE id=?", [id], (err, results) => {
    if (err) throw err;
    if (results.length < 1) {
      return res.status(404).send({ message: "Not Found" });
    } else {
      if (!req.session.user)
        return res.status(200).send({ status: 0, product: results[0] });
      else return res.status(200).send({ status: 1, product: results[0] });
    }
  });
};

const addProductcontroller = (req, res) => {
  if (!req.cookies.Userlog) {
    res.status(200).send({ message: "User not connect" });
  }
  const user = jwt.verify(
    req.cookies.Userlog,
    process.env.JWT_SECRET,
    (err, id) => {
      if (err) throw err;
      return id;
    }
  );

  const { title, Description, stock } = req.body;
  const time = new Date(Date.now());
  const date =
    time.getFullYear() +
    "-" +
    time.getMonth() +
    1 +
    "-" +
    time.getDate() +
    " " +
    time.getHours() +
    ":" +
    time.getMinutes() +
    ":" +
    time.getSeconds();
  if (!title || !Description || !stock) {
    res.status(200).send({ message: "Please fill all fields" });
  }

  let sql = "insert into products (title,description,stock) values (?,?,?) ";
  let tableResults = [title, Description, stock];
  db.query(sql, tableResults, (err, resuts) => {
    if (err) throw err;
    res.status(201).send(resuts);
  });
};

const deleteProductcontroller = (req, res) => {
  if (!req.cookies.Userlog) {
    res.status(200).send({ message: "User not connect" });
  }
  const user = jwt.verify(
    req.cookies.Userlog,
    process.env.JWT_SECRET,
    (err, id) => {
      if (err) throw err;
      return id;
    }
  );
  const { id } = req.body;
  db.query("DELETE FROM `products` WHERE id=?", [id], (err, results) => {
    if (err) throw err;
    res.status(200).send(results);
  });
};

const searchProductsController = (req, res) => {
  const { searchValue } = req.query;
  const query = `
    SELECT id,title
    FROM products
    WHERE title LIKE '%${searchValue}%'
  `;
  db.query(query, (error, results) => {
    if (error) {
      res.status(500).json({ error });
    } else {
      res.json(results);
    }
  });
};

const addProductToCart = (req, res) => {
  if (!req.session.user) {
    res.status(200).send({ message: "User not connect" });
  }

  const { title, price, id_product } = req.body;
  const id = req.session.user.id_users;
  let sql =
    "insert into cart (title,price,id_users,id_product) values (?,?,?,?) ";
  let tableResults = [title, price, id, id_product];
  db.query(sql, tableResults, (err, resuts) => {
    if (err) throw err;
    res.status(201).send(resuts);
  });
};

const printCart = (req, res) => {
  if (!req.session.user) {
    res.status(200).send({ message: "User not connect" });
  }

  const id = req.session.user.id_users;
  let sql = "select * from cart WHERE id_users=?";
  db.query(sql, [id], (err, resuts) => {
    if (err) throw err;
    res.status(200).send(resuts);
  });
};

const countItemsToCart = (req, res) => {
  if (!req.session.user) {
    res.status(200).send({ status: 0, message: "User not connect" });
  }

  const id = req.session.user.id_users;
  let sql = "SELECT COUNT(id_item) as count FROM cart where id_users=?;";
  db.query(sql, [id], (err, resuts) => {
    if (err) throw err;

    res.send({ status: 1, message: resuts[0].count });
  });
};

const totalPriceToCart = (req, res) => {
  if (!req.session.user) {
    res.status(200).send({ status: 0, message: "User not connect" });
  }

  const id = req.session.user.id_users;
  let sql = "SELECT SUM(price) AS total FROM cart WHERE id_users=?;";
  db.query(sql, [id], (err, resuts) => {
    if (err) throw err;

    res.send({ status: 1, message: resuts[0].total });
  });
};

const deleteToCart = (req, res) => {
  if (!req.session.user) {
    res.status(200).send({ message: "User not connect" });
  }

  const { id } = req.body;

  let sql = "DELETE FROM `cart` WHERE id_item =? ";
  db.query(sql, [id], (err, resuts) => {
    if (err) throw err;
    res.status(200).send(resuts);
  });
};

const deleteCart = (req, res) => {
  if (!req.session.user) {
    res.status(200).send({ message: "User not connect" });
  }

  const id = req.session.user.id_users;

  let sql = "DELETE FROM `cart` WHERE id_users =? ";
  db.query(sql, [id], (err, resuts) => {
    if (err) throw err;
    res.status(200).send(resuts);
  });
};

const postAddProduct = (req, res) => {
  const { title, description, price, stock, email } = req.body;
  const image = `http://localhost:5000/add-product/${req.file.filename}`;

  // Récupération de l'id du vendeur correspondant à l'email fourni
  const sqlSelectSellerId =
    "SELECT id_sellers,region FROM sellers WHERE email = ?";
  db.query(sqlSelectSellerId, [email], (err, result) => {
    if (err) throw err;
    if (result.length < 1) {
      return res.send({ status: 1, message: "Invalid email" });
    }

    const sellerId = result[0].id_sellers;
    const sellerRegion = result[0].region;
    // Insertion des données dans la base de données
    const sqlInsertProduct =
      "INSERT INTO products (title, description, price, stock, img, id_sellers,region) VALUES (?, ?, ?, ?, ?, ?,?)";
    db.query(
      sqlInsertProduct,
      [title, description, price, stock, image, sellerId, sellerRegion],
      (err, result) => {
        if (err) throw err;
        res.send({ status: 1, message: "Product added" });
      }
    );
  });
};

const addProductToFacture = (req, res) => {
  if (!req.session.user) {
    res.status(200).send({ message: "User not connect" });
  }

  const { title, price, id_product } = req.body;
  const id = req.session.user.id_users;
  let sql =
    "insert into facture (title,price,id_users,id_product) values (?,?,?,?) ";
  let tableResults = [title, price, id, id_product];
  db.query(sql, tableResults, (err, resuts) => {
    if (err) throw err;
    res.status(201).send(resuts);
  });
};

module.exports = {
  getProductscontroller,
  addProductcontroller,
  deleteProductcontroller,
  searchProductsController,
  getProductByIdController,
  addProductToCart,
  printCart,
  countItemsToCart,
  totalPriceToCart,
  deleteToCart,
  deleteCart,
  postAddProduct,
  addProductToFacture,
};
