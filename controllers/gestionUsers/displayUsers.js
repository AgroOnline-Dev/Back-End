// IMPORTATION DE MODULE
const db = require("../../model/db");

exports.users = (req, res) => {

    // SELECTIONNER TOUS LES UTILISATEURS
    db.query("SELECT  id_users, name, email, profil FROM agro.users", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    });
}

exports.sellers = (req, res) => {

    // SELECTIONNER TOUS LES VENDEURS
    db.query("SELECT id_sellers, name, email, region, profil FROM agro.sellers", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    })
}

exports.investisseur = (req, res) => {

    // SELECTIONNER TOUS LES INSVESTISSEURS
    db.query("SELECT id, nom, mail, region, photo FROM agro.investisseurs", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    });
}

exports.demandeur = (req, res) => {

    // SELECTIONNER TOUS LES DEMANDEURS
    db.query("SELECT id, nom, mail, region, besoin, photo FROM agro.demandeurs", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results })
        }
    });
}

exports.agronome = (req, res) => {

    // SELECTIONNER TOUS LES AGRONOMES
    db.query("SELECT name, email, speciality, experience, profile_image FROM agro.agronome", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    });
}

exports.agriculteur = (req, res) => {

    // SELECTIONNER TOUS LES AGRICULTEURS
    db.query("SELECT pseudos, emails, region, photo FROM agro.agriculteurs", (error, results) => {
        if (error) {
            throw error;
        } else {
            res.json({ results: results });
        }
    });
}