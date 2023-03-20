//imports
const express = require("express");
const db = require("./models/database");
const productsRoutes = require("./routes/products");
const usersRoutes = require("./routes/users");
const sellersRoutes = require("./routes/sellers");
const bodyParser = require("body-parser");
const path = require("path");
const cookies = require("cookie-parser");
const proxy = require("http-proxy-middleware");
const cors = require("cors");
const session = require("express-session");
//initialisation
const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookies());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    key: "sessionId",
    secret: "SessionSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: new Date("01 12 2025"),
    },
  })
);

//configuration des routes
// products routes
app.use("/", productsRoutes);
app.use("/add-product", express.static("uploads/images"));
// users routes
app.use("/users", usersRoutes);
// sellers routes
app.use("/sellers", sellersRoutes);

//lancer le serveur
const port = 5000 || process.env.PORT;
db.connect(function (error) {
  if (error) {
    throw error;
  } else {
    console.log("MySQL Database is connected Successfully");
    app.listen(`  ${port}`, () => {
      console.log("listenning to 5000");
    });
  }
});
