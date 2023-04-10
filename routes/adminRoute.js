const express = require("express");

const router = express.Router();
const registerAdmin = require("../controllers/connectivite/registerAdmin");
const loginAdmin = require("../controllers/connectivite/loginAdmin");
const profile = require("../controllers/profile");
const udpdateInfo = require("../controllers/updateInfo");
const adminDisplay = require("../controllers/adminGestion/adminDisplay");
const adminSearch = require("../controllers/adminGestion/adminSearch");
const adminDelete = require("../controllers/adminGestion/adminDelete");
const displayUsers = require("../controllers/gestionUsers/displayUsers");
const searchUsers = require("../controllers/gestionUsers/searchUsers");
const deleteUsers = require("../controllers/gestionUsers/deleteUsers");
const disconnectAdmin = require("../controllers/connectivite/disconnectAdmin");

//PAGE D'ACCEUIL
router.get("/accueil", (req, res) => {
    res.send(
      "BIENVENU A LA PARTIE ADMINISTRATEUR DU PROJET AGRO On-Line. VEUILLEZ VOUS CONNECTEZ !!!"
    );
  });
  
  //INSCRIPTION
  router.post("/inscription", registerAdmin);
  
  //CONNEXION
  router.post("/seConnecter", loginAdmin);
  
  //PROFIL
  router.get("/profil",  profile);
  
  // MODIFICATION DES INFORMATIONS (NOM, PRENOM, MOT DE PASSE)
  router.post("/infoUpdate",  udpdateInfo.infoNormal);
  
  // MODIFICATION DU MOT DE PASSE
  router.post("/passwordUpdate",  udpdateInfo.password);
  
  // GESTION DES ADMINISTRATEURS
  // AFFICHER LES ADMINISTRATEURS
  router.get("/adminGestion/", adminDisplay);
  
  // RECHERCHE ADMINISTRATEUR AVEC NOM OU PRENOM
  router.post("/adminSearch", adminSearch);
  
  // SUPPRIMER ADMINISTRATEUR
  router.post("/adminDelete/:id", adminDelete);
  
  //GESTION DES UTILISATEURS
  // POUR LE USERS
  // AFFICHER USERS
  router.get("/usersGestion", displayUsers.users);
  
  // RECHERCHE UTILISATEUR AVEC NOM OU PRENOM
  router.post("/userSearch", searchUsers.users);
  
  // / SUPPRIMER USERS
  router.post("/usersDelete/:id", deleteUsers.users);
  
  // POUR L'INVESTISSEUR
  // AFFICHER INVESTISEUR
  router.get("/investisseurGestion", displayUsers.investisseur);
  
  // RECHERCHE INVESTISSEUR AVEC NOM OU PRENOM
  router.post("/investisseurSearch", searchUsers.investisseur);
  
  // / SUPPRIMER INVESTISSEUR
  router.post(
    "/investisseurDelete/:id",
    deleteUsers.investisseur
  );
  
  // POUR UN DEMANDEUR
  // AFFICHER DEMANDEUR
  router.get("/demandeurGestion", displayUsers.demandeur);
  
  // RECHERCHE DEMANDEUR AVEC NOM OU PRENOM
  router.post("/demandeurSearch",  searchUsers.demandeur);
  
  // SUPPRIMER DEMANDEUR
  router.post("/demandeurDelete/:id",  deleteUsers.demandeur);
  
  // POUR UN AGRONOME
  // AFFICHER LES AGRONOMES
  router.get("/agronomeGestion",  displayUsers.agronome);
  
  // SUPPRIMER AGRONOME
  router.post("/agronomeDelete/:id",  deleteUsers.agronome);
  
  // POUR UN AGRICULTEUR
  // AFFICH
  router.get("/agriculteurGestion",  displayUsers.agriculteur);
  
  // SUPPRIMER AGRICULTEUR
  router.post("/agriculteurDelete/:id",  deleteUsers.agriculteur);
  
  //DECONNEXION
  router.get("/seDeconnecter", disconnectAdmin);


module.exports = router; 