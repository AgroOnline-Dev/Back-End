const express = require("express");

const productController = require("../controllers/products");
const upload = require("../config/multer-config");
const router = express.Router();

router.get("/", productController.getProductscontroller);
router.get("/Product/:id", productController.getProductByIdController);
router.get("/get-Product?title=", productController.searchProductsController);
router.post(
  "/add-product",
  upload.single("image"),
  productController.postAddProduct
);

router.post("/add-To-Cart", productController.addProductToCart);
router.get("/print-cart", productController.printCart);
router.get("/count-item", productController.countItemsToCart);
router.get("/Total-cart", productController.totalPriceToCart);
router.get("/search-product", productController.searchProductsController);
router.delete("/delete-item", productController.deleteToCart);
router.delete("/delete-cart", productController.deleteCart);
router.delete("/delete-product", productController.deleteProductcontroller);

router.post("/add-facture", productController.addProductToFacture);
module.exports = router;
