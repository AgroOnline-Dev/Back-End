const express = require("express");

const router=express.Router();

const agriculteur = require("../logique");
 
// Route Creation des comptes utilisateurs
router.post('/register',agriculteur.register)
 
//Route Connexion au compte utilisateur
router.post('/login',agriculteur.login)

//Ajout de l'identifiant de l'ing agronome dans la table de agriculteur
router.post("/login/Ingenieurs",agriculteur.getAgronomes)

//Recuperation des infos de l'agriculteur pour afficher sur le Drawer
router.get("/Agriculteurs/:Email",agriculteur.getUserInfoDrawer)

//ROUTE POUR LES SUGGESTIONS FAITES PAR LE USER
router.post("/Suggestions",agriculteur.doSuggestions)

//ROUTE POUR MODIFIER NOM
router.post("/modifyName",agriculteur.modifyName)

//ROUTE POUR MODIFIER PHOTO PROFIL
router.post('/upload/:email', agriculteur.modifyImageProfile);

//Ce route permet de renvoyer un fichier se trouvant dans la BD dont le chemin est de type BLOB
router.get('/FichesTechniques/:id/:nom', agriculteur.downloadFile);
 
module.exports = router;