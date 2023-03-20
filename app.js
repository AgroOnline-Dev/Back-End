// IMPORTATION DE MODULE
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// const nodemailer = require('nodemailer');
const app = express();
require("dotenv").config();
require("express-async-errors");
const cors = require("cors");
const fileUpload = require("express-fileupload");

// const express = require("express");
const http = require("http");

// COMPOSANT
const db = require("./model/db");
const registerAdmin = require("./controllers/connectivite/registerAdmin");
const loginAdmin = require("./controllers/connectivite/loginAdmin");
const profile = require("./controllers/profile");
const udpdateInfo = require("./controllers/updateInfo");
const adminDisplay = require("./controllers/adminGestion/adminDisplay");
const adminSearch = require("./controllers/adminGestion/adminSearch");
const adminDelete = require("./controllers/adminGestion/adminDelete");
const displayUsers = require("./controllers/gestionUsers/displayUsers");
const searchUsers = require("./controllers/gestionUsers/searchUsers");
const deleteUsers = require("./controllers/gestionUsers/deleteUsers");
const disconnectAdmin = require("./controllers/connectivite/disconnectAdmin");

//PORT UTILISE
const PORT = 5000 || process.env.PORT;

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

//PAGE D'ACCEUIL
app.get("/", (req, res) => {
  res.send(
    "BIENVENU A LA PARTIE ADMINISTRATEUR DU PROJET AGRO On-Line. VEUILLEZ VOUS CONNECTEZ !!!"
  );
});

//INSCRIPTION
app.post("/inscription", registerAdmin);

//CONNEXION
app.post("/seConnecter", loginAdmin);

//PROFIL
app.get("/profil", verificationToken, profile);

// MODIFICATION DES INFORMATIONS (NOM, PRENOM, MOT DE PASSE)
app.post("/infoUpdate", verificationToken, udpdateInfo.infoNormal);

// MODIFICATION DU MOT DE PASSE
app.post("/passwordUpdate", verificationToken, udpdateInfo.password);

// GESTION DES ADMINISTRATEURS
// AFFICHER LES ADMINISTRATEURS
app.get("/adminGestion", verificationToken, adminDisplay);

// RECHERCHE ADMINISTRATEUR AVEC NOM OU PRENOM
app.post("/adminSearch", verificationToken, adminSearch);

// SUPPRIMER ADMINISTRATEUR
app.post("/adminDelete/:id", verificationToken, adminDelete);

//GESTION DES UTILISATEURS
// POUR LE USERS
// AFFICHER USERS
app.get("/usersGestion", verificationToken, displayUsers.users);

// RECHERCHE UTILISATEUR AVEC NOM OU PRENOM
app.post("/userSearch", verificationToken, searchUsers.users);

// / SUPPRIMER USERS
app.post("/usersDelete/:id", verificationToken, deleteUsers.users);

// POUR L'INVESTISSEUR
// AFFICHER INVESTISEUR
app.get("/investisseurGestion", verificationToken, displayUsers.investisseur);

// RECHERCHE INVESTISSEUR AVEC NOM OU PRENOM
app.post("/investisseurSearch", verificationToken, searchUsers.investisseur);

// / SUPPRIMER INVESTISSEUR
app.post(
  "/investisseurDelete/:id",
  verificationToken,
  deleteUsers.investisseur
);

// POUR UN DEMANDEUR
// AFFICHER DEMANDEUR
app.get("/demandeurGestion", verificationToken, displayUsers.demandeur);

// RECHERCHE DEMANDEUR AVEC NOM OU PRENOM
app.post("/demandeurSearch", verificationToken, searchUsers.demandeur);

// SUPPRIMER DEMANDEUR
app.post("/demandeurDelete/:id", verificationToken, deleteUsers.demandeur);

// POUR UN AGRONOME
// AFFICHER LES AGRONOMES
app.get("/agronomeGestion", verificationToken, displayUsers.agronome);

// SUPPRIMER AGRONOME
app.post("/agronomeDelete/:id", verificationToken, deleteUsers.agronome);

// POUR UN AGRICULTEUR
// AFFICHER LES AGRICULTEURS
app.get("/agriculteurGestion", verificationToken, displayUsers.agriculteur);

// SUPPRIMER AGRICULTEUR
app.post("/agriculteurDelete/:id", verificationToken, deleteUsers.agriculteur);

//DECONNEXION
app.get("/seDeconnecter", verificationToken, disconnectAdmin);

const router = require("./routes/agronomeRoute");
const agriculturerRouter = require("./routes/agriculteurRoute");
const { Server } = require("socket.io");
// initialisong server with http module and not express because of socket.io
const server = http.createServer(app);

// creating the io server
const io = new Server(server);

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
app.use(cors());
app.use(express.json());
// default option for file upload
app.use(fileUpload());
// routes

app.use("/agronome", router);
app.use("/agriculturer", agriculturerRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3001;

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
