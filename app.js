//imports
const express = require("express");
// const db = require("./models/database");
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
// db.connect(function (error) {
//   if (error) {
//     throw error;
//   } else {
//     console.log("MySQL Database is connected Successfully");
//     app.listen(`  ${port}`, () => {
//       console.log("listenning to 5000");
//     });
//   }
// });
// Importation des modules
// const express = require("express"); // Importation du module Express
const con = require("./dbConnect");
// const cors = require("cors");
const routesAgricult = require("./routes/agriculteursRoutes");
const fs = require("fs");
const http = require("http");
const { Server } = require("socket.io");
// const path = require("path");
const fileUpload = require("express-fileupload");

// Instanciation du serveur express app
// const app = express();

//Definition du port serveur d'écoute
// const port=3001;

/* DEBUT PARTIE CHAT */
//Creation serveur pour les messages
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("Utilisateur connecté : " + socket.id);

  //REACTION A L'EVENT REJOINDRE ROOM
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log("Vous avez rejoint la room " + room);
  });

  //REACTION A L'EVENT ENVOIE DE MESSAGES
  socket.on("send-message", (message) => {
    const room = message.room;
    const user = message.userName;
    const contenu = message.content;
    const temps = message.time;
    const heure = message.hour;
    console.log("Send Message " + message.room);
    const reqSql =
      " INSERT INTO messages (temps,room,user,contenu,heure) VALUES (?,?,?,?,?)";
    con.query(reqSql, [temps, room, user, contenu, heure], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result) {
          console.log("Msg saved");
          io.to(message.room).emit("newMsgReceived", {
            id: new Date().getTime(),
            ...message,
          });
        } else {
          console.log("Pas d'ingenieurs");
        }
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Utilisateur déconnecté : " + socket.id);
  });
});
/* FIN PARTIE CHAT */

//Utilisation de cors pour faire le pont entre le domaine front et backend
app.use(express.json());
app.use(cors());
app.use(fileUpload());

//Definition des routes des agriculteurs
app.use(routesAgricult);

//Recuperation des Ingenieurs Agronomes deja enregistres dans la BD pour les afficher sur l'appli
app.get("/Ingenieurs", (req, res) => {
  const printIng = "select * from agronome";
  con.query(printIng, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result) {
        res.status(201).json(result);
      } else {
        console.log("Pas d'ingenieurs");
      }
    }
  });
});

/*
//INSERTION DES FICHES TECHNIQUES DANS LA BD SOUS FORMAT BLOB
 
    const nom='Citronier'
    const description="Ce fichier pdf est une fiche technique sur la culture du citronier. Elle montre comment"
    const filePath="C:/Users/HOUADINA TSONI/Desktop/FichesTech/Citronier.pdf"
    const pdfFile = fs.readFileSync(filePath);
    const query = 'INSERT INTO fichestechniques (nom,description,path) VALUES (?,?,?)';
    con.query(query, [nom,description,pdfFile], (err, results, fields) => {
      if (err) {
        console.log(err);
      } else {
        console.log('reussi');
      }
    });
  //};
 */

//RECUPERATION DES FICHES SE TROUVANT DANS LA BD POUR LES AFFICHER AU NIVEAU DE L'APP
app.get("/FichesTechniques", (req, res) => {
  const printFichesTech = "SELECT id,nom,description FROM fichestechniques";
  con.query(printFichesTech, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result) {
        console.log(result);
        res.status(201).json(result);
      } else {
        console.log("Pas de fiches techniques dans la BD");
      }
    }
  });
});
// RENVOIT LES IMAGES DU DOSSIERS RESSOURCES EN FONCTIONS DE LEURS NOMS
app.use(express.static(path.join(__dirname, "Ressources")));
// IMPORTATION DE MODULE
// const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const nodemailer = require('nodemailer');
// const app = express();
require("dotenv").config();
require("express-async-errors");
// const cors = require("cors");
// const fileUpload = require("express-fileupload");

// const express = require("express");
// const http = require("http");

                                                                // DEBUT CODE DE SHAKUR

// COMPOSANT
const adminRoute = require("./routes/adminRoute")
const db = require("./model/db");

//PORT UTILISE
// const port = 5000 || process.env.PORT;

app.use(express.json());
app.use(cookieParser());

// //VERIFICATION CONNEXION A LA BASE DE DONNEE
// db.connect((error) => {
//   if (error) throw error;
// });

//VERIFICATION DU TOKEN
const verificationToken = (req, res, next) => {
  const token = req.cookies["acces-token"];

  if (!token) {
    res.json({ status: "erreur", erreur: `Vous n'êtes pas connectés` });
    // res.redirect("/")
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log(err);
        res.clearCookie("acces-token", { path: "/" });
        res.redirect("/");
        // res.json({ status: "erreur", erreur: `n'a pas réussi à s'authentifier` });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};


app.use("/admin", adminRoute);

                                                                // FIN CODE DE SHAKUR

const router = require("./routes/agronomeRoute");
const agriculturerRouter = require("./routes/agriculteurRoute");
// const { Server } = require("socket.io");
// initialisong server with http module and not express because of socket.io
// const server = http.createServer(app);

// // creating the io server
// const io = new Server(server);

io.on("connection", (socket) => {
  console.log("User Connected => " + socket.id);

  // socket.on("EVENT")

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
// app.use(cors());
app.use(express.json());
// default option for file upload
app.use(fileUpload());
// routes

app.use("/agronome", router);
app.use("/agriculturer", agriculturerRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// const port = process.env.PORT || 3001;

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    server.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  }
});

// app.listen(PORT, (req, res) => {
//     console.log(`On écoute sur le port ${PORT}`);
// });

//Ecoute des requettes coté client sur le port 3001
// serveur.listen(port,()=>{
//     console.log("Server en ecoute au port :"+port);
// })
